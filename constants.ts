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
    description: 'The backbone of the digital world. Ideal for logical thinkers who love coding and building software.',
    weights: { I: 0.9, C: 0.7, E: 0.5, math: 0.8, cs: 1.0, logic: 0.9 }
  },
  {
    id: 'ai_ds',
    name: 'AI & Data Science',
    description: 'The future of intelligence. Requires strong math, pattern recognition, and problem-solving skills.',
    weights: { I: 1.0, C: 0.8, math: 1.0, cs: 0.9, logic: 1.0 }
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    description: 'The bridge between hardware and software. Great for those who like physics and circuits.',
    weights: { R: 0.8, I: 0.8, physics: 0.9, math: 0.7 }
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    description: 'For those who want to design machines, engines, and physical systems. Hands-on and physics-heavy.',
    weights: { R: 1.0, I: 0.6, physics: 1.0, math: 0.6 }
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    description: 'Powering the world. Deals with electricity, electromagnetism, and power grids.',
    weights: { R: 0.9, I: 0.7, physics: 0.9, math: 0.8 }
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    description: 'Building the infrastructure of civilization. Roads, bridges, and skyscrapers.',
    weights: { R: 0.9, C: 0.6, physics: 0.8, math: 0.6 }
  },
  {
    id: 'robotics',
    name: 'Robotics & Mechatronics',
    description: 'The perfect blend of Mechanical, Electrical, and CS. For creators of autonomous systems.',
    weights: { R: 1.0, I: 0.9, physics: 0.8, cs: 0.8, math: 0.7 }
  },
  {
    id: 'chem',
    name: 'Chemical Engineering',
    description: 'Transforming raw materials into useful products. Requires love for chemistry and process logic.',
    weights: { I: 0.8, C: 0.7, chemistry: 1.0, physics: 0.6 }
  }
];