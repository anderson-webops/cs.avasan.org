import type { RawCourse, RawCourseModuleItem } from "./types";

const NETWORK_SECURITY_REPO =
	"https://github.com/instruction-material/Network-Security/tree/main";

function starterRepoLink(projectId: string) {
	return `${NETWORK_SECURITY_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${NETWORK_SECURITY_REPO}/${projectId}/solution`;
}

function projectItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(projectId),
		solutionLink: solutionRepoLink(projectId)
	};
}

function securityNotebook(
	unitTitle: string,
	focus: string
): RawCourseModuleItem {
	return {
		title: `Security Notebook: ${unitTitle}`,
		content: `Keep a running security notebook for ${unitTitle.toLowerCase()} that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about ${focus}. The habit should be evidence first, assumptions second.`
	};
}

function threatDrill(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Threat Drill: ${title}`,
		content: `Start with one short scenario and require a written claim before any fix is attempted. ${prompt}`
	};
}

function diagramExercise(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Diagram Exercise: ${title}`,
		content: `Have students draw the service path, label every trust boundary, and explain the direction of data flow. ${prompt}`
	};
}

export const networkSecurityCourse: RawCourse = {
	name: "Network Security",
	modules: [
		{
			title: "NSEC0 Setup and Tooling",
			curriculum: [
				{
					title: "Editor, Runtime, and TypeScript Baseline",
					content:
						"Standardize on `TypeScript` with either `VS Code` or `WebStorm`, verify `node`, `npm`, and `npx tsc --version`, and make the course workspace explicit from day one. Students should expect the implementation language to be TS even when some early examples stay small and script-like."
				},
				{
					title: "Linux-Friendly Lab Environment",
					content:
						"Require a Linux shell for the networking and service labs, whether through WSL2, a VM, Docker, or a remote host. Firewall, proxy, socket, and service exposure behavior is easier to reason about when students are not fighting an OS mismatch."
				},
				{
					title: "Workspace Layout for Security Labs",
					content:
						"Set up separate folders for `tcp-labs`, `http-security`, `logging`, and `capstone`, then verify that local services can bind to ports, write logs, and be inspected. This turns the environment check into part of the course rather than a hidden prerequisite."
				},
				{
					title: "Positioning, Prerequisites, and Safe Scope",
					content:
						"Frame the course as defensive network security for students who are already comfortable with JavaScript fundamentals and preferably have completed `Linux Systems` and `Network Systems`. Emphasize secure services, observability, trust boundaries, and controlled local labs rather than offensive abuse."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Setup and Tooling",
					"which services are running locally, how they are being inspected, and where the lab boundary starts"
				),
				diagramExercise(
					"Initial Service Map",
					"Label the editor, terminal, local service, reverse proxy if present, and the specific log files students will inspect during the first two units."
				)
			]
		},
		{
			title: "Unit 1: Security Model of Networked Systems",
			curriculum: [
				{
					title: "Attack Surface in Real Services",
					content:
						"Teach attack surface as every externally reachable input, management path, credential boundary, and background integration a service exposes. Students should learn to name the surface area of a simple app before they talk about specific mitigations."
				},
				{
					title: "Trust Boundaries and Data Ownership",
					content:
						"Use the path from browser to proxy to app to database to show where trust changes hands. The course should keep asking which layer is making a trust decision and what evidence that layer actually has."
				},
				{
					title: "CIA Triad in Practical Service Terms",
					content:
						"Teach confidentiality, integrity, and availability using web and service examples: leaked tokens, tampered requests, poisoned logs, service outages, and rate-limit exhaustion. The aim is to make the triad operational rather than abstract."
				},
				{
					title: "Threat Modeling Small TS Services",
					content:
						"Walk through a lightweight threat-modeling process for a toy Node or TypeScript service. Students should identify assets, actors, entry points, trust boundaries, likely failures, and the first monitoring signals they would want before deployment."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Security Model of Networked Systems",
					"what the service is protecting, who is trusted, and which assets matter most"
				),
				threatDrill(
					"Where Does Trust Change?",
					"Give a browser -> reverse proxy -> API -> database diagram and require students to mark where authentication, authorization, logging, and input validation should happen first."
				)
			]
		},
		{
			title: "Unit 2: Sockets, Ports, and Services",
			curriculum: [
				{
					title: "What a Listening Service Exposes",
					content:
						"Treat a listening socket as a concrete exposure point rather than a vague idea of 'the server'. Students should be able to explain which process, protocol, address, and port are actually reachable and which clients can reach them."
				},
				{
					title: "Localhost versus LAN versus Public Internet",
					content:
						"Use binding addresses and firewall context to explain why `127.0.0.1`, a private LAN address, and a public interface imply different risk levels. The security lesson is that reachability scope is part of the design, not just a deployment afterthought."
				},
				{
					title: "TCP and UDP from a Security Perspective",
					content:
						"Compare TCP and UDP by what they expose to monitoring, how abuse or spoofing risk differs, and what validation assumptions each protocol tends to encourage. Students should stop thinking only in terms of connection style and start thinking about observability and control surfaces."
				},
				{
					title: "Map Ports Back to Real Processes",
					content:
						"Use `ss`, `lsof`, and service managers to tie listeners back to specific processes and configs. The main habit is to verify the real service surface before trying to secure it."
				},
				projectItem(
					"Project: Local-Only Port Inventory Tool",
					"Build a defensive inventory tool that classifies listeners by protocol, bind address, owner, and likely exposure level. Students should treat the output as the first draft of a host attack-surface report rather than as a raw command dump.",
					"NSEC1-Local-Port-Inventory-Tool"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"Sockets, Ports, and Services",
					"which listeners are local-only, which are LAN-visible, and which would be dangerous if exposed publicly"
				),
				threatDrill(
					"Unexpected Listener on a Shared Host",
					"Present one extra open port on a student lab machine and require them to rank the first checks they would run before deciding whether the listener is benign, internal, or unsafe."
				)
			]
		},
		{
			title: "Unit 3: HTTP and API Security Basics",
			curriculum: [
				{
					title: "Requests, Headers, Cookies, and Tokens",
					content:
						"Make the HTTP request concrete: method, path, headers, body, cookie state, and bearer tokens all represent different trust claims. Students should be able to explain what each one proves and what each one can be forged or misused to do."
				},
				{
					title: "Authentication versus Authorization",
					content:
						"Use small API examples to separate identity from permission. The course should repeatedly show that a request can be authenticated correctly and still be unauthorized for the resource or action it is attempting."
				},
				{
					title: "Common Mistakes in Toy APIs",
					content:
						"Cover insecure defaults such as trusting client role flags, leaking internal errors, reflecting unsanitized values, skipping ownership checks, or exposing admin-style endpoints without proper guardrails. The goal is for students to recognize weak assumptions before they write more code."
				},
				{
					title: "State Changes, Idempotence, and Error Surfaces",
					content:
						"Teach why method choice, status codes, retry behavior, and response details all matter to security. Students should understand that sloppy API behavior makes abuse harder to detect and legitimate failures harder to investigate."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"HTTP and API Security Basics",
					"what claims the request makes, which claims are verified, and where an attacker could lie"
				),
				diagramExercise(
					"One Request Across the Boundary",
					"Draw an authenticated API request from browser or script to server response, including cookies or tokens, validation points, authz checks, and logging points."
				)
			]
		},
		{
			title: "Unit 4: TLS and Secure Transport",
			curriculum: [
				{
					title: "What TLS Protects and What It Does Not",
					content:
						"Teach TLS as protection for data in transit against interception and tampering, not as a blanket application-security solution. Students should know that TLS does not replace correct authorization, input validation, or safe server behavior."
				},
				{
					title: "Certificates and Trust at a High Level",
					content:
						"Explain certificates, CAs, hostname matching, expiration, and chain trust without turning the unit into a crypto deep dive. The point is to make certificate failures interpretable when they surface in deployment or incident work."
				},
				{
					title: "Reverse-Proxy Termination",
					content:
						"Show where TLS often terminates in real deployments and how that changes what the upstream app sees. Students should understand why trusted proxy headers, secure forwarding rules, and internal-only app listeners matter once TLS ends at the edge."
				},
				{
					title: "Why Plain HTTP Is Still Risky",
					content:
						"Use redirects, downgrade mistakes, mixed-content issues, and exposed login or cookie flows to show why plain HTTP still creates avoidable risk. This unit should tie transport security back to service design rather than treating it as a separate ops task."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"TLS and Secure Transport",
					"where TLS starts, where it ends, and which component still has to make authorization and validation decisions"
				),
				threatDrill(
					"TLS Terminates Before the App",
					"Ask students what the upstream app can trust about `X-Forwarded-*` headers, the original scheme, and client IP data when the reverse proxy is the TLS endpoint."
				)
			]
		},
		{
			title: "Unit 5: Input Validation on the Network Boundary",
			curriculum: [
				{
					title: "Malformed Requests and Parser Edges",
					content:
						"Teach malformed requests as a boundary problem, not just a coding inconvenience. Students should look for parser ambiguity, missing fields, unexpected nesting, unsupported content types, and type confusion before values ever touch business logic."
				},
				{
					title: "Size Limits and Resource Exhaustion",
					content:
						"Make body size, field count, array size, and connection cost explicit security concerns. The course should connect validation to availability by showing how oversized requests and repeated parse work can become abuse vectors."
				},
				{
					title: "Schema Validation and Safe Rejection",
					content:
						"Use typed request schemas and clear rejection paths to normalize defensive boundary handling. Students should return consistent errors, avoid leaking internals, and keep enough detail in logs to debug without echoing unsafe input back to the client."
				},
				{
					title: "Normalize Before Deeper Logic",
					content:
						"Teach early normalization of casing, enums, identifiers, and optional fields so downstream code can rely on a smaller set of safe assumptions. The security value is fewer ambiguous states and fewer ways to bypass checks."
				},
				projectItem(
					"Project: Request Schema Validation Gateway",
					"Build a gateway layer that checks request shape, body size, allowed methods, and required authentication context before forwarding work to the rest of the service. The project should feel like a reusable network boundary rather than a one-off form checker.",
					"NSEC2-Request-Schema-Validation-Gateway"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"Input Validation on the Network Boundary",
					"which requests are rejected early, how limits are enforced, and what evidence is kept for incident review"
				),
				threatDrill(
					"Valid JSON, Unsafe Request",
					"Give a request that is syntactically correct but semantically unsafe and require students to explain whether the block belongs in schema validation, authorization, or later business rules."
				)
			]
		},
		{
			title: "Unit 6: Logging, Monitoring, and Forensics",
			curriculum: [
				{
					title: "Access Logs and Structured Logs",
					content:
						"Teach the difference between generic access logs and structured application logs, then show why both matter. Students should understand which questions each log type can answer during routine monitoring and during a real incident."
				},
				{
					title: "Suspicious Activity Indicators",
					content:
						"Use repeated 401 or 403 responses, path scanning, bursty clients, oversized bodies, odd user agents, and authentication churn as concrete indicators of suspicious activity. The habit should be to define signals before an incident happens."
				},
				{
					title: "Rate-Limit and Abuse Telemetry",
					content:
						"Teach rate limiting as both a control and a source of evidence. Students should log throttle decisions, track source identity carefully, and understand the difference between a strict limit, a challenge, and a hard block."
				},
				{
					title: "Reading Logs After Simulated Bad Requests",
					content:
						"Include a lab where students deliberately send malformed or suspicious requests to a safe local service and then reconstruct what happened from the logs. This turns monitoring into an investigative skill instead of a passive dashboard habit."
				},
				projectItem(
					"Project: Suspicious Request Log Parser",
					"Build a parser that turns raw request logs into a short anomaly report with top sources, failure clusters, and suspicious request patterns. The output should help a human operator decide what to inspect next.",
					"NSEC3-Suspicious-Request-Log-Parser"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"Logging, Monitoring, and Forensics",
					"which events matter, which fields are safe to log, and how one incident timeline can be reconstructed from evidence"
				),
				diagramExercise(
					"Incident Timeline from Logs",
					"Have students convert five to ten log lines into a timeline with client identity, attempted action, server response, and the next best follow-up question."
				)
			]
		},
		{
			title: "Unit 7: Firewalls, Proxies, and Exposure",
			curriculum: [
				{
					title: "UFW Review and Least-Open Policy",
					content:
						"Review host firewall behavior with a deny-by-default mindset, then explicitly map which ports should be reachable from which networks. Students should learn to treat exposure policy as a design decision that should be documented, not guessed."
				},
				{
					title: "Reverse Proxies as Security Boundaries",
					content:
						"Teach reverse proxies as both routing tools and security boundaries. They can terminate TLS, enforce method or size policy, centralize logs, and keep internal services off the public edge when configured carefully."
				},
				{
					title: "Internal versus External Services",
					content:
						"Use concrete examples such as admin panels, metrics endpoints, worker callbacks, and app APIs to show which services should stay internal. The course should reinforce that 'works from the outside' is not the same thing as 'should be reachable from the outside'."
				},
				{
					title: "Trusted Proxy Headers and Real Client Identity",
					content:
						"Explain when forwarded headers are trustworthy, when they are attacker-controlled, and how misconfigured proxy trust corrupts logs, rate limits, or auth logic. Students should understand that client identity is a boundary decision, not a free value."
				},
				projectItem(
					"Project: TLS and Proxy Configuration Companion App",
					"Build a configuration-audit companion that reviews reverse-proxy and TLS settings for exposed services, flags weak forwarding assumptions, and recommends least-exposed service layouts. The emphasis is configuration reasoning rather than offensive scanning.",
					"NSEC6-TLS-and-Proxy-Companion-App"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"Firewalls, Proxies, and Exposure",
					"which component owns the public edge, which ports remain internal, and which headers can be trusted"
				),
				threatDrill(
					"Accidental Public Exposure",
					"Present a service that was intended to be internal but is reachable publicly and require students to separate the likely causes into binding mistakes, proxy mistakes, and firewall mistakes."
				)
			]
		},
		{
			title: "Unit 8: Secure Node/TypeScript Services",
			curriculum: [
				{
					title: "Express or Fastify Hardening Basics",
					content:
						"Use one small service to show safe defaults around routing, parser configuration, central error handling, and defensive middleware ordering. Students should understand how framework defaults and app-specific decisions combine into a real boundary."
				},
				{
					title: "Security Headers and Browser-Side Policy",
					content:
						"Cover common header protections such as content type discipline, frame policy, and transport hints, and explain what they do and do not solve. This keeps browser-facing service security tied to concrete HTTP behavior instead of vague best-practice lists."
				},
				{
					title: "CORS, Body Limits, and Parsing Rules",
					content:
						"Teach CORS as a browser policy surface, not an authentication mechanism, then pair it with strict body parsing and request-size limits. Students should be able to explain exactly which clients a CORS rule affects and which clients it does not."
				},
				{
					title: "Route-Level Authentication and Authorization",
					content:
						"Require explicit route guards, ownership checks, and admin boundaries on top of authentication. The course should keep reinforcing that each sensitive route needs a defensible authorization story."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Secure Node/TypeScript Services",
					"which guards happen at middleware, which happen per route, and which headers or limits are part of the public contract"
				),
				diagramExercise(
					"Defensive Service Pipeline",
					"Sketch the order of middleware, validation, authentication, authorization, business logic, and logging in a hardened Node service."
				)
			]
		},
		{
			title: "Unit 9: Defensive Network Tooling in TS",
			curriculum: [
				{
					title: "Local-Only Scanners and Safe Lab Constraints",
					content:
						"Make the ethics and boundary conditions explicit before students build any network tool. Tools should stay local or lab-scoped, record their assumptions, and avoid normalizing broad unsolicited scanning as acceptable practice."
				},
				{
					title: "Reusable Request Validation Helpers",
					content:
						"Show how the same validation logic can be turned into reusable helpers or middleware. The learning goal is to treat boundary checks as a first-class subsystem rather than scattered `if` statements."
				},
				{
					title: "Anomaly Summaries from Logs and Metadata",
					content:
						"Teach students to transform noisy network evidence into a short ranked summary that a human operator can act on. This is where defensive tooling becomes useful rather than merely interesting."
				},
				{
					title: "Packet Metadata Without Full Packet Abuse",
					content:
						"Use captured request metadata or safe local logs to reason about flow, size, timing, and protocol behavior without turning the course into an offensive packet-crafting exercise. The emphasis should stay on interpretation and defense."
				},
				projectItem(
					"Project: Rate-Limit and Abuse Detector",
					"Build a small TS analyzer that groups events by actor, tracks burst behavior, and recommends throttle or block responses based on repeated suspicious patterns. The project should produce an operator-friendly summary instead of a raw score dump.",
					"NSEC4-Rate-Limit-and-Abuse-Detector"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"Defensive Network Tooling in TS",
					"how a tool stays within lab scope, what evidence it consumes, and what kind of decision it is allowed to make"
				),
				threatDrill(
					"Helpful Tool or Dangerous Assumption?",
					"Give a tool idea and require students to explain what guardrails, logging, and scope limits are necessary before it would be appropriate for this course."
				)
			]
		},
		{
			title: "Unit 10: WebSockets and Real-Time Security",
			curriculum: [
				{
					title: "Connection Lifecycle and Session State",
					content:
						"Teach connect, authenticate, subscribe, send, receive, and disconnect as distinct phases with different failure risks. Students should stop treating a WebSocket as a magical persistent tunnel and start treating it as a stateful security boundary."
				},
				{
					title: "Event Validation and Message Contracts",
					content:
						"Require strict event schemas, allowed event names, payload limits, and per-event authorization checks. The course should show how real-time protocols become risky when they skip the structure that HTTP handlers usually make more obvious."
				},
				{
					title: "Abuse Handling, Backpressure, and Disconnect Policy",
					content:
						"Cover message floods, invalid event spam, reconnect storms, and idle-session cleanup. Students should understand that availability protection is part of real-time security, not separate from it."
				},
				{
					title: "Broadcast Boundaries and Data Leakage",
					content:
						"Use rooms, channels, and fan-out logic to show how easy it is to leak data to the wrong audience in a real-time app. The key habit is to treat every broadcast path as an authorization surface."
				},
				projectItem(
					"Project: Secure Mini Chat or Notification Service",
					"Build a small real-time service with authenticated connections, validated events, bounded room membership, and basic abuse controls. Students should prioritize correct boundaries and observability over flashy features.",
					"NSEC5-Secure-Real-Time-Notifier"
				)
			],
			supplementalProjects: [
				securityNotebook(
					"WebSockets and Real-Time Security",
					"how the connection is authenticated, which events are allowed, and when the service should throttle or disconnect"
				),
				diagramExercise(
					"Real-Time Trust Boundary",
					"Draw one WebSocket session with connect, auth, subscribe, send, and disconnect phases and mark where validation and authorization happen."
				)
			]
		},
		{
			title: "Unit 11: Deployment Security Basics",
			curriculum: [
				{
					title: "Environment Variables and Secret Handling",
					content:
						"Teach secrets as runtime configuration that should be injected deliberately, rotated when needed, and kept out of source control and logs. Students should be able to distinguish public config, internal config, and true secrets."
				},
				{
					title: "TLS Certificate Placement and Renewal Ownership",
					content:
						"Explain where certificates live, which process terminates TLS, and who is responsible for renewal and failure monitoring. This gives students a deployment model they can reason about when something breaks at the edge."
				},
				{
					title: "Service Exposure, Logs, and Recovery Signals",
					content:
						"Teach deployment review as a combined exercise in public exposure, logging quality, health checks, and rollback clarity. Students should know what evidence they need before declaring a deployment secure enough to expose."
				},
				{
					title: "Secure Release Checklist",
					content:
						"End the unit with a practical release checklist: only intended ports exposed, reverse-proxy headers understood, auth paths tested, limits in place, logs readable, and recovery steps documented. The emphasis should be repeatable discipline rather than one-time heroics."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Deployment Security Basics",
					"what secrets exist, where TLS terminates, what is publicly exposed, and what evidence confirms the deployment state"
				),
				threatDrill(
					"Production Service, Missing Guardrail",
					"Present a deployment with one missing control such as no body limit, no auth on an admin route, or no log visibility, and require students to rank the operational risk before proposing a fix."
				)
			]
		},
		{
			title: "Unit 12: Capstone",
			curriculum: [
				{
					title: "Design a Small Secure Network Service",
					content:
						"Have students design a small TS service with a clear purpose, explicit actors, mapped trust boundaries, and a narrow exposed surface. The capstone should start with threat modeling and architecture before implementation begins."
				},
				{
					title: "Implement Controls and Observability Together",
					content:
						"Require validation, auth, authorization, rate limits, structured logs, and deployment notes as part of the same deliverable. Students should not treat security and monitoring as separate post-build tasks."
				},
				{
					title: "Audit the Deployed Service",
					content:
						"Run a post-build audit that checks binding scope, proxy behavior, TLS placement, failure handling, and abuse visibility. The audit should produce a short list of defended assumptions and unresolved risks."
				},
				{
					title: "Write the Incident and Recovery Notes",
					content:
						"Finish with a brief incident-response document that explains how suspicious requests would be investigated, which logs would be consulted first, and what immediate containment steps the operator would take."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Capstone",
					"the full threat model, the defensive controls implemented, and the remaining risks after audit"
				),
				diagramExercise(
					"Capstone Security Review",
					"Produce one final service diagram that includes client entry points, reverse proxy boundaries, app routes, auth checks, logs, and recovery signals."
				)
			]
		},
		{
			title: "NSEC13 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "DNS and Email Security Follow-Up",
					content:
						"Extend the course with DNS security, resolver trust, email authentication, and delivery-surface protection once students can already reason about the core service boundary."
				},
				{
					title: "OAuth and Session Security",
					content:
						"Add a deeper identity module on session lifecycle, delegated auth, token scopes, and callback-boundary handling after the HTTP and authz foundations are stable."
				},
				{
					title: "WAF, CDN, and Edge Controls",
					content:
						"Introduce WAF concepts, CDN caching risks, rate-limit policy at the edge, and request filtering as a follow-on to the reverse-proxy and logging units."
				},
				{
					title: "Cloud Network Security Path",
					content:
						"Build a follow-up course around VPCs, security groups, subnets, private services, and public edge design so students can move from host-level hardening into cloud network architecture."
				}
			],
			supplementalProjects: [
				securityNotebook(
					"Expansion Ideas and Next Steps",
					"which next layer of security work builds most naturally from the current course"
				),
				threatDrill(
					"Choose the Right Follow-On",
					"Given a student who wants to work on identity, edge protection, or cloud infrastructure, require them to justify which next module or course path fits best and why."
				)
			]
		}
	]
};
