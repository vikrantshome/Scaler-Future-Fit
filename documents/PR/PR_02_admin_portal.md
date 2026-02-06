# PR #2: Admin Portal & Offline Data Integration

## Branch
`feature/admin-portal`

## Summary
Enables ingestion of offline OMR data (from OMR Scanner CSV) into the main Career Counseling application. Includes Admin Portal UI, public report viewing, and summary CSV generation.

## Files Changed

### Modified
| File | Changes |
|------|---------|
| `App.tsx` | Added `ADMIN` and `PUBLIC_REPORT` states, URL-based routing |
| `server/index.js` | Added `/api/admin/upsert-student` and `/api/student/:id` endpoints |
| `services/apiService.ts` | Added `upsertStudent()` function |
| `package.json` | Added `file-saver`, `@types/file-saver` dependencies |

### Added
| File | Purpose |
|------|---------|
| `components/AdminPortal.tsx` | CSV upload UI, sequential processing, live progress |
| `components/PublicReport.tsx` | Public report viewer component |
| `services/csvMapping.ts` | Maps OMR CSV format to internal data structure |

## API Endpoints

### `POST /api/admin/upsert-student`
Upserts a single student record. Matches by phone → email → creates new.

**Request Body:**
```json
{
  "userInfo": { "fullName": "...", "phone": "...", "email": "..." },
  "responses": { "raisec": {...}, "academic": {...} },
  "results": { "topBranches": [...], "raisecProfile": {...} }
}
```

**Response:**
```json
{ "success": true, "id": "mongo_id", "name": "Student Name" }
```

### `GET /api/student/:id`
Returns student data for public report viewing.

## Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/upload` | `AdminPortal` | CSV upload interface |
| `/report/:id` | `PublicReport` | Public shareable report |

## Data Mapping (OMR CSV → Internal)

| CSV Column | Internal Field | Notes |
|------------|----------------|-------|
| `q1` - `q12` | `raisec.*` | RAISEC scores (1-5), defaults to 3 if empty |
| `q13` | `academic.favoriteSubject` | A=Math, B=Physics, C=CS, D=Chemistry, E=Biology |
| `q14` | `academic.strongestSubject` | Same mapping as Q13 |
| `q15` | `academic.learningStyle` | A=Practical, B=Theoretical, C=Rote |
| `q16` | `academic.examPrep` | A=JEE, B=BITSAT, C=CET, D=Olympiad, E=None |
| `q17` | `academic.engineeringGoal` | A=Software, B=Research, C=Startup, D=Core |

## Testing Instructions

### Backend
1. `cd server && node index.js`
2. Test endpoint:
   ```bash
   curl -X POST http://localhost:8080/api/admin/upsert-student \
     -H "Content-Type: application/json" \
     -d '{"userInfo":{"fullName":"Test","phone":"1234567890"},"responses":{"raisec":{"r1":4},"academic":{}},"results":{"topBranches":[]}}'
   ```

### Frontend
1. `npm run dev` (in Scaler-Future-Fit root)
2. Navigate to `http://localhost:5173/admin/upload`
3. Upload OMR CSV from `omr-scannner/data/output/`
4. Verify live progress logs
5. Download summary CSV and verify report links work

## Dependencies Added
- `file-saver` - Client-side file download
- `papaparse` - CSV parsing (already present)

## Breaking Changes
None - All new functionality, existing features unchanged.
