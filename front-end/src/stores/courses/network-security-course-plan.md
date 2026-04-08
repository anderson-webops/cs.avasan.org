# Network Security Course Plan

## Setup and Tooling

Preferred IDEs: `WebStorm` or `VS Code`, with `TypeScript` as the default
language and a Linux shell available for network labs.

Official links:

- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [WebStorm installation guide](https://www.jetbrains.com/help/webstorm/installation-guide.html)
- [VS Code Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

macOS walkthrough:

1. Install Node.js LTS.
2. Install either WebStorm or VS Code.
3. If using VS Code, add `ESLint`, `Prettier`, and the built-in TypeScript language support; add `Docker` and `Remote - SSH` if server labs are included.
4. Create a course workspace with separate folders for `tcp-labs`, `http-security`, `logging`, and `capstone`.
5. Verify that `node`, `npm`, and `npx tsc --version` work before beginning packet, proxy, or validation labs.

Windows walkthrough:

1. Install Node.js LTS.
2. Install either WebStorm or VS Code.
3. If using VS Code, add `ESLint`, `Prettier`, and optionally `Remote - WSL` if labs will run inside Linux.
4. Prefer WSL2 for firewall, socket, or reverse-proxy modules that behave more naturally in Linux.
5. Verify that terminals can run `node`, `npm`, and `npx tsc --version` before starting.

Course-specific notes:

- This course benefits from a Linux lab environment even though the main language is TS/JS.
- No CMake setup is needed.
- Include a setup check for local servers, ports, and logs before the first security module.

## Positioning

This course should use JavaScript or TypeScript as the implementation language
while teaching practical network security concepts. The emphasis should be on
defensive tooling, protocol understanding, secure services, and safe network
inspection rather than offensive abuse.

## Language Recommendation

Use `TypeScript` by default.

Reasons:

- clearer interfaces for packets, messages, and configs
- better long-term maintainability for server and tooling code
- smooth path to Node.js services, Express, Bun, Deno, and browser demos

JavaScript can still be used in the earliest examples where lowering friction
matters.

## Audience and Prerequisites

- Comfortable with JavaScript fundamentals
- Preferably completed the Linux Systems and Network Systems courses
- Basic HTTP and terminal familiarity

## Core Outcomes

- Understand core network security concepts and threat surfaces
- Build small defensive network tools in TS/JS
- Inspect traffic, validate inputs, and reason about trust boundaries
- Secure basic web services and APIs
- Understand logging, firewall policy, TLS, and authentication concepts

## Recommended Structure

### Unit 1: Security Model of Networked Systems

- attack surface
- trust boundaries
- threat modeling
- CIA triad in practical web/service terms

### Unit 2: Sockets, Ports, and Services

- what a listening service exposes
- localhost vs LAN vs public internet
- TCP vs UDP from a security perspective

### Unit 3: HTTP and API Security Basics

- requests, headers, cookies, tokens
- authentication vs authorization
- common mistakes in toy APIs

### Unit 4: TLS and Secure Transport

- what TLS protects
- certificates at a high level
- termination at reverse proxies
- why plain HTTP is risky

### Unit 5: Input Validation on the Network Boundary

- malformed requests
- size limits
- schema validation
- parser hardening

### Unit 6: Logging, Monitoring, and Forensics

- access logs
- structured logs
- suspicious activity indicators
- rate-limit and abuse telemetry

### Unit 7: Firewalls, Proxies, and Exposure

- UFW review
- reverse proxies
- internal vs external services
- least-exposed architecture

### Unit 8: Secure Node/TypeScript Services

- Express/Fastify hardening basics
- helmet-like protections
- CORS
- body size limits
- route-level auth

### Unit 9: Defensive Network Tooling in TS

- build a port scanner for localhost-only lab use
- build a request validator
- build a log anomaly summarizer
- build a simple packet metadata analyzer from captured logs

### Unit 10: WebSockets and Real-Time Security

- event validation
- connection lifecycle
- auth and abuse handling

### Unit 11: Deployment Security Basics

- environment variables
- secret handling
- TLS cert placement
- logging and service exposure

### Unit 12: Capstone

- design, secure, deploy, and audit a small TS network service

## Example Project Outlines

- local-only port inventory tool
- request schema validation gateway
- rate-limit and abuse detector
- secure mini chat or notification service
- log parser for suspicious requests
- TLS and proxy configuration walk-through companion app

## Delivery Notes

- Keep projects defensive and local where possible
- Pair every concept with a packet flow or service diagram
- Include a lab on reading logs after simulated bad requests

## Expansion Ideas

- Add DNS security and email security modules
- Add OAuth and session security modules
- Add WAF and CDN concepts
- Add a cloud network security follow-up with VPC/security groups
