# Health Checks

Use these endpoints for monitoring. They do not require auth and do not redirect.

## Back-end (Express API)
- `GET /healthz`
  - returns `200 {"ok":true}`
- `GET /readyz`
  - returns `200 {"ready":true,"components":{"db":{"ok":true,"state":1}}}` when Mongo is connected and pingable
  - returns `503 {"ready":false,...}` when Mongo is unavailable
- `GET /_dbinfo`
  - internal diagnostics only
  - returns non-secret database metadata when allowed
  - returns `403 {"ok":false,"error":"forbidden"}` for public requests without internal access

Use `/healthz` and `/readyz` for monitors. Do not use `/`, login pages, or `/_dbinfo`.
