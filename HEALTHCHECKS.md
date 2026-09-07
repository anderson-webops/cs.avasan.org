# Health Checks

Use these endpoints for monitoring. They do not require auth and do not redirect.

## Back-end (Express API)
- `GET /healthz`
  - returns `200` with `ok: true` plus the exact classroom-analytics collection
    switch and configured retention period (or `null`)
- `GET /readyz`
  - returns `200 {"ready":true,"components":{"db":{"ok":true,"state":1}}}` when Mongo is connected and pingable
  - returns `503 {"ready":false,...}` when Mongo is unavailable
- `GET /_dbinfo`
  - internal diagnostics only
  - returns non-secret database metadata only when the request supplies the configured `INTERNAL_DIAGNOSTICS_KEY`
  - returns `403 {"ok":false,"error":"forbidden"}` when the key is absent or incorrect, including in local development

Use `/healthz` and `/readyz` for monitors. Do not use `/`, login pages, or `/_dbinfo`.

The private loopback-only
`GET http://127.0.0.1:3008/classroom-analytics/summary?days=7|30|90` route is
not a health check. It returns 404 when no companion service key is configured
and 403 without the exact key when configured; monitoring must never possess
that key. Public `/api/classroom-analytics/summary` always returns JSON 404.
