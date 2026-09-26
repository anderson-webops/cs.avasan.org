# IDE sync, September 2026

Source: Classes commits `67d6f553` (Pygame Surface), `2713a13a` (reviewed diagnostics), `5c0a1776` (console and argument warnings), `7ea90d28` (manual Turtle frames and search contrast), and `f9a44cb0` (caret Tab insertion), through the instructor fork's v2.7.217 sync.

This is a selective adaptation. All Python execution remains in the existing opaque-origin sandbox worker. Surface uses OffscreenCanvas there and sends only size-checked pixel snapshots through the bounded rendering channel. Runtime stage/version messages use an allowlist. The parent DOM, credentials, and browser storage remain inaccessible to student programs.

The existing Julio-only Admin page contains the private report inbox. Anonymous users can submit a reviewed report; only Julio can read or change report status. Requests use the classroom origin/header guard, a bounded limiter, small body parser, and strict diagnostic schema. Reports exclude account identifiers, code, console output, and raw tracebacks, and expire after 90 days. The privacy page explains the optional submission.

The five public courses, archived teacher references, optional student accounts, local anonymous projects, and Math-only Graph Sketcher boundary are unchanged. No dependency or deployment architecture change is required. This document records a source sync, not a production deployment.
