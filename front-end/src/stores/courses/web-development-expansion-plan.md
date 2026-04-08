# Web Development Expansion Plan

## Setup and Tooling

Preferred IDEs: `WebStorm` or `VS Code`. This course should normalize
file-based local development rather than browser-only playgrounds.

Official links:

- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [WebStorm installation guide](https://www.jetbrains.com/help/webstorm/installation-guide.html)
- [VS Code Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

macOS walkthrough:

1. Install Node.js LTS.
2. Install either WebStorm or VS Code.
3. If using VS Code, add `ESLint`, `Prettier`, `EditorConfig`, and optionally `GitLens`.
4. Create a course workspace with folders for `html-css`, `javascript`, `full-stack`, and `deployment`.
5. Verify that `node`, `npm`, and a simple local dev server work before moving into framework or hosting topics.

Windows walkthrough:

1. Install Node.js LTS.
2. Install either WebStorm or VS Code.
3. If using VS Code, add `ESLint`, `Prettier`, and `EditorConfig`; add `Remote - WSL` if Linux-based hosting labs are part of the course.
4. Verify that terminals can run `node`, `npm`, and a local development server before starting.
5. Teach file paths, terminals, and environment-variable basics early so deployment sections do not feel disconnected from the coding setup.

Course-specific notes:

- No CMake setup is needed.
- Add an early module on browser devtools, Git, npm, and project folder structure so hosting and backend topics land on top of a stable workflow.

## Positioning

The current JavaScript courses are strong for programming and browser work, but
they should grow into a broader `web development` path that covers building,
deploying, operating, and hosting real websites and web apps.

## Main Goals

- Turn browser-focused JavaScript into full web-development fluency
- Add practical hosting and deployment knowledge
- Connect front end, back end, databases, and networking
- Prepare students to publish real projects, not just CodePen demos

## Suggested Course Family

- `JavaScript Level 1`
- `JavaScript Level 2`
- `Web Development Foundations`
- `Full-Stack Web Apps`
- optional `Deployment and Cloud Hosting`

## Recommended Additions to the Current Path

### Stage 1: Strengthen the Existing JavaScript Courses

- keep fundamentals, DOM, HTML, CSS, and APIs
- add more file-based local projects, not only CodePen
- add Git/GitHub basics
- add debugging in browser devtools as a recurring strand

### Stage 2: Web Development Foundations

- project structure
- npm and package management
- modules and bundlers at a gentle level
- local dev servers
- environment variables
- forms and validation

### Stage 3: Front-End Applications

- modern UI composition
- routing
- state management basics
- async data loading
- accessibility
- responsive design

### Stage 4: Back-End Basics

- Node.js runtime
- Express or Fastify
- REST APIs
- request validation
- auth basics
- session vs token concepts

### Stage 5: Databases and Data Models

- MongoDB basics
- schemas and validation
- CRUD
- indexes at a high level
- when to choose SQL vs NoSQL

### Stage 6: Hosting and Deployment

- domain names
- DNS
- static hosting
- app hosting
- reverse proxies
- environment configuration
- monitoring and logs

## Hosting and Operations Topics to Add

### Linux and Server Basics

- SSH
- service processes
- logs
- environment files
- file locations

### Cloud and Platform Ideas

- Vercel or Netlify for front-end deployment
- Render, Fly.io, Railway, or VPS hosting for back ends
- AWS ideas:
  - EC2 for servers
  - S3 for static hosting
  - CloudFront conceptually
  - Route 53 for DNS
  - security groups and IAM at a high level

### Database Hosting

- MongoDB Atlas
- local MongoDB for development
- backup and restore basics

## Good Practical Projects

- portfolio site with custom domain
- blog or notes app with MongoDB
- booking/contact app with email integration
- real-time chat or notification app
- deployment lab: ship a front end and back end separately

## Suggested Advanced Strand

Add a follow-up on actual production operations:

- logs
- uptime
- TLS
- reverse proxies
- backups
- environment rotation
- performance basics

## Integration with Network Topics

This plan should explicitly cross-link with networking by teaching:

- ports and listening services
- DNS and domain routing
- TLS and HTTPS
- firewalls/security groups
- localhost vs LAN vs public deployment

## Expansion Ideas

- Add Docker and containers
- Add CI/CD with GitHub Actions
- Add Postgres as a SQL companion track
- Add S3-style object storage and CDN delivery
