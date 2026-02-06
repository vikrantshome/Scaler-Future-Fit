# Pull Request Documentation

This folder contains PR descriptions for all changes made during development. Each PR document outlines:
- Branch name
- Files changed
- Summary of changes
- Testing instructions

## PR Index

| PR # | Branch Name | Description | Status |
|------|-------------|-------------|--------|
| 1 | `feature/omr-scanner` | Standalone OMR Scanner Application | Ready |
| 2 | `feature/admin-portal` | Admin Portal + Offline Data Integration | Ready |

---

## Branch Strategy

```
main
 └── dev
      ├── feature/omr-scanner       (PR #1)
      └── feature/admin-portal      (PR #2)
```

**Merge Order**: PR #1 → PR #2 (Admin Portal depends on OMR Scanner output format)
