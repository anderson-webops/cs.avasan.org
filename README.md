# classes.jacobdanderson.net

Website and supporting API for `classes.jacobdanderson.net`.

## Repo Layout

- `front-end/` - Vite SSG application
- `back-end/` - Express + MongoDB API
- `HEALTHCHECKS.md` - monitor endpoints and expected `200`/`503` behavior

## Common Commands

```bash
npm install
npm run dev
npm run server
npm run serve
npm run build
npm run up
```

## Operational Notes

- The root `package-lock.json` is the authoritative lockfile for the repo. Keep it updated whenever dependencies change.
- Use `npm run server` and `npm run serve` when you want the API and front-end started separately.
- Use [`HEALTHCHECKS.md`](./HEALTHCHECKS.md) for deployment monitor targets instead of `/`.
