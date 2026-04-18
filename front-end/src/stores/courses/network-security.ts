import type { RawCourse } from "./types";

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
				},
				{
					title: "NSEC0 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Setup and Tooling",
					content:
						"Keep a running security notebook for setup and tooling that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which services are running locally, how they are being inspected, and where the lab boundary starts. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-nsec0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to NSEC0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-nsec0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-nsec0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to NSEC0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-nsec0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-nsec0-setup-and-tooling-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 1: Security Model of Networked Systems: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Security Model of Networked Systems",
					content:
						"Keep a running security notebook for security model of networked systems that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what the service is protecting, who is trusted, and which assets matter most. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems/solution"
				},
				{
					title: "Unit 1: Security Model of Networked Systems supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Security Model of Networked Systems. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-unit-1-security-model-of-networked-systems-suppl/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-03-unit-1-security-model-of-networked-systems-suppl/solution"
				},
				{
					title: "Unit 1: Security Model of Networked Systems supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Security Model of Networked Systems. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems-suppl/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-04-unit-1-security-model-of-networked-systems-suppl/solution"
				}
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
						"Use `ss`, `lsof`, and service managers to tie listeners back to specific processes and configs. The main habit is to verify the real service surface before trying to secure it. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Project: Local-Only Port Inventory Tool",
					content:
						"Build a defensive inventory tool that classifies listeners by protocol, bind address, owner, and likely exposure level. Students should treat the output as the first draft of a host attack-surface report rather than as a raw command dump.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Sockets, Ports, and Services",
					content:
						"Keep a running security notebook for sockets, ports, and services that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which listeners are local-only, which are LAN-visible, and which would be dangerous if exposed publicly. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC1-Local-Port-Inventory-Tool/solution"
				},
				{
					title: "Unit 2: Sockets, Ports, and Services supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Sockets, Ports, and Services. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-2-sockets-ports-and-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-2-sockets-ports-and-services-supplemental-2/solution"
				},
				{
					title: "Unit 2: Sockets, Ports, and Services supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Sockets, Ports, and Services. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-2-sockets-ports-and-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-2-sockets-ports-and-services-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 3: HTTP and API Security Basics: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: HTTP and API Security Basics",
					content:
						"Keep a running security notebook for http and api security basics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what claims the request makes, which claims are verified, and where an attacker could lie. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-05-unit-3-http-and-api-security-basics/solution"
				},
				{
					title: "Unit 3: HTTP and API Security Basics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: HTTP and API Security Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-3-http-and-api-security-basics-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-3-http-and-api-security-basics-supplemental/solution"
				},
				{
					title: "Unit 3: HTTP and API Security Basics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: HTTP and API Security Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-3-http-and-api-security-basics-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-3-http-and-api-security-basics-supplemental/solution"
				}
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
				},
				{
					title: "Unit 4: TLS and Secure Transport: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: TLS and Secure Transport",
					content:
						"Keep a running security notebook for tls and secure transport that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about where TLS starts, where it ends, and which component still has to make authorization and validation decisions. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-06-unit-4-tls-and-secure-transport/solution"
				},
				{
					title: "Unit 4: TLS and Secure Transport supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: TLS and Secure Transport. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-4-tls-and-secure-transport-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-4-tls-and-secure-transport-supplemental-2/solution"
				},
				{
					title: "Unit 4: TLS and Secure Transport supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: TLS and Secure Transport. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-4-tls-and-secure-transport-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-4-tls-and-secure-transport-supplemental-3/solution"
				}
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
				{
					title: "Project: Request Schema Validation Gateway",
					content:
						"Build a gateway layer that checks request shape, body size, allowed methods, and required authentication context before forwarding work to the rest of the service. The project should feel like a reusable network boundary rather than a one-off form checker.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Input Validation on the Network Boundary",
					content:
						"Keep a running security notebook for input validation on the network boundary that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which requests are rejected early, how limits are enforced, and what evidence is kept for incident review. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC2-Request-Schema-Validation-Gateway/solution"
				},
				{
					title: "Unit 5: Input Validation on the Network Boundary supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Input Validation on the Network Boundary. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-unit-5-input-validation-on-the-network-boundary-/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-unit-5-input-validation-on-the-network-boundary-/solution"
				},
				{
					title: "Unit 5: Input Validation on the Network Boundary supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Input Validation on the Network Boundary. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-12-unit-5-input-validation-on-the-network-boundary-/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-12-unit-5-input-validation-on-the-network-boundary-/solution"
				}
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
				{
					title: "Project: Suspicious Request Log Parser",
					content:
						"Build a parser that turns raw request logs into a short anomaly report with top sources, failure clusters, and suspicious request patterns. The output should help a human operator decide what to inspect next.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Logging, Monitoring, and Forensics",
					content:
						"Keep a running security notebook for logging, monitoring, and forensics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which events matter, which fields are safe to log, and how one incident timeline can be reconstructed from evidence. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC3-Suspicious-Request-Log-Parser/solution"
				},
				{
					title: "Unit 6: Logging, Monitoring, and Forensics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Logging, Monitoring, and Forensics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-13-unit-6-logging-monitoring-and-forensics-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-13-unit-6-logging-monitoring-and-forensics-suppleme/solution"
				},
				{
					title: "Unit 6: Logging, Monitoring, and Forensics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Logging, Monitoring, and Forensics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-14-unit-6-logging-monitoring-and-forensics-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-14-unit-6-logging-monitoring-and-forensics-suppleme/solution"
				}
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
				{
					title: "Project: TLS and Proxy Configuration Companion App",
					content:
						"Build a configuration-audit companion that reviews reverse-proxy and TLS settings for exposed services, flags weak forwarding assumptions, and recommends least-exposed service layouts. The emphasis is configuration reasoning rather than offensive scanning.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Firewalls, Proxies, and Exposure",
					content:
						"Keep a running security notebook for firewalls, proxies, and exposure that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which component owns the public edge, which ports remain internal, and which headers can be trusted. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC6-TLS-and-Proxy-Companion-App/solution"
				},
				{
					title: "Unit 7: Firewalls, Proxies, and Exposure supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Firewalls, Proxies, and Exposure. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-15-unit-7-firewalls-proxies-and-exposure-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-15-unit-7-firewalls-proxies-and-exposure-supplemental-2/solution"
				},
				{
					title: "Unit 7: Firewalls, Proxies, and Exposure supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Firewalls, Proxies, and Exposure. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-16-unit-7-firewalls-proxies-and-exposure-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-16-unit-7-firewalls-proxies-and-exposure-supplemental-3/solution"
				}
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
				},
				{
					title: "Unit 8: Secure Node/TypeScript Services: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Secure Node/TypeScript Services",
					content:
						"Keep a running security notebook for secure node/typescript services that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which guards happen at middleware, which happen per route, and which headers or limits are part of the public contract. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-07-unit-8-secure-node-typescript-services/solution"
				},
				{
					title: "Unit 8: Secure Node/TypeScript Services supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Secure Node/TypeScript Services. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-17-unit-8-secure-node-typescript-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-17-unit-8-secure-node-typescript-services-supplemental-2/solution"
				},
				{
					title: "Unit 8: Secure Node/TypeScript Services supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Secure Node/TypeScript Services. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-18-unit-8-secure-node-typescript-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-18-unit-8-secure-node-typescript-services-supplemental-3/solution"
				}
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
				{
					title: "Project: Rate-Limit and Abuse Detector",
					content:
						"Build a small TS analyzer that groups events by actor, tracks burst behavior, and recommends throttle or block responses based on repeated suspicious patterns. The project should produce an operator-friendly summary instead of a raw score dump.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Defensive Network Tooling in TS",
					content:
						"Keep a running security notebook for defensive network tooling in ts that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about how a tool stays within lab scope, what evidence it consumes, and what kind of decision it is allowed to make. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC4-Rate-Limit-and-Abuse-Detector/solution"
				},
				{
					title: "Unit 9: Defensive Network Tooling in TS supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Defensive Network Tooling in TS. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-19-unit-9-defensive-network-tooling-in-ts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-19-unit-9-defensive-network-tooling-in-ts-supplemental-2/solution"
				},
				{
					title: "Unit 9: Defensive Network Tooling in TS supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Defensive Network Tooling in TS. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-20-unit-9-defensive-network-tooling-in-ts-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-20-unit-9-defensive-network-tooling-in-ts-supplemental-3/solution"
				}
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
				{
					title: "Project: Secure Mini Chat or Notification Service",
					content:
						"Build a small real-time service with authenticated connections, validated events, bounded room membership, and basic abuse controls. Students should prioritize correct boundaries and observability over flashy features.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: WebSockets and Real-Time Security",
					content:
						"Keep a running security notebook for websockets and real-time security that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about how the connection is authenticated, which events are allowed, and when the service should throttle or disconnect. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC5-Secure-Real-Time-Notifier/solution"
				},
				{
					title: "Unit 10: WebSockets and Real Time Security supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: WebSockets and Real-Time Security. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-21-unit-10-websockets-and-real-time-security-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-21-unit-10-websockets-and-real-time-security-supple/solution"
				},
				{
					title: "Unit 10: WebSockets and Real Time Security supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: WebSockets and Real-Time Security. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-22-unit-10-websockets-and-real-time-security-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-22-unit-10-websockets-and-real-time-security-supple/solution"
				}
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
				},
				{
					title: "Unit 11: Deployment Security Basics: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Deployment Security Basics",
					content:
						"Keep a running security notebook for deployment security basics that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about what secrets exist, where TLS terminates, what is publicly exposed, and what evidence confirms the deployment state. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-08-unit-11-deployment-security-basics/solution"
				},
				{
					title: "Unit 11: Deployment Security Basics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Deployment Security Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-23-unit-11-deployment-security-basics-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-23-unit-11-deployment-security-basics-supplemental-/solution"
				},
				{
					title: "Unit 11: Deployment Security Basics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Deployment Security Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-24-unit-11-deployment-security-basics-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-24-unit-11-deployment-security-basics-supplemental-/solution"
				}
			]
		},
		{
			title: "Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
			curriculum: [
				{
					title: "Rules of Engagement and Safe Penetration-Test Scope",
					content:
						"Teach penetration testing as an authorized defensive activity with explicit scope, approval, timing, and stop conditions. Students should only test local labs, staging systems, or environments they own or have written permission to assess, and they should learn to define what counts as in-bounds before any probing begins."
				},
				{
					title: "Build a Repeatable Defensive Test Plan",
					content:
						"Convert the threat model into a concrete local test plan: authentication checks, authorization bypass attempts, malformed requests, request tampering, body-size limits, rate-limit behavior, proxy exposure, and log visibility. The emphasis should be on repeatable evidence gathering and safe rollback, not on flashy one-off tricks."
				},
				{
					title: "Use AI to Draft Checks, Payload Variants, and Review Notes",
					content:
						"Teach AI as a constrained assistant for defensive work: drafting test matrices, generating benign local payload variations, summarizing logs, suggesting follow-up checks, and helping write clearer triage or disclosure notes. Students should also learn the hard boundaries: never use AI as the final authority, never ask it to target unauthorized systems, never trust its security claims without local verification, and never let it replace a written scope or evidence trail."
				},
				{
					title: "Ethics and Responsible Disclosure for Network Findings",
					content:
						"Teach responsible disclosure as part of the engineering workflow: reproduce privately, minimize impact, document the vulnerable path, include evidence and reproduction notes, propose practical mitigations, and communicate within the agreed reporting channel. The goal is to normalize calm, precise handoff to maintainers instead of vague or harmful reporting behavior."
				},
				{
					title: "Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assist/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assist/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure",
					content:
						"Keep a running security notebook for authorized penetration testing, ai-assisted workflow, and disclosure that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about written scope, permitted checks, how AI was used, and what evidence supports the final report. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assist/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-09-unit-12-authorized-penetration-testing-ai-assist/solution"
				},
				{
					title: "Unit 12: Authorized Penetration Testing, AI Assisted Workflow, and Disclosure supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-25-unit-12-authorized-penetration-testing-ai-assist/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-25-unit-12-authorized-penetration-testing-ai-assist/solution"
				},
				{
					title: "Unit 12: Authorized Penetration Testing, AI Assisted Workflow, and Disclosure supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Authorized Penetration Testing, AI-Assisted Workflow, and Disclosure. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-26-unit-12-authorized-penetration-testing-ai-assist/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-26-unit-12-authorized-penetration-testing-ai-assist/solution"
				}
			]
		},
		{
			title: "Unit 13: Capstone",
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
					title: "Audit the Service with an Authorized Test Playbook",
					content:
						"Run a post-build audit that checks binding scope, proxy behavior, TLS placement, failure handling, abuse visibility, and the local penetration-test cases defined in the course playbook. Students may use AI to help organize the checklist or summarize results, but every claim in the final audit must still be backed by direct local evidence."
				},
				{
					title: "Write the Incident, Disclosure, and Recovery Notes",
					content:
						"Finish with a brief incident-response and disclosure packet that explains how suspicious requests would be investigated, which findings should stay private until fixed, which logs would be consulted first, and what immediate containment or recovery steps the operator would take."
				},
				{
					title: "Unit 13: Capstone: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Capstone",
					content:
						"Keep a running security notebook for capstone that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about the full threat model, the defensive controls implemented, and the remaining risks after audit. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-10-unit-13-capstone/solution"
				},
				{
					title: "Unit 13: Capstone supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 13: Capstone. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-27-unit-13-capstone-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-27-unit-13-capstone-supplemental-2/solution"
				},
				{
					title: "Unit 13: Capstone supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 13: Capstone. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-28-unit-13-capstone-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-28-unit-13-capstone-supplemental-3/solution"
				}
			]
		},
		{
			title: "NSEC14 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "DNS and Email Security Follow-Up",
					content:
						"Extend the course with DNS security, resolver trust, email authentication, and delivery-surface protection once students can already reason about the core service boundary. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "OAuth and Session Security",
					content:
						"Add a deeper identity module on session lifecycle, delegated auth, token scopes, and callback-boundary handling after the HTTP and authz foundations are stable. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "WAF, CDN, and Edge Controls",
					content:
						"Introduce WAF concepts, CDN caching risks, rate-limit policy at the edge, and request filtering as a follow-on to the reverse-proxy and logging units. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Cloud Network Security Path",
					content:
						"Build a follow-up course around VPCs, security groups, subnets, private services, and public edge design so students can move from host-level hardening into cloud network architecture. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "NSEC14 Expansion Ideas and Next Steps: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Security Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a running security notebook for expansion ideas and next steps that records one packet or service diagram, the commands or traces inspected, the trust boundary being discussed, and one concise conclusion about which next layer of security work builds most naturally from the current course. The habit should be evidence first, assumptions second.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-11-nsec14-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to NSEC14 Expansion Ideas and Next Steps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-29-nsec14-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-29-nsec14-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to NSEC14 Expansion Ideas and Next Steps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-30-nsec14-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-30-nsec14-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: network security lab 16",
			curriculum: [
				{
					title: "network security lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: network security lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "network security lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: network security lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "network security lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: network security lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/solution"
				},
				{
					title: "network security lab 16: Review and Reflection",
					content:
						"Close Applied Studio 16: network security lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "network security lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: network security lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-01-network-security-lab-16/solution"
				},
				{
					title: "Applied Studio 16: network security lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: network security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-31-applied-studio-16-network-security-lab-16-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-31-applied-studio-16-network-security-lab-16-supple/solution"
				},
				{
					title: "Applied Studio 16: network security lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: network security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-32-applied-studio-16-network-security-lab-16-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-32-applied-studio-16-network-security-lab-16-supple/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: network security lab 17",
			curriculum: [
				{
					title: "network security lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: network security lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "network security lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: network security lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "network security lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: network security lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/solution"
				},
				{
					title: "network security lab 17: Review and Reflection",
					content:
						"Close Applied Studio 17: network security lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "network security lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: network security lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-02-network-security-lab-17/solution"
				},
				{
					title: "Applied Studio 17: network security lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: network security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-33-applied-studio-17-network-security-lab-17-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-33-applied-studio-17-network-security-lab-17-supple/solution"
				},
				{
					title: "Applied Studio 17: network security lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: network security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-34-applied-studio-17-network-security-lab-17-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Security/tree/main/NSEC-34-applied-studio-17-network-security-lab-17-supple/solution"
				}
			]
		}
	]
};
