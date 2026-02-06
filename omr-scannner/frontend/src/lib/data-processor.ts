import {
    Page1Schema, Page2Schema, Page3Schema, Page4Schema,
    type StudentRecord, type Page1Data, type Page2Data, type Page3Data, type Page4Data
} from './types';

export class DataProcessor {
    // Parsing logic
    static parsePage1(json: any): Page1Data {
        // Basic cleanup keys if needed
        return Page1Schema.parse(json);
    }

    static parsePage2(json: any): Page2Data {
        return Page2Schema.parse(json);
    }

    static parsePage3(json: any): Page3Data {
        return Page3Schema.parse(json);
    }

    static parsePage4(json: any): Page4Data {
        return Page4Schema.parse(json);
    }

    /**
     * Merges partial page data into a consolidated student record map
     */
    static mergeRecord(
        state: Map<string, Partial<StudentRecord>>,
        pageType: 1 | 2 | 3 | 4,
        data: any
    ): Map<string, Partial<StudentRecord>> {
        const newState = new Map(state);

        // Normalize Student ID? (e.g. remove spaces, upper case)
        const rawId = data.student_id;
        if (!rawId) {
            console.warn("Data has no student ID, skipping merge", data);
            return newState;
        }
        const studentId = rawId.trim().toUpperCase(); // Key

        const existing: Partial<StudentRecord> = newState.get(studentId) || { student_id: studentId, missing_pages: [1, 2, 3, 4] };

        // Remove current page from missing list
        if (existing.missing_pages) {
            existing.missing_pages = existing.missing_pages.filter(p => p !== pageType);
        }

        // Merge Fields
        const merged = { ...existing, ...data };

        // Check completion status
        if (existing.missing_pages && existing.missing_pages.length === 0) {
            merged.status = 'complete';
        } else {
            merged.status = 'processing';
        }

        newState.set(studentId, merged);
        return newState;
    }
}
