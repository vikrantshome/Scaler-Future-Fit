require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

console.log(`Environment: ${process.env.NODE_ENV}`);

const puppeteer = process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer');
const chromium = require('@sparticuz/chromium');
const { PDFDocument } = require('pdf-lib');
const StudentProfile = require('./models/StudentProfile');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- GLOBAL CACHE ---
const CACHE = {
    templates: {},
    riasecDescriptions: null,
    images: {}
};

// --- SINGLETON BROWSER ---
let browserInstance = null;

async function getBrowser() {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }
    
    console.log('🔄 Launching new browser instance...');
    try {
        const options = process.env.NODE_ENV === 'production' ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        } : {
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        };
        
        console.log('Browser launch options:', JSON.stringify(options, null, 2));

        browserInstance = await puppeteer.launch(options);
        console.log('✅ Browser launched successfully');
        return browserInstance;
    } catch (e) {
        console.error('❌ Failed to launch browser:', e);
        throw e;
    }
}

// --- INITIALIZATION ---
async function preloadAssets() {
    console.log('🚀 Preloading assets and templates...');
    
    try {
        // 1. Load JSON Data
        try {
            const riasecData = await fs.readFile(path.join(__dirname, 'raisec_description.json'), 'utf8');
            CACHE.riasecDescriptions = JSON.parse(riasecData);
        } catch (e) {
            console.warn('⚠️ raisec_description.json not found, using defaults.');
            CACHE.riasecDescriptions = {};
        }

        // Preload Logos
        try {
            // Check if assets exist, otherwise use placeholders or skip
            const logoFiles = {
                'allen': 'assets/page1/sst_logo.png',
                'allen_footer': 'assets/page1/sst_logo.png', // Using same logo for footer for now or placeholder
                'compass': 'assets/page1/compass.png'
            };
            
            for (const [key, filePath] of Object.entries(logoFiles)) {
                try {
                    const imgPath = path.join(__dirname, 'templates', filePath);
                    const base64 = await fs.readFile(imgPath, 'base64');
                    const ext = path.extname(imgPath).substring(1);
                    CACHE.images[key] = `data:image/${ext};base64,${base64}`;
                } catch (err) {
                    console.warn(`⚠️ Image ${filePath} not found. Skipping.`);
                }
            }
        } catch (e) {
            console.error('Error loading logos:', e);
        }

        // 2. Load and Pre-process Templates
        const templates = ['page1.html', 'page2.html', 'branch_page.html', 'page6.html'];
        
        for (const tName of templates) {
            try {
                let html = await fs.readFile(path.join(__dirname, 'templates', tName), 'utf8');
                
                // Find all image tags and replace with Base64 immediately
                const imageSrcRegex = /src="\.\/assets\/([^"]+)"/g;
                let match;
                const replacements = [];
                while ((match = imageSrcRegex.exec(html)) !== null) {
                    replacements.push({ fullMatch: match[0], fileName: match[1] });
                }

                for (const rep of replacements) {
                    try {
                        const imgPath = path.join(__dirname, 'templates', 'assets', rep.fileName);
                        const base64 = await fs.readFile(imgPath, 'base64');
                        const ext = path.extname(imgPath).substring(1);
                        const dataUrl = `data:image/${ext};base64,${base64}`;
                        html = html.replace(rep.fullMatch, `src="${dataUrl}"`);
                    } catch (e) {
                        // console.warn(`⚠️ Warning: Could not preload image ${rep.fileName} in ${tName}`);
                    }
                }
                CACHE.templates[tName] = html;
            } catch (err) {
                 console.warn(`⚠️ Template ${tName} not found.`);
            }
        }
        console.log('✅ Assets preloaded successfully.');
    } catch (error) {
        console.error('❌ Critical Error preloading assets:', error);
    }
}

// --- LOGIC HELPERS ---

function getRiasecInsight(vibeScores) {
    if (!vibeScores || Object.keys(vibeScores).length === 0) return "No RIASEC scores available.";
    const highestRiasecType = Object.entries(vibeScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    return CACHE.riasecDescriptions?.[highestRiasecType] || "Your profile suggests a strong alignment with this domain.";
}

function populateBranchPage(htmlContent, branchesToRender, startIndex = 0) {
    if (!branchesToRender || branchesToRender.length === 0) {
        return htmlContent.replace('{{BRANCH_CARDS}}', '');
    }

    const cardsHtml = branchesToRender.map((item, index) => {
        const globalIndex = startIndex + index + 1;
        const branch = item.branch;
        const score = Math.round(item.score);
        
        // --- 1. Sub-Careers ---
        const subCareersHtml = (branch.subCareers || []).slice(0, 3).map(career => `
            <li class="text-sm mb-2">
                <div class="font-semibold text-slate-800">${career.name}</div>
                <div class="text-xs text-slate-500 truncate">
                    <span class="font-medium text-slate-400">Hiring:</span> ${career.recruiters?.join(', ') || 'Top Tech Companies'}
                </div>
            </li>
        `).join('');

        const subCareersSection = subCareersHtml ? `
            <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-header-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Career Paths
                </h4>
                <ul class="space-y-2">
                    ${subCareersHtml}
                </ul>
            </div>
        ` : '';

        // --- 2. Exams ---
        const examsHtml = (branch.exams || []).slice(0, 3).map(exam => {
            let badgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
            if (exam.type === 'National') badgeColor = 'bg-purple-100 text-purple-700 border-purple-200';
            else if (exam.type === 'New-age') badgeColor = 'bg-green-100 text-green-700 border-green-200';
            else if (exam.type === 'Private') badgeColor = 'bg-orange-100 text-orange-700 border-orange-200';

            return `
            <div class="flex items-start justify-between text-sm bg-white p-2 rounded border border-slate-200 mb-2 shadow-sm">
                <div class="flex flex-col pr-2">
                    <span class="font-bold text-slate-700 leading-tight">${exam.name}</span>
                    <span class="text-[10px] text-slate-500 mt-0.5">${exam.description || ''}</span>
                </div>
                <span class="text-[9px] px-2 py-0.5 rounded-full font-bold border ${badgeColor} whitespace-nowrap">
                    ${exam.type || 'Exam'}
                </span>
            </div>
            `;
        }).join('');

        const examsSection = examsHtml ? `
            <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-header-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                    Target Exams
                </h4>
                <div>
                    ${examsHtml}
                </div>
            </div>
        ` : '';

        // --- 3. Salary & Top Institutes ---
        const salary = branch.salary || {};
        const colleges = (branch.topColleges || []).slice(0, 5).join(', ');
        
        const salaryInstituteSection = (salary.entry || colleges) ? `
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h4 class="text-[10px] font-bold text-green-700 uppercase mb-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Avg. Salary
                    </h4>
                    <div class="text-xs text-slate-700 font-semibold">Entry: ${salary.entry || 'N/A'}</div>
                    <div class="text-xs text-slate-700 font-semibold">Mid: ${salary.midLevel || 'N/A'}</div>
                </div>
                <div class="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <h4 class="text-[10px] font-bold text-purple-700 uppercase mb-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        Top Colleges
                    </h4>
                    <div class="text-[10px] text-slate-700 leading-tight">${colleges || 'IITs, NITs'}</div>
                </div>
            </div>
        ` : '';

        // --- 4. Focus Areas ---
        const focus = branch.focusAreas || {};
        const focusSection = (focus.subjects || focus.topics) ? `
            <div class="mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <h4 class="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    Class 11-12 Focus Areas
                </h4>
                <div class="text-[11px] text-slate-700">
                    <span class="font-bold">Subjects:</span> ${focus.subjects?.join(', ') || 'N/A'}<br>
                    <span class="font-bold">Topics:</span> ${focus.topics?.slice(0,3).join('; ') || 'N/A'}
                </div>
            </div>
        ` : '';

        // --- 5. Typical Roles & Trends ---
        const roles = (branch.typicalRoles?.roles || []).slice(0, 4).join(', ');
        const trends = (branch.futureTrends || []).slice(0, 2).map(t => `<li class="truncate">• ${t}</li>`).join('');
        
        const rolesTrendsSection = (roles || trends) ? `
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h4 class="text-[10px] font-bold text-slate-500 uppercase mb-1">Typical Roles</h4>
                    <div class="text-[10px] text-slate-700 leading-tight">${roles || 'Engineer'}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 class="text-[10px] font-bold text-blue-700 uppercase mb-1">Future Trends</h4>
                    <ul class="text-[10px] text-slate-700 pl-0 list-none leading-tight">
                        ${trends}
                    </ul>
                </div>
            </div>
        ` : '';

        // Match Reason
        const reason = item.matchReason || branch.description || 'Matches your academic profile.';

        return `
        <div class="bg-white rounded-2xl shadow-soft border-2 ${index === 0 ? 'border-header-blue ring-4 ring-blue-50' : 'border-transparent'} flex flex-col overflow-hidden mb-6 break-inside-avoid">
            ${index === 0 ? `
            <div class="bg-header-blue text-white text-center py-1 text-xs font-bold uppercase tracking-widest">
                Top Match
            </div>
            ` : ''}
            
            <div class="p-6 pb-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center text-header-blue font-bold text-xl shadow-inner">
                            #${globalIndex}
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 leading-tight">${branch.name}</h2>
                            <div class="inline-flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded mt-1 border border-green-200">
                                Match Score: ${score}/100
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-3">
                    "${branch.description}"
                </div>
            </div>

            <div class="border-t border-slate-100 bg-slate-50/30 p-6 flex-1">
                ${salaryInstituteSection}
                ${focusSection}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        ${subCareersSection}
                    </div>
                    <div>
                        ${examsSection}
                    </div>
                </div>
                ${rolesTrendsSection}
                
                ${branch.workEnvironment ? `
                <div class="mt-2 text-[10px] text-slate-500 bg-slate-100 px-3 py-2 rounded border border-slate-200 flex items-start">
                    <span class="font-bold mr-1">Work Environment:</span> ${branch.workEnvironment}
                </div>` : ''}
            </div>
            
            <div class="p-4 border-t border-slate-100 mt-auto bg-green-50/50">
                <p class="text-xs text-green-800 font-medium text-center">💡 Why this fits you: ${reason}</p>
            </div>
        </div>`;
    }).join('');

    return htmlContent.replace('{{BRANCH_CARDS}}', cardsHtml);
}

function generateReportHTML(templateName, data, chunkIndex = 0, startIndex = 0, customBranches = null) {
    let htmlContent = CACHE.templates[templateName] || ''; 

    console.log("check data for report : ", data.assessment);
    

    // Logo Logic
    const mainLogoSrc = CACHE.images['allen'] || '';
    const footerLogoSrc = CACHE.images['allen_footer'] || mainLogoSrc;
    const logoClass = 'h-10';

    // Common Replacements
    htmlContent = htmlContent
        .replace(/{{PARTNER_LOGO}}/g, mainLogoSrc) // Use global replace
        .replace(/{{LOGO_CLASS}}/g, logoClass);

    if (templateName === 'page1.html') {
        const info = data.personalInfo || {};
        htmlContent = htmlContent
            .replace('Vikrant Rao', info.fullName || 'Student Name')
            .replace('Student ID: <span class="font-bold">564890</span>', `Student ID: <span class="font-bold">${data._id || 'N/A'}</span>`)
            .replace('St. Joseph English School', info.schoolName || 'School Name')
            .replace('Grade 10 – CBSE', `Grade ${info.grade || 'N/A'}`);
            
    } else if (templateName === 'page2.html') {
        const raisecRaw = data.assessment?.raisec || {};
        
        // Calculate aggregate scores
        const raisec = {
            R: (raisecRaw['r1'] || 0) + (raisecRaw['r2'] || 0),
            I: (raisecRaw['i1'] || 0) + (raisecRaw['i2'] || 0),
            A: (raisecRaw['a1'] || 0) + (raisecRaw['a2'] || 0),
            S: (raisecRaw['s1'] || 0) + (raisecRaw['s2'] || 0),
            E: (raisecRaw['e1'] || 0) + (raisecRaw['e2'] || 0),
            C: (raisecRaw['c1'] || 0) + (raisecRaw['c2'] || 0)
        };

        // Determine Dominant Trait(s) handling ties
        const scores = Object.entries(raisec);
        const maxScore = Math.max(...Object.values(raisec));
        const dominantTypes = scores
            .filter(([_, score]) => score === maxScore)
            .map(([type]) => type);
            
        const typeNames = {
            'R': 'Realistic', 'I': 'Investigative', 'A': 'Artistic',
            'S': 'Social', 'E': 'Enterprising', 'C': 'Conventional'
        };
        
        // If 4 or more traits are dominant, label as "Balanced All-Rounder"
        const dominantTraitString = dominantTypes.length >= 4 
            ? "Balanced All-Rounder" 
            : dominantTypes.map(t => typeNames[t] || t).join(' / ');

        const insight = data.results?.aiInsight || getRiasecInsight(raisec);
        const scoresArray = `[${raisec.R}, ${raisec.I}, ${raisec.A}, ${raisec.S}, ${raisec.E}, ${raisec.C}]`;
        
        htmlContent = htmlContent
            .replace('{{SUMMARY_PARAGRAPH}}', `We analyzed your responses to understand your engineering aptitude. You show a strong inclination towards the <span class="font-bold text-blue-600">${dominantTraitString || 'General'}</span> domain.`)
            .replace('{{RIASEC_INSIGHT}}', insight)
            .replace('{{DOMINANT_TRAIT}}', dominantTraitString || 'N/A')
            .replace('{{RAISEC_SCORES_ARRAY}}', scoresArray);

    } else if (templateName === 'branch_page.html') {
        const branchName = customBranches && customBranches.length > 0 ? customBranches[0].branch.name : 'Recommendation';
        
        htmlContent = htmlContent
            .replace('{{BRANCH_INDEX}}', chunkIndex + 1)
            .replace('{{BRANCH_NAME}}', branchName);
        
        htmlContent = populateBranchPage(htmlContent, customBranches, startIndex);
    }

    return htmlContent;
}

async function generatePdfPage(browser, htmlContent) {
    let page;
    try {
        console.log('📄 Generating PDF page...');
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType()) && !req.url().startsWith('data:')) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });
        console.log('✅ PDF page generated');
        return pdfBuffer;
    } catch (e) {
        console.error('❌ Page generation error:', e);
        throw e;
    } finally {
        if (page) await page.close();
    }
}

// Routes
app.get('/', (req, res) => res.send('Scaler Future Fit API is running'));

app.post('/api/save-student', async (req, res) => {
  try {
    const { userInfo, responses, results, id } = req.body;
    
    // Defensive parsing for nested JSON strings if they exist
    if (results && results.topBranches) {
        results.topBranches.forEach(item => {
            if (item.branch) {
                // Normalize exams
                if (typeof item.branch.exams === 'string') {
                    try {
                        item.branch.exams = JSON.parse(item.branch.exams);
                    } catch (e) {
                        console.error('Failed to parse exams JSON', e);
                        item.branch.exams = [];
                    }
                } else if (Array.isArray(item.branch.exams) && item.branch.exams.length === 1 && typeof item.branch.exams[0] === 'string') {
                     try {
                        item.branch.exams = JSON.parse(item.branch.exams[0]);
                     } catch (e) {
                        console.error('Failed to parse exams inner JSON', e);
                     }
                }

                // Normalize subCareers
                if (typeof item.branch.subCareers === 'string') {
                    try {
                        item.branch.subCareers = JSON.parse(item.branch.subCareers);
                    } catch (e) {
                        console.error('Failed to parse subCareers JSON', e);
                        item.branch.subCareers = [];
                    }
                } else if (Array.isArray(item.branch.subCareers) && item.branch.subCareers.length === 1 && typeof item.branch.subCareers[0] === 'string') {
                     try {
                        item.branch.subCareers = JSON.parse(item.branch.subCareers[0]);
                     } catch (e) {
                        console.error('Failed to parse subCareers inner JSON', e);
                     }
                }
            }
        });
    }
    
    if (id) {
        // Update existing
        const updatedProfile = await StudentProfile.findByIdAndUpdate(
            id,
            {
                personalInfo: userInfo,
                assessment: { raisec: responses.raisec, academic: responses.academic },
                results: {
                    topBranches: results.topBranches,
                    raisecProfile: results.raisecProfile,
                    dominantType: results.dominantType,
                    aiInsight: results.aiInsight || ''
                }
            },
            { new: true }
        );
        if (updatedProfile) {
            console.log(`📝 Updated profile for: ${userInfo.fullName} (${id})`);
            return res.status(200).json({ success: true, id: updatedProfile._id });
        }
    }

    // Create new
    const newProfile = new StudentProfile({
      personalInfo: userInfo,
      assessment: { raisec: responses.raisec, academic: responses.academic },
      results: {
        topBranches: results.topBranches,
        raisecProfile: results.raisecProfile,
        dominantType: results.dominantType,
        aiInsight: results.aiInsight || ''
      },
      submittedAt: new Date()
    });
    const savedProfile = await newProfile.save();
    console.log(`📝 Saved profile for: ${userInfo.fullName}`);
    res.status(201).json({ success: true, id: savedProfile._id });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving data' });
  }
});

// PDF Generation Endpoint
app.post('/api/generate-report', async (req, res) => {
    const { studentID, data } = req.body; // Can accept ID to fetch or raw data
    
    let reportData = data;
    if (!reportData && studentID) {
        try {
            reportData = await StudentProfile.findById(studentID).lean();
        } catch (e) {
            return res.status(404).send({ error: 'Student not found' });
        }
    }

    if (!reportData) return res.status(400).send({ error: 'No data provided' });

    console.log(`[PDF] Generating for ${reportData.personalInfo?.fullName || 'Student'}...`);

    try {
        const browser = await getBrowser();
        const pagesToGenerate = [
            { template: 'page1.html' },
            { template: 'page2.html' }
        ];

        // Process Branches
        const branches = reportData.results?.topBranches || [];
        const branchesPerPage = 1;
        for (let i = 0; i < branches.length; i += branchesPerPage) {
            const chunk = branches.slice(i, i + branchesPerPage);
            pagesToGenerate.push({
                template: 'branch_page.html',
                customBranches: chunk,
                chunkIndex: i / branchesPerPage,
                startIndex: i
            });
        }
        
        pagesToGenerate.push({ template: 'page6.html' });

        // Generate Pages
        const pdfBuffers = await Promise.all(
            pagesToGenerate.map(p => {
                const html = generateReportHTML(p.template, reportData, p.chunkIndex, p.startIndex, p.customBranches);
                return generatePdfPage(browser, html);
            })
        );

        // Merge
        const mergedPdf = await PDFDocument.create();
        for (const buf of pdfBuffers) {
            const pdf = await PDFDocument.load(buf);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(p => mergedPdf.addPage(p));
        }
        const mergedPdfBytes = await mergedPdf.save();
        const buffer = Buffer.from(mergedPdfBytes);

        // Force offline download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
        res.send(buffer);


    } catch (error) {
        console.error('PDF Gen Error:', error);
        res.status(500).send({ error: 'Generation Failed', details: error.message });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Find latest profile for this phone number
    const student = await StudentProfile.findOne({ 'personalInfo.phone': phone })
      .sort({ submittedAt: -1 });

    if (!student) {
      return res.status(404).json({ error: 'No record found for this mobile number.' });
    }

    res.json({
      success: true,
      student: {
        id: student._id,
        userInfo: student.personalInfo,
        responses: {
            raisec: student.assessment.raisec,
            academic: student.assessment.academic
        },
        results: {
            topBranches: student.results.topBranches,
            raisecProfile: student.results.raisecProfile,
            dominantType: student.results.dominantType,
            aiInsight: student.results.aiInsight
        }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Start
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/future-fit')
  .then(() => {
      console.log('✅ MongoDB Connected');
      preloadAssets().then(() => {
          app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
      });
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

module.exports = app;