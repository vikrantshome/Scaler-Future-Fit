import { Branch, Question } from './types';

// --- PART 1: RAISEC Personality Questions ---
export const RAISEC_QUESTIONS: Question[] = [
  // Realistic (R)
  { id: 'r1', text: 'I enjoy taking apart gadgets (like phones, toys, cycles) to see how they work.', category: 'RAISEC', raisecType: 'R', type: 'likert' },
  { id: 'r2', text: 'I prefer working with tools, machines, or hardware over sitting and writing theory.', category: 'RAISEC', raisecType: 'R', type: 'likert' },
  // Investigative (I)
  { id: 'i1', text: 'I love solving complex math puzzles or logic riddles just for fun.', category: 'RAISEC', raisecType: 'I', type: 'likert' },
  { id: 'i2', text: 'When I see a problem, I immediately want to analyze the data and find the root cause.', category: 'RAISEC', raisecType: 'I', type: 'likert' },
  // Artistic (A)
  { id: 'a1', text: 'I enjoy designing things, whether it is drawing, digital art, or making sleek presentations.', category: 'RAISEC', raisecType: 'A', type: 'likert' },
  { id: 'a2', text: 'I care about how a product looks and feels (UI/UX) as much as how it functions.', category: 'RAISEC', raisecType: 'A', type: 'likert' },
  // Social (S)
  { id: 's1', text: 'I am good at explaining difficult concepts to my friends or classmates.', category: 'RAISEC', raisecType: 'S', type: 'likert' },
  { id: 's2', text: 'I prefer working in a team where we discuss ideas rather than working alone in a silo.', category: 'RAISEC', raisecType: 'S', type: 'likert' },
  // Enterprising (E)
  { id: 'e1', text: 'I dream of starting my own tech company or business one day.', category: 'RAISEC', raisecType: 'E', type: 'likert' },
  { id: 'e2', text: 'I enjoy persuading people and leading projects in school clubs.', category: 'RAISEC', raisecType: 'E', type: 'likert' },
  // Conventional (C)
  { id: 'c1', text: 'I like things to be organized, structured, and follow a clear plan.', category: 'RAISEC', raisecType: 'C', type: 'likert' },
  { id: 'c2', text: 'I am good at handling data, spreadsheets, or detailed code syntax without getting bored.', category: 'RAISEC', raisecType: 'C', type: 'likert' },
];

// --- PART 2: Academic & Career Fit ---
export const ACADEMIC_QUESTIONS: Question[] = [
  {
    id: 'fav_subject',
    text: 'Which subject do you genuinely enjoy studying the most?',
    category: 'ACADEMIC',
    type: 'single-choice',
    options: [
      { label: 'Mathematics', value: 'Math' },
      { label: 'Physics', value: 'Physics' },
      { label: 'Computer Science / Coding', value: 'CS' },
      { label: 'Chemistry', value: 'Chemistry' },
      { label: 'Biology', value: 'Biology' },
    ]
  },
  {
    id: 'strong_subject',
    text: 'In which subject do you consistently score the highest marks?',
    category: 'ACADEMIC',
    type: 'single-choice',
    options: [
      { label: 'Mathematics', value: 'Math' },
      { label: 'Physics', value: 'Physics' },
      { label: 'Computer Science / Coding', value: 'CS' },
      { label: 'Chemistry', value: 'Chemistry' },
      { label: 'Biology', value: 'Biology' },
    ]
  },
  {
    id: 'exam_prep',
    text: 'Are you preparing for any competitive exams?',
    category: 'ACADEMIC',
    type: 'single-choice',
    options: [
      { label: 'JEE (Mains/Advanced) - Focused on IIT/NITs', value: 'JEE' },
      { label: 'BITSAT / Private Engg Exams', value: 'BITSAT' },
      { label: 'State CETs', value: 'CET' },
      { label: 'Olympiads (Math/Science)', value: 'Olympiad' },
      { label: 'Not preparing specifically yet', value: 'None' },
    ]
  },
  {
    id: 'learning_style',
    text: 'How do you prefer to learn new things?',
    category: 'ACADEMIC',
    type: 'single-choice',
    options: [
      { label: 'By building things or coding (Practical)', value: 'Practical' },
      { label: 'By understanding the theory and derivation (Theoretical)', value: 'Theoretical' },
      { label: 'By memorizing facts and patterns (Rote)', value: 'Rote' },
    ]
  },
  {
    id: 'eng_goal',
    text: 'What is your primary career aspiration?',
    category: 'ACADEMIC',
    type: 'single-choice',
    options: [
      { label: 'Software Engineer / Developer at top tech firms', value: 'Software' },
      { label: 'Research & Scientist (ISRO, DRDO, Academia)', value: 'Research' },
      { label: 'Entrepreneur / Startup Founder', value: 'Startup' },
      { label: 'Core Engineering (Cars, Bridges, Power Plants)', value: 'Core' },
    ]
  }
];

// --- Branches & Mapping Logic ---
// Weights: 0 to 1. Higher means that trait is more important for the branch.
export const ENGINEERING_BRANCHES: Branch[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    description: 'The backbone of the digital world. Includes Full Stack Development, App Dev, and System Design. Ideal for logical builders.',
    weights: { I: 0.9, C: 0.7, E: 0.6, math: 0.8, cs: 1.0, logic: 0.9 },
    subCareers: [
      { name: 'Software Developer', description: 'Coding & debugging software.', recruiters: ['Google', 'Microsoft', 'TCS'] },
      { name: 'Data Scientist', description: 'Analyze data for insights.', recruiters: ['Deloitte', 'Amazon', 'Fractal'] },
      { name: 'Cloud & DevOps', description: 'Manage cloud infra & pipelines.', recruiters: ['AWS', 'IBM', 'Accenture'] },
      { name: 'Cybersecurity', description: 'Protect systems from threats.', recruiters: ['EY', 'Wipro', 'Palo Alto'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'Gateway to IITs/NITs' },
      { name: 'BITSAT', type: 'Private', description: 'BITS Pilani/Goa/Hyd' },
      { name: 'Scaler NSET', type: 'New-age', description: 'Placement-focused CSE' },
      { name: 'MHT-CET / KCET', type: 'State', description: 'Top state colleges' },
      { name: 'VITEEE / SRMJEEE', type: 'Private', description: 'Large CSE intake' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Research-oriented' }
    ]
  },
  {
    id: 'ai_ds',
    name: 'AI & Data Science',
    description: 'The future of intelligence. Requires strong math, pattern recognition, and problem-solving skills.',
    weights: { I: 1.0, C: 0.8, math: 1.0, cs: 0.9, logic: 1.0 },
    subCareers: [
      { name: 'ML Engineer', description: 'Build predictive AI models.', recruiters: ['OpenAI', 'Google DeepMind', 'Uber'] },
      { name: 'Data Analyst', description: 'Visualize and interpret data.', recruiters: ['Mu Sigma', 'ZS Associates'] },
      { name: 'AI Researcher', description: 'Invent new AI algorithms.', recruiters: ['Microsoft Research', 'IBM Research'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'IITs have specialized AI tracks' },
      { name: 'Scaler NSET', type: 'New-age', description: 'Specialized AI curriculum' },
      { name: 'BITSAT', type: 'Private', description: 'Math/Computing programs' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Research in AI/ML' }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    description: 'Focuses on the application of computers and telecommunications to store, retrieve, and transmit data.',
    weights: { C: 0.8, S: 0.6, I: 0.6, cs: 0.9, math: 0.6 },
    subCareers: [
      { name: 'Full Stack Developer', description: 'Web & App development.', recruiters: ['Tech Startups', 'Infosys'] },
      { name: 'Network Admin', description: 'Manage IT networks & security.', recruiters: ['Cisco', 'Wipro'] },
      { name: 'Business Analyst', description: 'Bridge business & tech needs.', recruiters: ['McKinsey', 'Accenture'] },
      { name: 'QA Engineer', description: 'Test software for bugs.', recruiters: ['Capgemini', 'Cognizant'] }
    ],
    exams: [
      { name: 'JEE Main', type: 'National', description: 'IT branches in NITs' },
      { name: 'MHT-CET / KCET', type: 'State', description: 'Regional IT hubs' },
      { name: 'Scaler NSET', type: 'New-age', description: 'Outcome-first IT careers' },
      { name: 'VITEEE / SRMJEEE', type: 'Private', description: 'IT placements' }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    description: 'The bridge between hardware and software. Great for those who like physics and circuits.',
    weights: { R: 0.8, I: 0.8, physics: 0.9, math: 0.7 },
    subCareers: [
      { name: 'Embedded Systems', description: 'Code for microcontrollers.', recruiters: ['Bosch', 'Continental', 'Qualcomm'] },
      { name: 'VLSI Engineer', description: 'Design chips & circuits.', recruiters: ['Intel', 'NVIDIA', 'AMD'] },
      { name: 'Telecom Engineer', description: 'Manage wireless networks.', recruiters: ['Jio', 'Airtel', 'Ericsson'] },
      { name: 'IoT Specialist', description: 'Connect devices to internet.', recruiters: ['Samsung', 'Honeywell'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'Top ECE programs' },
      { name: 'BITSAT', type: 'Private', description: 'Strong Electronics dept' },
      { name: 'MHT-CET / KCET', type: 'State', description: 'Regional electronics' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Signal processing/Research' },
      { name: 'VITEEE', type: 'Private', description: 'Good ECE placement' }
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    description: 'For those who want to design machines, engines, and physical systems. Hands-on and physics-heavy.',
    weights: { R: 1.0, I: 0.6, physics: 1.0, math: 0.6 },
    subCareers: [
      { name: 'Design Engineer', description: 'CAD/CAE product design.', recruiters: ['Tata Motors', 'Mahindra'] },
      { name: 'Production Engineer', description: 'Manage manufacturing lines.', recruiters: ['Maruti Suzuki', 'L&T'] },
      { name: 'Automotive Engineer', description: 'Design vehicle systems.', recruiters: ['Mercedes-Benz', 'Toyota'] },
      { name: 'Robotics Engineer', description: 'Build automated machines.', recruiters: ['GreyOrange', 'Fanuc'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'IIT Mechanical is top-tier' },
      { name: 'MHT-CET', type: 'State', description: 'Pune manufacturing hub' },
      { name: 'BITSAT', type: 'Private', description: 'Strong core placements' },
      { name: 'COMEDK UGET', type: 'State', description: 'Karnataka mech colleges' }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    description: 'Powering the world. Deals with electricity, electromagnetism, and power grids.',
    weights: { R: 0.9, I: 0.7, physics: 0.9, math: 0.8 },
    subCareers: [
      { name: 'Power Systems Eng', description: 'Grid & substation design.', recruiters: ['PowerGrid', 'NTPC', 'Tata Power'] },
      { name: 'Control Engineer', description: 'Automation & PLC systems.', recruiters: ['Siemens', 'ABB', 'Schneider'] },
      { name: 'Renewable Energy', description: 'Solar & Wind projects.', recruiters: ['Adani Green', 'ReNew Power'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'Core Electrical' },
      { name: 'MHT-CET / KCET', type: 'State', description: 'Regional power boards' },
      { name: 'BITSAT', type: 'Private', description: 'Electrical & Instrumentation' },
      { name: 'Scaler NSET', type: 'New-age', description: 'For software transitions' }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    description: 'Building the infrastructure of civilization. Roads, bridges, and skyscrapers.',
    weights: { R: 0.9, C: 0.6, physics: 0.8, math: 0.6 },
    subCareers: [
      { name: 'Structural Engineer', description: 'Design safe buildings.', recruiters: ['L&T Construction', 'DLF'] },
      { name: 'Project Manager', description: 'Oversee site execution.', recruiters: ['Shapoorji Pallonji', 'GMR'] },
      { name: 'Transport Engineer', description: 'Plan roads & traffic.', recruiters: ['NHAI', 'RITES'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'Top infra projects' },
      { name: 'MHT-CET', type: 'State', description: 'Civil strong in Pune/Nashik' },
      { name: 'BITSAT', type: 'Private', description: 'Civil seats at BITS' },
      { name: 'COMEDK UGET', type: 'State', description: 'Private civil pool' }
    ]
  },
  {
    id: 'chem',
    name: 'Chemical Engineering',
    description: 'Transforming raw materials into useful products. Requires love for chemistry and process logic.',
    weights: { I: 0.8, C: 0.7, chemistry: 1.0, physics: 0.6 },
    subCareers: [
      { name: 'Process Engineer', description: 'Design plant processes.', recruiters: ['Reliance', 'Indian Oil'] },
      { name: 'R&D Scientist', description: 'Develop new materials.', recruiters: ['Asian Paints', 'Dr. Reddy\'s'] },
      { name: 'Safety Engineer', description: 'Ensure plant safety.', recruiters: ['DuPont', 'Shell'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'Premier Chemical Engg' },
      { name: 'MHT-CET / WBJEE', type: 'State', description: 'Regional chemical hubs' },
      { name: 'BITSAT', type: 'Private', description: 'Process engineering' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Comp Chemistry/Data' }
    ]
  },
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    description: 'Design and maintenance of aircraft and spacecraft. For physics enthusiasts dreaming of the sky.',
    weights: { I: 0.9, R: 0.8, physics: 1.0, math: 0.9 },
    subCareers: [
      { name: 'Avionics Engineer', description: 'Aircraft electronics.', recruiters: ['HAL', 'Boeing', 'Airbus'] },
      { name: 'Aerodynamics Eng', description: 'Airflow & propulsion.', recruiters: ['ISRO', 'DRDO', 'GE Aviation'] },
      { name: 'Maintenance Eng', description: 'Aircraft servicing.', recruiters: ['IndiGo', 'Air India'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'IIST / IITs' },
      { name: 'BITSAT', type: 'Private', description: 'Aerospace seats' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Avionics/Control' },
      { name: 'Scaler NSET', type: 'New-age', description: 'Avionics software' }
    ]
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    description: 'Using biology to solve problems. Intersects genetics, medicine, and engineering.',
    weights: { I: 1.0, A: 0.5, chemistry: 0.8, physics: 0.4 }, 
    subCareers: [
      { name: 'Bioprocess Eng', description: 'Manage bio-manufacturing.', recruiters: ['Biocon', 'Serum Institute'] },
      { name: 'Clinical Researcher', description: 'Drug trials & data.', recruiters: ['Pfizer', 'Novartis'] },
      { name: 'Bioinformatics', description: 'Biological data analysis.', recruiters: ['Strand Life Sciences'] }
    ],
    exams: [
      { name: 'JEE Main', type: 'National', description: 'Biotech streams' },
      { name: 'BITSAT', type: 'Private', description: 'MSc Bio / BE Biotech' },
      { name: 'IIIT-H UGEE', type: 'New-age', description: 'Computational Bio' },
      { name: 'WBJEE / MHT-CET', type: 'State', description: 'State biotech' }
    ]
  },
  {
    id: 'production',
    name: 'Industrial & Production Engineering',
    description: 'Optimizing complex processes and systems. Efficiency, supply chain, and quality control.',
    weights: { C: 0.9, E: 0.7, math: 0.7, logic: 0.8 },
    subCareers: [
      { name: 'Operations Manager', description: 'Oversee factory output.', recruiters: ['ITC', 'HUL', 'Nestle'] },
      { name: 'Supply Chain Analyst', description: 'Logistics & distribution.', recruiters: ['Flipkart', 'Amazon'] },
      { name: 'Quality Engineer', description: 'Six Sigma & reliability.', recruiters: ['Toyota', 'General Electric'] }
    ],
    exams: [
      { name: 'JEE Main/Advanced', type: 'National', description: 'IIT/NIT Production' },
      { name: 'MHT-CET', type: 'State', description: 'Manufacturing hubs' },
      { name: 'BITSAT', type: 'Private', description: 'Manufacturing Engg' },
      { name: 'COMEDK', type: 'State', description: 'Private colleges' }
    ]
  },
   {
    id: 'algo_trading',
    name: 'Algorithmic Trading & FinTech',
    description: 'Where finance meets high-speed coding. For math wizards who want to build automated trading systems.',
    weights: { I: 0.9, E: 0.9, C: 0.8, math: 1.0, logic: 1.0, cs: 0.7 },
    subCareers: [
       { name: 'Quant Researcher', description: 'Math models for markets.', recruiters: ['Tower Research', 'Jane Street'] },
       { name: 'HFT Developer', description: 'Low-latency trading code.', recruiters: ['Optiver', 'Graviton'] },
       { name: 'FinTech Engineer', description: 'Payment & banking apps.', recruiters: ['Razorpay', 'PhonePe', 'Zerodha'] }
    ],
    exams: [
      { name: 'JEE Advanced', type: 'National', description: 'IIT Math & Computing' },
      { name: 'Scaler NSET', type: 'New-age', description: 'Direct FinTech/Algo pathway' },
      { name: 'BITSAT', type: 'Private', description: 'MSc Math + CS' },
      { name: 'ISI Admission', type: 'National', description: 'Statistical Institutes' }
    ]
  }
];