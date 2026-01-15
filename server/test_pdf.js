const axios = require('axios');
const fs = require('fs');

const testData = {
    "studentID": "test_student_001",
    "data": {
        "_id": "test_student_001",
        "personalInfo": {
            "fullName": "Rahul Verma",
            "schoolName": "Delhi Public School",
            "grade": "10",
            "board": "CBSE"
        },
        "assessment": {
            "raisec": { "R": 22, "I": 25, "A": 18, "S": 20, "E": 15, "C": 10 },
            "academic": {}
        },
        "results": {
            "dominantType": "Investigative",
            "aiInsight": "Rahul shows a strong aptitude for analytical problem solving.",
            "topBranches": [
                {
                    "branch": {
                        "name": "Computer Science Engineering",
                        "description": "Focuses on computational systems and software.",
                        "weights": { "math": 0.9, "physics": 0.7, "cs": 1.0 },
                        "exams": [{ "name": "JEE Advanced" }, { "name": "BITSAT" }]
                    },
                    "score": 95,
                    "matchReason": "High logical reasoning and interest in coding."
                },
                {
                    "branch": {
                        "name": "Data Science & AI",
                        "description": "Study of data analysis and machine learning models.",
                        "weights": { "math": 1.0, "logic": 0.9 },
                        "exams": [{ "name": "JEE Main" }]
                    },
                    "score": 92,
                    "matchReason": "Strong mathematical foundation."
                },
                {
                    "branch": {
                        "name": "Electronics & Communication",
                        "description": "Design of electronic circuits and communication systems.",
                        "weights": { "physics": 0.9, "math": 0.8 },
                        "exams": [{ "name": "VITEEE" }]
                    },
                    "score": 88,
                    "matchReason": "Good understanding of physical systems."
                },
                 {
                    "branch": {
                        "name": "Mechanical Engineering",
                        "description": "Design and manufacturing of mechanical systems.",
                        "weights": { "physics": 1.0, "math": 0.8 },
                        "exams": [{ "name": "JEE Main" }]
                    },
                    "score": 85,
                    "matchReason": "Strong physics concepts."
                }
            ]
        }
    }
};

async function testReportGeneration() {
    try {
        console.log('Sending request...');
        const response = await axios.post('http://localhost:5001/api/generate-report', testData, {
            responseType: 'arraybuffer' // Expecting PDF buffer or JSON
        });

        // Check content type
        const contentType = response.headers['content-type'];
        console.log('Response status:', response.status);
        console.log('Content-Type:', contentType);
        
        if (contentType.includes('application/pdf')) {
            fs.writeFileSync('test_report.pdf', response.data);
            console.log('✅ PDF received and saved as test_report.pdf');
        } else {
            // It might be JSON with a link
            const text = Buffer.from(response.data).toString();
            console.log('Response:', text);
        }

    } catch (error) {
        console.error('❌ Error Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            const dataStr = Buffer.from(error.response.data).toString();
             console.error('Data:', dataStr);
        } else if (error.request) {
             console.error('No response received:', error.request);
        } else {
             console.error('Error setup:', error.stack);
        }
    }
}

testReportGeneration();