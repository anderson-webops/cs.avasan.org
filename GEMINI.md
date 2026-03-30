# Workspace Instructions

## Dependency Management
- Lockfile synchronization: always run `npm install` from the repository root after modifying any `package.json` so `package-lock.json` stays in sync.
- Verification: before committing dependency changes, verify that the lockfile reflects the intended versions and that no new deprecation warnings were introduced.

## Version Control Workflow
- Atomic commits: only commit and push after the implementation, relevant validation, and lockfile synchronization are complete.
- Verification before push: run the relevant project checks before pushing. At minimum, run `npm run lint` plus the tests or builds needed for the files you changed.
- Commit style: keep commit messages concise and aligned with the repository’s existing history.
