import { UserResponses, UserInfo } from '../types';

export interface OMRCsvRow {
    student_id: string;
    full_name: string;
    email: string;
    school_name: string;
    city: string;
    date: string; // DD-MM-YYYY
    mobile_number: string;
    grade: string;
    missing_pages: string;
    status: string;
    'date of birth': string;

    // RAISEC 1-5
    q1: string; q2: string; q3: string; q4: string; q5: string; q6: string;
    q7: string; q8: string; q9: string; q10: string; q11: string; q12: string;

    // Academic A-E
    q13: string; // Fav Subject
    q14: string; // Strong Subject
    q15: string; // Learning Style
    q16: string; // Exam Prep
    q17: string; // Career Goal
    consent: string; // TRUE/FALSE
}

// Helper: Parse Number with Default 3
const parseScore = (val: string | undefined): number => {
    if (!val || val.trim() === '' || val.trim() === '-') return 3;
    const n = parseInt(val, 10);
    return isNaN(n) ? 3 : n;
};

// Helper: Map Options A-E to Values
const mapOption = (val: string, map: Record<string, string>, defaultVal: string = ''): string => {
    if (!val) return defaultVal;
    const key = val.toUpperCase().trim();
    return map[key] || defaultVal;
};

export const mapCsvRowToStudent = (row: OMRCsvRow): { userInfo: UserInfo, responses: UserResponses, id: string } => {
    // 1. User Info
    const userInfo: UserInfo = {
        fullName: row.full_name || 'Unknown Student',
        email: row.email || '',
        phone: row.mobile_number || '', // Critical for ID
        grade: row.grade || '11',
        schoolName: row.school_name || '',
        city: row.city || ''
        // dob: row['date of birth'] // Types doesn't have DOB yet, but we can add or ignore
    };

    // 2. Responses
    const responses: UserResponses = {
        raisec: {
            r1: parseScore(row.q1),
            r2: parseScore(row.q2),
            i1: parseScore(row.q3),
            i2: parseScore(row.q4),
            a1: parseScore(row.q5),
            a2: parseScore(row.q6),
            s1: parseScore(row.q7),
            s2: parseScore(row.q8),
            e1: parseScore(row.q9),
            e2: parseScore(row.q10),
            c1: parseScore(row.q11),
            c2: parseScore(row.q12),
        },
        academic: {
            favoriteSubject: mapOption(row.q13, {
                'A': 'Math', 'B': 'Physics', 'C': 'CS', 'D': 'Chemistry', 'E': 'Biology'
            }, 'Math'),
            strongestSubject: mapOption(row.q14, {
                'A': 'Math', 'B': 'Physics', 'C': 'CS', 'D': 'Chemistry', 'E': 'Biology'
            }, 'Math'),
            learningStyle: mapOption(row.q15, {
                'A': 'Practical', 'B': 'Theoretical', 'C': 'Rote'
            }, 'Practical'),
            examPrep: mapOption(row.q16, {
                'A': 'JEE', 'B': 'BITSAT', 'C': 'CET', 'D': 'Olympiad', 'E': 'None'
            }, 'None'),
            engineeringGoal: mapOption(row.q17, {
                'A': 'Software', 'B': 'Research', 'C': 'Startup', 'D': 'Core'
            }, 'Software')
        }
    };

    return {
        id: row.student_id, // Use CSV ID if available, likely maps to Mongo _id if consistent
        userInfo,
        responses
    };
};
