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
    ],
    salary: {
      entry: '4-8 LPA',
      midLevel: '15-30+ LPA'
    },
    topColleges: [
      'Scaler School of Technology', 'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 
      'IIT Kharagpur', 'BITS Pilani', 'NIT Warangal', 'NIT Trichy'
    ],
    focusAreas: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      topics: [
        'Mathematics: Algebra, Calculus, Coordinate Geometry',
        'Physics: Mechanics, Electrodynamics',
        'Chemistry: Physical, Organic, Inorganic'
      ]
    },
    typicalRoles: {
      roles: ['Software Engineer', 'Web Developer', 'Data Analyst', 'DevOps Engineer'],
      companies: ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Flipkart']
    },
    futureTrends: [
      'Rise of AI/ML specialists & Data Scientists',
      'Growth in Cloud & Edge Computing',
      'Focus on Cybersecurity & Ethical AI'
    ],
    workEnvironment: 'Primarily office-based or remote; involves coding, design, and team collaboration.'
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
    ],
    salary: {
      entry: '5-10 LPA',
      midLevel: '18-40+ LPA'
    },
    topColleges: [
      'IIT Delhi', 'IIT Bombay', 'IISc Bangalore', 
      'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad'
    ],
    focusAreas: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      topics: [
        'Math: Probability, Statistics, Calculus, Linear Algebra',
        'Physics: Analytical skills',
        'Logical Reasoning & Data Interpretation'
      ]
    },
    typicalRoles: {
      roles: ['Data Scientist', 'ML Engineer', 'AI Engineer', 'Big Data Engineer'],
      companies: ['Google', 'Microsoft', 'Amazon', 'IBM', 'Fractal Analytics', 'Mu Sigma']
    },
    futureTrends: [
      'Pervasive AI integration across industries',
      'Generative AI & Responsible AI advancements',
      'Real-time data processing & ethics'
    ],
    workEnvironment: 'Office-based/Remote; involves data analysis, model building, and research.'
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
    ],
    salary: {
      entry: '3.5-7 LPA',
      midLevel: '12-25+ LPA'
    },
    topColleges: [
      'NITs (Trichy, Warangal, Surathkal)', 'IIITs (Allahabad, Bangalore)', 
      'BITS Pilani', 'VIT Vellore', 'DTU'
    ],
    focusAreas: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      topics: [
        'Math: Problem-solving, Logic',
        'Physics: Basic principles',
        'General scientific aptitude'
      ]
    },
    typicalRoles: {
      roles: ['System Admin', 'Network Engineer', 'IT Consultant', 'Database Admin'],
      companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture', 'Cisco']
    },
    futureTrends: [
      'Cloud services expansion',
      'Demand for DevOps & Cybersecurity',
      'AI in IT Operations (AIOps)'
    ],
    workEnvironment: 'Office/Remote; managing infrastructure, support, and implementing solutions.'
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
    ],
    salary: {
      entry: '4-7 LPA',
      midLevel: '12-25+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 
      'NIT Trichy', 'IISc Bangalore'
    ],
    focusAreas: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      topics: [
        'Physics: Electrodynamics, Semiconductors, Modern Physics',
        'Math: Calculus, Differential Equations, Complex Numbers'
      ]
    },
    typicalRoles: {
      roles: ['VLSI Engineer', 'Embedded Systems Eng', 'Telecom Engineer', 'IoT Specialist'],
      companies: ['Intel', 'Qualcomm', 'Samsung', 'NVIDIA', 'Cisco', 'Jio']
    },
    futureTrends: [
      '5G/6G & IoT expansion',
      'Semiconductor boom & AI Hardware',
      'Autonomous systems & Robotics'
    ],
    workEnvironment: 'Mix of Office (Design) and Lab (Testing, Prototyping).'
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
    ],
    salary: {
      entry: '3.5-6 LPA',
      midLevel: '10-20+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Madras', 'IIT Delhi', 'BITS Pilani', 
      'NIT Warangal', 'VIT Vellore'
    ],
    focusAreas: {
      subjects: ['Physics', 'Mathematics', 'Chemistry'],
      topics: [
        'Physics: Mechanics, Thermodynamics, Fluids',
        'Math: Calculus, Vectors, 3D Geometry'
      ]
    },
    typicalRoles: {
      roles: ['Design Engineer', 'Automotive Engineer', 'Production Engineer', 'Robotics Eng'],
      companies: ['Tata Motors', 'Mahindra', 'L&T', 'Maruti Suzuki', 'Siemens', 'ISRO']
    },
    futureTrends: [
      'Industry 4.0 & AI in Manufacturing',
      'EVs & Sustainable Energy Systems',
      'Robotics & Automation'
    ],
    workEnvironment: 'Mix of Office (CAD Design), Factory (Production), and Lab (Testing).'
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
    ],
    salary: {
      entry: '4-7 LPA',
      midLevel: '12-25+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Delhi', 'IIT Kanpur', 'IIT Madras', 
      'BITS Pilani', 'NIT Trichy'
    ],
    focusAreas: {
      subjects: ['Physics', 'Mathematics', 'Chemistry'],
      topics: [
        'Physics: Electrodynamics, Magnetism, AC Circuits',
        'Math: Calculus, Differential Equations'
      ]
    },
    typicalRoles: {
      roles: ['Power Systems Eng', 'Control Engineer', 'Renewable Energy Eng'],
      companies: ['Siemens', 'ABB', 'PowerGrid', 'NTPC', 'Tata Power', 'Reliance']
    },
    futureTrends: [
      'Smart Grids & Energy Storage',
      'Electric Vehicles (EVs)',
      'Green Energy Integration'
    ],
    workEnvironment: 'Office (Design), Power Plants/Substations (Ops), Field (Installation).'
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
    ],
    salary: {
      entry: '3-6 LPA',
      midLevel: '10-20+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Roorkee', 'IIT Madras', 'NIT Warangal', 
      'BITS Pilani', 'COEP Pune'
    ],
    focusAreas: {
      subjects: ['Physics', 'Mathematics', 'Chemistry'],
      topics: [
        'Physics: Mechanics, Properties of Matter',
        'Math: Calculus, Vectors, Geometry',
        'Chemistry: Material Science'
      ]
    },
    typicalRoles: {
      roles: ['Structural Engineer', 'Project Manager', 'Urban Planner', 'Transport Eng'],
      companies: ['L&T', 'Tata Projects', 'DLF', 'NHAI', 'Godrej Properties']
    },
    futureTrends: [
      'Smart Cities & Green Buildings',
      'Sustainable Infrastructure',
      'AI in Construction Management'
    ],
    workEnvironment: 'Office (Planning/Design), Construction Sites (Execution), Field Surveys.'
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
    ],
    salary: {
      entry: '4-7 LPA',
      midLevel: '12-25+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Delhi', 'ICT Mumbai', 'IIT Kanpur', 
      'BITS Pilani', 'NIT Warangal'
    ],
    focusAreas: {
      subjects: ['Chemistry', 'Physics', 'Mathematics'],
      topics: [
        'Chemistry: Physical, Organic, Inorganic',
        'Physics: Thermodynamics, Fluids'
      ]
    },
    typicalRoles: {
      roles: ['Process Engineer', 'R&D Scientist', 'Production Engineer'],
      companies: ['Reliance Industries', 'IOCL', 'ONGC', 'HUL', 'Asian Paints']
    },
    futureTrends: [
      'Green Chemistry & Sustainability',
      'Bio-fuels & Renewable Materials',
      'Process Automation'
    ],
    workEnvironment: 'Lab (R&D), Plant/Refinery (Operations), Office (Design).'
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
    ],
    salary: {
      entry: '5-9 LPA',
      midLevel: '15-35+ LPA'
    },
    topColleges: [
      'IIT Bombay', 'IIT Kanpur', 'IIT Madras', 'IIST Thiruvananthapuram', 
      'IISc Bangalore'
    ],
    focusAreas: {
      subjects: ['Physics', 'Mathematics'],
      topics: [
        'Physics: Mechanics, Fluids, Thermodynamics',
        'Math: Calculus, Vectors, Geometry'
      ]
    },
    typicalRoles: {
      roles: ['Aerodynamicist', 'Avionics Engineer', 'Propulsion Engineer'],
      companies: ['ISRO', 'DRDO', 'HAL', 'Boeing', 'Airbus', 'Tata Advanced Systems']
    },
    futureTrends: [
      'Commercial Space Travel',
      'Sustainable Aviation Fuel',
      'Drone Technology & UAVs'
    ],
    workEnvironment: 'Office (Design), Lab (Testing), Hangar/Field (Assembly/Ops).'
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
    ],
    salary: {
      entry: '3-6 LPA',
      midLevel: '10-20+ LPA'
    },
    topColleges: [
      'IIT Delhi', 'IIT Madras', 'IIT Bombay', 'BITS Pilani', 
      'VIT Vellore', 'ICT Mumbai'
    ],
    focusAreas: {
      subjects: ['Biology', 'Chemistry', 'Math/Physics'],
      topics: [
        'Biology: Genetics, Molecular Bio',
        'Chemistry: Organic, Biochemistry',
        'Math: Statistics'
      ]
    },
    typicalRoles: {
      roles: ['Research Scientist', 'Bioprocess Engineer', 'Bioinformatics Analyst'],
      companies: ['Biocon', 'Serum Institute', 'Dr. Reddy\'s', 'Syngene', 'Novozymes']
    },
    futureTrends: [
      'Personalized Medicine (Genomics)',
      'Synthetic Biology',
      'Bio-fuels & Sustainable Ag'
    ],
    workEnvironment: 'Lab (Research), Production Plant, Office (Data Analysis).'
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
    ],
    salary: {
      entry: '3.5-6.5 LPA',
      midLevel: '10-22+ LPA'
    },
    topColleges: [
      'IIT Delhi', 'IIT Kharagpur', 'NIT Trichy', 
      'BITS Pilani', 'VIT Vellore'
    ],
    focusAreas: {
      subjects: ['Mathematics', 'Physics'],
      topics: [
        'Math: Statistics, Optimization, Calculus',
        'Physics: Mechanics, Thermodynamics'
      ]
    },
    typicalRoles: {
      roles: ['Operations Manager', 'Supply Chain Analyst', 'Quality Engineer'],
      companies: ['ITC', 'HUL', 'Tata Motors', 'Amazon', 'Flipkart', 'L&T']
    },
    futureTrends: [
      'Industry 4.0 & Smart Factories',
      'Supply Chain Resilience',
      'Data-Driven Operations'
    ],
    workEnvironment: 'Factory (Floor mgmt), Warehouse, Office (Planning).'
  }
];
