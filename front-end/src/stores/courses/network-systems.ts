import type { RawCourse, RawCourseModuleItem } from "./types";

const NETWORK_SYSTEMS_REPO =
	"https://github.com/instruction-material/Network-Systems/tree/main";

function starterRepoLink(projectId: string) {
	return `${NETWORK_SYSTEMS_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${NETWORK_SYSTEMS_REPO}/${projectId}/solution`;
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

function operationsNotebook(
	unitTitle: string,
	focus: string
): RawCourseModuleItem {
	return {
		title: `Operations Notebook: ${unitTitle}`,
		content: `Keep a short operations notebook for ${unitTitle.toLowerCase()} that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on ${focus} so students learn to explain network state from observation rather than from guesses.`
	};
}

function failureSignature(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Failure Signature Drill: ${title}`,
		content: `Start the lesson with one short failure case and ask students to classify it before they change anything. ${prompt}`
	};
}

function toolDrill(commandName: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Tool Drill: ${commandName}`,
		content: `Start the lesson by running ${commandName} and asking students what evidence it should provide and what it cannot prove on its own. ${prompt}`
	};
}

export const networkSystemsCourse: RawCourse = {
	name: "Network Systems",
	modules: [
		{
			title: "NS0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDE and Real Linux Environment",
					content:
						"Standardize on `VS Code` and make the real requirement a usable Linux shell rather than the editor itself. This course is command-line and lab oriented, so students should expect to run diagnostics and configuration changes on a Linux VM, remote server, WSL instance, or disposable cloud host rather than only from a local desktop shell."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install VS Code, add the `code` command to PATH, and plan to run labs against a Linux VM, Docker-based lab, or remote host. On Windows, install WSL2 plus Ubuntu, keep the workspace inside the Linux filesystem, and verify that commands are running in Linux before starting route, firewall, or packet-capture labs."
				},
				{
					title: "Core Tooling and Remote Access",
					content:
						"Verify `ssh`, `curl`, `dig`, and `traceroute` early, then add `Remote - SSH`, `Remote - WSL`, `Docker`, `YAML`, and `EditorConfig` support as needed. The course should normalize the idea that diagnostics, packet capture, firewall editing, and routing changes often happen over a remote shell instead of a local GUI."
				},
				{
					title: "Positioning, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `Linux Systems` and frame it as the layer that explains how services on one host become reachable, unreachable, slow, or misrouted from somewhere else. Students should already be comfortable editing config files and running Linux diagnostics before the course asks them to reason about ports, sockets, routing, DNS, firewalls, and IPv6 behavior."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"Setup and Tooling",
					"remote access method, Linux lab environment, and the first verified command set"
				),
				toolDrill(
					"ssh",
					"Ask students what a successful SSH connection proves about network reachability, authentication, and listening services, and what it still does not prove about every other port on the host."
				)
			]
		},
		{
			title: "Unit 1: The Network Stack in Plain English",
			curriculum: [
				{
					title: "Interfaces, Frames, Packets, Sockets, and Ports",
					content:
						"Teach the vocabulary in concrete layers: interfaces attach a host to a network, frames move locally, packets move end to end, sockets bind applications to the stack, and ports distinguish services on one host. Students should be able to explain these as related but different objects instead of using them interchangeably."
				},
				{
					title: "TCP versus UDP",
					content:
						"Compare TCP and UDP in terms of connection behavior, retransmission expectations, and where reliability lives. The course should keep this practical: students need to understand why an application chose one or the other and what that choice changes about debugging."
				},
				{
					title: "Client and Server Flow",
					content:
						"Walk through a simple client/server exchange from local process to local socket, out through the interface, across the network, and back to a listening service on the destination host. The point is to make later diagnostics feel like checking a known path rather than memorizing unrelated commands."
				},
				{
					title: "One Request, Many Layers",
					content:
						"Have students narrate one HTTP or SSH request from application intent down through addressing and transport and then back up on the receiving side. This gives the course a stable mental model to revisit in DNS, routing, and firewall units."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"The Network Stack in Plain English",
					"the path from one client request to one server response"
				),
				failureSignature(
					"Local App Works but Remote Client Cannot Reach It",
					"Ask students which layer they would inspect first: application process, listening socket, host firewall, route, or name resolution, and require them to justify that ordering."
				)
			]
		},
		{
			title: "Unit 2: Addresses and Naming",
			curriculum: [
				{
					title: "MAC, IPv4, and IPv6 Addresses",
					content:
						"Teach MAC addresses as local-link identifiers, IPv4 and IPv6 addresses as network-layer identities, and hostnames as human-facing labels that must be resolved. Students should understand that a hostname is not the same thing as the destination address ultimately used on the wire."
				},
				{
					title: "Public versus Private Addressing",
					content:
						"Use private IPv4 ranges and public internet addresses to explain why many devices can talk locally without being directly reachable from outside. The course should connect this to NAT and to the difference between a home network and a public server."
				},
				{
					title: "IPv6 Address Categories in Practice",
					content:
						"Introduce loopback, link-local, and global unicast addresses as practical address families students will actually see in diagnostics. This helps prevent the common confusion where students think every IPv6 address is globally routed in the same way."
				},
				{
					title: "DNS Names versus Actual Endpoints",
					content:
						"Treat DNS as a naming system that maps labels to records, not as the same thing as routing or transport. A student should be able to explain how the same hostname may resolve to multiple records and why resolution success does not automatically prove port reachability."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"Addresses and Naming",
					"how one hostname, one interface, and one observed IP address relate without meaning the same thing"
				),
				failureSignature(
					"Wrong Address Family",
					"Ask students what changes when a client prefers IPv6 but the service only works over IPv4, and how they would prove which family is failing."
				)
			]
		},
		{
			title: "Unit 3: Switches, Routers, NAT, and the Internet Edge",
			curriculum: [
				{
					title: "Local Subnets and Default Gateways",
					content:
						"Teach local subnet behavior as the boundary between destinations a host can reach directly and destinations that must go through a router. Students should understand that the default gateway is not a magic internet button; it is simply the next hop for traffic that leaves the local segment."
				},
				{
					title: "How Routers Forward Traffic",
					content:
						"Use a simple multi-hop diagram to explain route lookup, next-hop forwarding, and the fact that each router only needs to know the next step rather than the full end-to-end path. This makes tools like `traceroute` and `mtr` more intuitive later."
				},
				{
					title: "NAT and Port Forwarding",
					content:
						"Explain NAT as address translation at the internet edge and pair it with port forwarding so students can see why inbound reachability on a home network is different from running a service on a public server. This is where they should learn why local success does not automatically imply outside reachability."
				},
				{
					title: "Why Home Networks Differ from Public Servers",
					content:
						"Contrast a private LAN behind NAT with a public host that owns its own public address and firewall policy. The course should use this contrast repeatedly so students stop assuming that every deployment path behaves like a cloud VM or like a home router."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"Switches, Routers, NAT, and the Internet Edge",
					"default gateways, local-subnet boundaries, and which hop is doing translation"
				),
				failureSignature(
					"Service Works on the LAN but Not from Outside",
					"Require students to separate likely causes into router edge problems, host firewall problems, and service-listening problems before they run any commands."
				)
			]
		},
		{
			title: "Unit 4: Ports and Listening Services",
			curriculum: [
				{
					title: "What a Port Actually Identifies",
					content:
						"Teach a port as one part of a socket endpoint, not as a stand-alone service identity. Students should understand that a process, protocol, local address, and port together define what is actually listening or connected."
				},
				{
					title: "Ephemeral Ports and Client-Side Source Ports",
					content:
						"Explain ephemeral ports so students stop assuming the client side of every connection always uses the same number. This is especially important when they read `ss` output or packet captures and need to separate server ports from temporary client ports."
				},
				{
					title: "Using ss, netstat, and lsof to Map Services",
					content:
						"Use `ss`, `netstat`, and `lsof -i` to map listening sockets and established connections back to processes. The goal is to make port-to-process mapping a routine diagnostic habit, not a one-time command memorization exercise."
				},
				projectItem(
					"Project: Map All Listening Services on a Linux Host",
					"Use the listening-services lab to inventory TCP and UDP listeners, tie them back to processes, and classify which ports are expected, internal, or suspicious. Students should produce a short service map that makes the host's network surface visible instead of assuming they know what is exposed.",
					"NS1-Listening-Services-Map"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Ports and Listening Services",
					"how local address, protocol, port, and process identity fit together in one socket listing"
				),
				toolDrill(
					"ss -tulpn",
					"Ask students which lines represent listeners, which represent active connections, and what extra evidence they still need before claiming a service is reachable from another machine."
				)
			]
		},
		{
			title: "Unit 5: DNS and Name Resolution",
			curriculum: [
				{
					title: "Recursive and Authoritative Resolution",
					content:
						"Teach the difference between recursive resolvers and authoritative servers so students understand who is answering a question and who is forwarding it. This matters when a hostname resolves differently from different locations or after a change has only partially propagated."
				},
				{
					title: "Caching and Resolver State",
					content:
						"Use caching to explain why DNS changes can appear inconsistent during deployment or troubleshooting. Students should understand that cached success, cached failure, and local override files all shape what a resolver returns."
				},
				{
					title: "dig, nslookup, host, and Resolver Configuration",
					content:
						"Use `dig`, `nslookup`, `host`, `/etc/hosts`, and resolver config files to make name resolution visible. The course should keep asking which tool is showing recursive answers, which tool is showing raw records, and what local overrides might still be in play."
				},
				projectItem(
					"Project: Compare IPv4 and IPv6 Resolution for the Same Hostname",
					"Use the resolution-comparison lab to inspect A and AAAA answers, compare resolver outputs, and explain which address family a client is likely to try first. The goal is to make dual-stack resolution behavior concrete instead of leaving it as background theory.",
					"NS4-IPv4-vs-IPv6-Resolution-Comparison"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"DNS and Name Resolution",
					"record types, resolver path, caching state, and local override behavior"
				),
				failureSignature(
					"Bad DNS versus Good DNS but Bad Service",
					"Give students one case where a hostname fails to resolve and one where it resolves cleanly but the service still times out, and require them to distinguish the layers immediately."
				)
			]
		},
		{
			title: "Unit 6: Core Diagnostics",
			curriculum: [
				{
					title: "ping, traceroute, tracepath, and mtr",
					content:
						"Teach the core path tools as different ways of answering different questions: basic reachability, approximate hop path, path MTU hints, and repeated latency observation. Students should stop treating them as interchangeable and instead ask what evidence each one is actually collecting."
				},
				{
					title: "curl, nc, and telnet for Service Checks",
					content:
						"Use `curl`, `nc`, and `telnet` as quick ways to ask whether a TCP service answers, whether the right banner or headers appear, and whether the failure looks like refusal, timeout, or reset. The important habit is to match the tool to the protocol and the question."
				},
				{
					title: "Timeout versus Refusal versus Reset",
					content:
						"Repeat the failure signatures until students can classify them by default: timeout usually means a packet is not getting through or not coming back, refusal usually means the host is reachable but nothing is listening, and reset usually means a TCP conversation was actively torn down. They should still verify, but this classification should become instinctive."
				},
				projectItem(
					"Project: Diagnose Why a Service Is Reachable Locally but Not from Another Machine",
					"Use the reachability lab to compare localhost success, same-subnet failure, and outside failure cases against service state, route state, and firewall state. Students should write down the failure signature before they edit anything so the later fix has real diagnostic context.",
					"NS2-Local-vs-Remote-Reachability-Diagnosis"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Core Diagnostics",
					"which command answered which question and what the failure signature implied"
				),
				failureSignature(
					"Timeout, Refusal, Reset",
					"Present three short command outputs and require students to classify each one and name the next best confirming command."
				)
			]
		},
		{
			title: "Unit 7: Linux Interface and Route Management",
			curriculum: [
				{
					title: "ip addr, ip link, and Interface State",
					content:
						"Use `ip addr` and `ip link` to make interface state visible: addresses, link state, and whether an interface is even up. Students should understand that no amount of higher-level diagnostics matters if the interface itself is down or misaddressed."
				},
				{
					title: "ip route and Static versus Dynamic Paths",
					content:
						"Teach `ip route` as the host's own forwarding decision table. Students should understand default routes, directly connected networks, and the difference between routes learned automatically and routes set deliberately for a lab or override."
				},
				{
					title: "ARP, Neighbor Discovery, and ip neigh",
					content:
						"Use `ip neigh` to connect route choice back to link-layer neighbor resolution. The point is to show that once a host chooses the next hop, it still needs a local-link mapping before traffic can leave on the wire."
				},
				projectItem(
					"Project: Simulate a Router and NAT Lab in a Disposable Linux Topology",
					"Use the NAT-topology lab to create a small routed environment with isolated segments, a forwarding node, and explicit edge behavior. The lab should make next-hop logic, interface state, route tables, and selective exposure visible instead of abstract.",
					"NS6-Router-NAT-Topology-Lab"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Linux Interface and Route Management",
					"interface state, next-hop choice, and how a route becomes an actual neighbor-level destination"
				),
				toolDrill(
					"ip route",
					"Ask students which route a host will choose for one destination inside the local subnet and one destination on the public internet before they test either path."
				)
			]
		},
		{
			title: "Unit 8: IPv6 in Practice",
			curriculum: [
				{
					title: "Global Unicast, Link-Local, and Loopback",
					content:
						"Teach the practical IPv6 address categories students will actually see in diagnostics and firewall policies. The course should keep returning to the fact that link-local addresses have strictly local meaning even though they look like 'real' IPv6 addresses."
				},
				{
					title: "SLAAC and DHCPv6 at a Conceptual Level",
					content:
						"Introduce SLAAC and DHCPv6 as two different ways a host may learn usable IPv6 configuration. Students do not need every standard detail; they need to understand why one network auto-configures differently from another and which clues show up in host diagnostics."
				},
				{
					title: "Dual-Stack Behavior",
					content:
						"Use dual-stack examples to explain why a hostname may resolve to both A and AAAA records and why the chosen family changes which path, firewall rules, and failure modes matter. This should feel like a real operational issue rather than a theoretical appendix."
				},
				{
					title: "Common IPv6 Admin Mistakes",
					content:
						"Highlight the mistakes that repeatedly confuse students and operators: forgetting link-local scope, validating only IPv4 reachability, or assuming that an IPv4 firewall policy automatically covers IPv6. These are the habits that create subtle deployment gaps."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"IPv6 in Practice",
					"address family selection, scope behavior, and which rule sets apply to which traffic"
				),
				failureSignature(
					"IPv4 Works but IPv6 Fails",
					"Ask students whether they would inspect resolution order, interface addressing, service binding, or firewall policy first, and require them to justify the first branch in that diagnostic tree."
				)
			]
		},
		{
			title: "Unit 9: Firewalls and Host Policy",
			curriculum: [
				{
					title: "UFW Basics",
					content:
						"Teach UFW as a safe, readable host-policy layer rather than as a wall of raw packet filter rules. Students should understand allow, deny, limit, delete, and numbered rules before they try to expose a service deliberately."
				},
				{
					title: "Application Profiles, Logging, and Safe Rollout",
					content:
						"Use application profiles, logging, and staged rule rollout to teach firewall changes as operational changes with recovery plans. The course should normalize allowing SSH first, documenting the intended exposure, and verifying rules from another session before assuming the host is still reachable."
				},
				{
					title: "UFW versus iptables and nftables",
					content:
						"Explain UFW as a policy layer over lower-level packet filtering instead of treating it as a completely separate system. This helps students understand what they are abstracting away without forcing them into raw packet-filter syntax too early."
				},
				projectItem(
					"Project: Build and Verify a UFW Policy for a Web Server",
					"Use the UFW lab to allow only the intended service surface, keep remote administration safe, and verify the result from another host. Students should write down which ports are intentionally reachable, which are not, and how they proved both claims.",
					"NS3-UFW-Web-Server-Policy"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Firewalls and Host Policy",
					"numbered rules, safe rollout order, and which evidence proves a rule change really took effect"
				),
				toolDrill(
					"ufw status numbered",
					"Ask students which rules govern SSH access, which rules govern the public service, and what test they would run from a second host to verify both."
				)
			]
		},
		{
			title: "Unit 10: Packet Capture and Deep Inspection",
			curriculum: [
				{
					title: "tcpdump and Beginner-Friendly Packet Anatomy",
					content:
						"Teach `tcpdump` as the first deep-inspection tool students reach for when ports, routes, and DNS no longer explain the failure alone. They do not need to decode every bit of every header; they need to identify source, destination, protocol, ports, and the broad shape of the exchange."
				},
				{
					title: "Safe Filter Expressions",
					content:
						"Use small, safe filter expressions such as host, port, and protocol filters so captures stay focused and readable. Students should learn that the capture filter is part of the diagnostic design, not just an optimization for large networks."
				},
				{
					title: "Host Capture versus Router Capture",
					content:
						"Teach capture placement as a question in its own right. Capturing on the host answers whether the host sent or received packets at all; capturing on a router or edge device answers whether the path is dropping or rewriting traffic before it reaches the service."
				},
				projectItem(
					"Project: Capture and Analyze a Local HTTP Request with tcpdump",
					"Use the packet-capture lab to watch one HTTP request from client to server and back, then identify the source port, destination port, and the packets that represent the response. The point is to make one full request visible in the capture rather than collecting noise.",
					"NS5-Tcpdump-HTTP-Capture"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Packet Capture and Deep Inspection",
					"capture placement, filter choice, and which packets confirmed the hypothesis"
				),
				toolDrill(
					"tcpdump -nn",
					"Ask students why disabling name resolution helps when the point of the capture is raw packet evidence rather than convenience output."
				)
			]
		},
		{
			title: "Unit 11: Common Application Protocols",
			curriculum: [
				{
					title: "HTTP and HTTPS",
					content:
						"Use HTTP and HTTPS to connect protocol behavior back to ports, hostnames, and TLS. Students should know what remains visible before encryption, what becomes opaque after TLS, and why HTTPS diagnostics often require both packet-level and application-level thinking."
				},
				{
					title: "SSH as a Diagnostic and Administrative Protocol",
					content:
						"Treat SSH as both an application protocol and an operational dependency. If SSH works while the public app does not, that contrast becomes a powerful clue about listening services, firewall rules, routing, and reverse proxy layers."
				},
				{
					title: "SMTP and DNS as Support Protocols",
					content:
						"Use SMTP and DNS to show that not every important network protocol looks like interactive browsing. Students should be able to explain how name resolution and mail transport still depend on the same reachability, port, and policy concepts as the rest of the course."
				},
				{
					title: "How TLS Changes Visibility",
					content:
						"Explain that TLS protects application payload visibility but does not make the existence of the connection itself invisible. Students should understand which layers still reveal addresses, ports, and timing and which layers become opaque after encryption begins."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"Common Application Protocols",
					"which parts of the exchange were visible at the transport layer and which parts moved behind TLS"
				),
				failureSignature(
					"HTTP Works but HTTPS Fails",
					"Ask students whether they would inspect certificate handling, reverse proxy config, host firewall policy, or DNS first, and require them to name the quickest differentiating test."
				)
			]
		},
		{
			title: "Unit 12: Secure Exposure of Services",
			curriculum: [
				{
					title: "Expose Only What Must Be Reachable",
					content:
						"Teach exposure as a deliberate design decision rather than a side effect of starting a service. Students should be able to name which ports are meant to be public, which ports are private, and how firewall or proxy layers enforce that boundary."
				},
				{
					title: "Reverse Proxy and Firewall Layering",
					content:
						"Use reverse proxies and firewall rules together to show how multiple layers can protect or simplify service exposure. This keeps the course aligned with modern deployment practice where the app process often is not the only public-facing network surface."
				},
				{
					title: "Safe Port Forwarding and External Validation",
					content:
						"Teach safe port forwarding as a last-mile exposure step that must be paired with limited scope and outside verification. Students should understand that validating from the same host is not enough once the question is whether another machine on another segment can really reach the service."
				},
				projectItem(
					"Project Pass: Validate the NAT and Exposure Topology from Outside",
					"Return to the router and NAT lab and treat it as the capstone exposure exercise: decide which service should be reachable, limit what is exposed, and verify the result from another network position. The project should tie together routing, firewalls, listening services, and diagnostics into one defensible path explanation.",
					"NS6-Router-NAT-Topology-Lab"
				)
			],
			supplementalProjects: [
				operationsNotebook(
					"Secure Exposure of Services",
					"what is intentionally public, what stays private, and which external test proved the boundary"
				),
				failureSignature(
					"Open Service, Wrong Layer Exposed",
					"Present a case where the app is reachable but an internal admin surface is also exposed, and ask students how the exposure happened and which layer should fix it first."
				)
			]
		},
		{
			title: "NS13 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "VPN and Tunneling Concepts",
					content:
						"Offer VPN and tunneling as the next step once students already understand interfaces, routes, and exposure boundaries. These topics make far more sense after learners can already explain how ordinary reachability works without the tunnel."
				},
				{
					title: "BGP and Internet Routing at a High Level",
					content:
						"Treat BGP and broader internet routing as an advanced appendix rather than a prerequisite. The useful outcome is seeing how route announcements and policy shape the public internet beyond the single-host route table students used in the core course."
				},
				{
					title: "Wireless and Home-Network Variations",
					content:
						"Add wireless networking and WPA or WPA2 basics as a follow-on topic that changes the link layer but still preserves much of the same routing, addressing, and service-diagnostic logic from the course."
				},
				{
					title: "Cloud Networking Patterns",
					content:
						"Use cloud networking patterns such as security groups, load balancers, and VPC boundaries as the natural next specialization for students headed toward deployment or infrastructure work. These ideas land better once host firewalls, ports, routes, and controlled exposure already feel concrete."
				}
			],
			supplementalProjects: [
				operationsNotebook(
					"Expansion Ideas and Next Steps",
					"which advanced networking path fits the student's goals and why"
				),
				toolDrill(
					"mtr",
					"Use it as a bridge into more advanced routing discussion by asking what repeated path instability or latency variation might suggest before anyone jumps to a single-layer explanation."
				)
			]
		}
	]
};
