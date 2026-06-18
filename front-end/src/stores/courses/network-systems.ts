import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

export const networkSystemsCourse: RawCourse = {
	name: "Network Systems",
	modules: [
		{
			title: "NS0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDE and Real Linux Environment",
					content:
						"Standardize on `VS Code` and make the real requirement a usable Linux shell rather than the editor itself. This course is command-line and lab oriented, so plan to run diagnostics and configuration changes on a Linux VM, remote server, WSL instance, or disposable cloud host rather than only from a local desktop shell."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install VS Code, add the `code` command to PATH, and plan to run labs against a Linux VM, Docker-based lab, or remote host. On Windows, install WSL2 plus Ubuntu, keep the workspace inside the Linux filesystem, and verify that commands are running in Linux before starting route, firewall, or packet-capture labs."
				},
				{
					title: "Core Tooling and Remote Access",
					content:
						"Verify `ssh`, `curl`, `dig`, and `traceroute` early, then add `Remote - SSH`, `Remote - WSL`, `Docker`, `YAML`, and `EditorConfig` support as needed. Diagnostics, packet capture, firewall editing, and routing changes often happen over a remote shell instead of a local GUI."
				},
				{
					title: "Positioning, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `Linux Systems` and frame it as the layer that explains how services on one host become reachable, unreachable, slow, or misrouted from somewhere else. Already be comfortable editing config files and running Linux diagnostics before the course asks them to reason about ports, sockets, routing, DNS, firewalls, and IPv6 behavior."
				},
				{
					title: "NS0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Setup and Tooling",
					content:
						"Keep a short operations notebook for setup and tooling that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on remote access method, Linux lab environment, and the first verified command set so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-ns0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-ns0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-ns0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-ns0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: The Network Stack in Plain English",
			curriculum: [
				{
					title: "Interfaces, Frames, Packets, Sockets, and Ports",
					content:
						"This section covers the vocabulary in concrete layers: interfaces attach a host to a network, frames move locally, packets move end to end, sockets bind applications to the stack, and ports distinguish services on one host. Skill target: Explain these as related but different objects instead of using them interchangeably."
				},
				{
					title: "TCP versus UDP",
					content:
						"Compare TCP and UDP in terms of connection behavior, retransmission expectations, and where reliability lives. Keep the comparison practical: explain why an application chose one or the other and what that choice changes about debugging."
				},
				{
					title: "Client and Server Flow",
					content:
						"Trace a simple client/server exchange from local process to local socket, out through the interface, across the network, and back to a listening service on the destination host. The point is to make later diagnostics feel like checking a known path rather than memorizing unrelated commands."
				},
				{
					title: "One Request, Many Layers",
					content:
						"Narrate one HTTP or SSH request from application intent down through addressing and transport and then back up on the receiving side. This gives the course a stable mental model to revisit in DNS, routing, and firewall units."
				},
				{
					title: "Unit 1: The Network Stack in Plain English: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: The Network Stack in Plain English",
					content:
						"Keep a short operations notebook for the network stack in plain english that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on the path from one client request to one server response so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/solution"
				},
				{
					title: "Unit 1: The Network Stack in Plain English supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2/solution"
				},
				{
					title: "Unit 1: The Network Stack in Plain English supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Addresses and Naming",
			curriculum: [
				{
					title: "MAC, IPv4, and IPv6 Addresses",
					content:
						"This section covers MAC addresses as local-link identifiers, IPv4 and IPv6 addresses as network-layer identities, and hostnames as human-facing labels that must be resolved. Key idea: A hostname is not the same thing as the destination address ultimately used on the wire."
				},
				{
					title: "Public versus Private Addressing",
					content:
						"Private IPv4 ranges and public internet addresses explain why many devices can talk locally without being directly reachable from outside. This connects directly to NAT and to the difference between a home network and a public server."
				},
				{
					title: "IPv6 Address Categories in Practice",
					content:
						"Loopback, link-local, and global unicast addresses are practical address families that show up in diagnostics. This prevents the common confusion where every IPv6 address is assumed to be globally routed in the same way."
				},
				{
					title: "DNS Names versus Actual Endpoints",
					content:
						"DNS is a naming system that maps labels to records, not the same thing as routing or transport. The same hostname may resolve to multiple records, and resolution success does not automatically prove port reachability."
				},
				{
					title: "Unit 2: Addresses and Naming: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Addresses and Naming",
					content:
						"Keep a short operations notebook for addresses and naming that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on how one hostname, one interface, and one observed IP address relate without meaning the same thing so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/solution"
				},
				{
					title: "Unit 2: Addresses and Naming supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-2-addresses-and-naming-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-2-addresses-and-naming-supplemental-2/solution"
				},
				{
					title: "Unit 2: Addresses and Naming supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Switches, Routers, NAT, and the Internet Edge",
			curriculum: [
				{
					title: "Local Subnets and Default Gateways",
					content:
						"This section covers local subnet behavior as the boundary between destinations a host can reach directly and destinations that must go through a router. Key idea: The default gateway is not a magic internet button; it is simply the next hop for traffic that leaves the local segment."
				},
				{
					title: "How Routers Forward Traffic",
					content:
						"A simple multi-hop diagram can show route lookup, next-hop forwarding, and the fact that each router only needs to know the next step rather than the full end-to-end path. This makes tools like `traceroute` and `mtr` more intuitive later."
				},
				{
					title: "NAT and Port Forwarding",
					content:
						"Explain NAT as address translation at the internet edge and pair it with port forwarding to show why inbound reachability on a home network is different from running a service on a public server. This is where local success must be separated from outside reachability."
				},
				{
					title: "Why Home Networks Differ from Public Servers",
					content:
						"Contrast a private LAN behind NAT with a public host that owns its own public address and firewall policy. This contrast prevents assuming that every deployment path behaves like a cloud VM or like a home router."
				},
				{
					title: "Unit 3: Switches, Routers, NAT, and the Internet Edge: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Switches, Routers, NAT, and the Internet Edge",
					content:
						"Keep a short operations notebook for switches, routers, nat, and the internet edge that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on default gateways, local-subnet boundaries, and which hop is doing translation so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/solution"
				},
				{
					title: "Unit 3: Switches, Routers, NAT, and the Internet Edge supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2/solution"
				},
				{
					title: "Unit 3: Switches, Routers, NAT, and the Internet Edge supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Ports and Listening Services",
			curriculum: [
				{
					title: "What a Port Actually Identifies",
					content:
						"This section covers a port as one part of a socket endpoint, not as a stand-alone service identity. Key idea: A process, protocol, local address, and port together define what is actually listening or connected."
				},
				{
					title: "Ephemeral Ports and Client-Side Source Ports",
					content:
						"Explain ephemeral ports to avoid assuming the client side of every connection always uses the same number. This is especially important when reading `ss` output or packet captures and separating server ports from temporary client ports."
				},
				{
					title: "Using ss, netstat, and lsof to Map Services",
					content:
						"Use `ss`, `netstat`, and `lsof -i` to map listening sockets and established connections back to processes. The goal is to make port-to-process mapping a routine diagnostic habit, not a one-time command memorization exercise."
				},
				{
					title: "Project: Map All Listening Services on a Linux Host",
					content:
						"Use the listening-services lab to inventory TCP and UDP listeners, tie them back to processes, and classify which ports are expected, internal, or suspicious. Produce a short service map that makes the host's network surface visible instead of assuming they know what is exposed.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Ports and Listening Services",
					content:
						"Keep a short operations notebook for ports and listening services that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on how local address, protocol, port, and process identity fit together in one socket listing so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/solution"
				},
				{
					title: "Unit 4: Ports and Listening Services supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 4: Ports and Listening Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-4-ports-and-listening-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-4-ports-and-listening-services-supplemental-2/solution"
				},
				{
					title: "Unit 4: Ports and Listening Services supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 4: Ports and Listening Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-unit-4-ports-and-listening-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-unit-4-ports-and-listening-services-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: DNS and Name Resolution",
			curriculum: [
				{
					title: "Recursive and Authoritative Resolution",
					content:
						"This section covers the difference between recursive resolvers and authoritative servers: who is answering a question, and who is forwarding it. This matters when a hostname resolves differently from different locations or after a change has only partially propagated."
				},
				{
					title: "Caching and Resolver State",
					content:
						"Caching explains why DNS changes can appear inconsistent during deployment or troubleshooting. Key idea: Cached success, cached failure, and local override files all shape what a resolver returns."
				},
				{
					title: "dig, nslookup, host, and Resolver Configuration",
					content:
						"`dig`, `nslookup`, `host`, `/etc/hosts`, and resolver config files make name resolution visible. The key checks are which tool is showing recursive answers, which tool is showing raw records, and what local overrides might still be in play."
				},
				{
					title: "Project: Compare IPv4 and IPv6 Resolution for the Same Hostname",
					content:
						"Use the resolution-comparison lab to inspect A and AAAA answers, compare resolver outputs, and explain which address family a client is likely to try first. The goal is to make dual-stack resolution behavior concrete instead of leaving it as background theory.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: DNS and Name Resolution",
					content:
						"Keep a short operations notebook for dns and name resolution that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on record types, resolver path, caching state, and local override behavior so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/solution"
				},
				{
					title: "Unit 5: DNS and Name Resolution supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 5: DNS and Name Resolution",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-11-unit-5-dns-and-name-resolution-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-11-unit-5-dns-and-name-resolution-supplemental-2/solution"
				},
				{
					title: "Unit 5: DNS and Name Resolution supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 5: DNS and Name Resolution",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-12-unit-5-dns-and-name-resolution-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-12-unit-5-dns-and-name-resolution-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Core Diagnostics",
			curriculum: [
				{
					title: "ping, traceroute, tracepath, and mtr",
					content:
						"This section covers the core path tools as different ways of answering different questions: basic reachability, approximate hop path, path MTU hints, and repeated latency observation. Stop treating them as interchangeable and instead identify what evidence each one is actually collecting."
				},
				{
					title: "curl, nc, and telnet for Service Checks",
					content:
						"`curl`, `nc`, and `telnet` are quick tools for checking whether a TCP service answers, whether the right banner or headers appear, and whether the failure looks like refusal, timeout, or reset. The important habit is to match the tool to the protocol and the question."
				},
				{
					title: "Timeout versus Refusal versus Reset",
					content:
						"Repeat the failure signatures until they become quick to classify: timeout usually means a packet is not getting through or not coming back, refusal usually means the host is reachable but nothing is listening, and reset usually means a TCP conversation was actively torn down. Verification still matters, but this classification should become instinctive."
				},
				{
					title: "Project: Diagnose Why a Service Is Reachable Locally but Not from Another Machine",
					content:
						"Use the reachability lab to compare localhost success, same-subnet failure, and outside failure cases against service state, route state, and firewall state. Write down the failure signature before they edit anything so the later fix has real diagnostic context.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Core Diagnostics",
					content:
						"Keep a short operations notebook for core diagnostics that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which command answered which question and what the failure signature implied so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/solution"
				},
				{
					title: "Unit 6: Core Diagnostics supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 6: Core Diagnostics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-13-unit-6-core-diagnostics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-13-unit-6-core-diagnostics-supplemental-2/solution"
				},
				{
					title: "Unit 6: Core Diagnostics supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 6: Core Diagnostics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-14-unit-6-core-diagnostics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-14-unit-6-core-diagnostics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Linux Interface and Route Management",
			curriculum: [
				{
					title: "ip addr, ip link, and Interface State",
					content:
						"Use `ip addr` and `ip link` to make interface state visible: addresses, link state, and whether an interface is even up. Key idea: No amount of higher-level diagnostics matters if the interface itself is down or misaddressed."
				},
				{
					title: "ip route and Static versus Dynamic Paths",
					content:
						"This section covers `ip route` as the host's own forwarding decision table. Key idea: Default routes, directly connected networks, and the difference between routes learned automatically and routes set deliberately for a lab or override."
				},
				{
					title: "ARP, Neighbor Discovery, and ip neigh",
					content:
						"Use `ip neigh` to connect route choice back to link-layer neighbor resolution. The point is to show that once a host chooses the next hop, it still needs a local-link mapping before traffic can leave on the wire."
				},
				{
					title: "Project: Simulate a Router and NAT Lab in a Disposable Linux Topology",
					content:
						"Use the NAT-topology lab to create a small routed environment with isolated segments, a forwarding node, and explicit edge behavior. The lab should make next-hop logic, interface state, route tables, and selective exposure visible instead of abstract.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Linux Interface and Route Management",
					content:
						"Keep a short operations notebook for linux interface and route management that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on interface state, next-hop choice, and how a route becomes an actual neighbor-level destination so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				},
				{
					title: "Unit 7: Linux Interface and Route Management supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 7: Linux Interface and Route Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-15-unit-7-linux-interface-and-route-management-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-15-unit-7-linux-interface-and-route-management-supplemental-2/solution"
				},
				{
					title: "Unit 7: Linux Interface and Route Management supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 7: Linux Interface and Route Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-16-unit-7-linux-interface-and-route-management-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-16-unit-7-linux-interface-and-route-management-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: IPv6 in Practice",
			curriculum: [
				{
					title: "Global Unicast, Link-Local, and Loopback",
					content:
						"This section covers the practical IPv6 address categories that appear in diagnostics and firewall policies. Link-local addresses have strictly local meaning even though they look like 'real' IPv6 addresses."
				},
				{
					title: "SLAAC and DHCPv6 at a Conceptual Level",
					content:
						"SLAAC and DHCPv6 are two different ways a host may learn usable IPv6 configuration. The practical target is not every standard detail; it is understanding why one network auto-configures differently from another and which clues show up in host diagnostics."
				},
				{
					title: "Dual-Stack Behavior",
					content:
						"Dual-stack examples show why a hostname may resolve to both A and AAAA records and why the chosen family changes which path, firewall rules, and failure modes matter. This is a real operational issue rather than a theoretical appendix."
				},
				{
					title: "Common IPv6 Admin Mistakes",
					content:
						"Highlight the mistakes that repeatedly confuse students and operators: forgetting link-local scope, validating only IPv4 reachability, or assuming that an IPv4 firewall policy automatically covers IPv6. These are the habits that create subtle deployment gaps."
				},
				{
					title: "Unit 8: IPv6 in Practice: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: IPv6 in Practice",
					content:
						"Keep a short operations notebook for ipv6 in practice that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on address family selection, scope behavior, and which rule sets apply to which traffic so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/solution"
				},
				{
					title: "Unit 8: IPv6 in Practice supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-17-unit-8-ipv6-in-practice-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-17-unit-8-ipv6-in-practice-supplemental-2/solution"
				},
				{
					title: "Unit 8: IPv6 in Practice supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-18-unit-8-ipv6-in-practice-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-18-unit-8-ipv6-in-practice-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Firewalls and Host Policy",
			curriculum: [
				{
					title: "UFW Basics",
					content:
						"This section covers UFW as a safe, readable host-policy layer rather than as a wall of raw packet filter rules. Key idea: Allow, deny, limit, delete, and numbered rules before they try to expose a service deliberately."
				},
				{
					title: "Application Profiles, Logging, and Safe Rollout",
					content:
						"Application profiles, logging, and staged rule rollout treat firewall changes as operational changes with recovery plans. SSH access comes first, intended exposure is documented, and rules are verified from another session before assuming the host is still reachable."
				},
				{
					title: "UFW versus iptables and nftables",
					content:
						"Explain UFW as a policy layer over lower-level packet filtering instead of treating it as a completely separate system. The abstraction should be visible without forcing raw packet-filter syntax too early."
				},
				{
					title: "Project: Build and Verify a UFW Policy for a Web Server",
					content:
						"Use the UFW lab to allow only the intended service surface, keep remote administration safe, and verify the result from another host. Write down which ports are intentionally reachable, which are not, and how they proved both claims.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Firewalls and Host Policy",
					content:
						"Keep a short operations notebook for firewalls and host policy that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on numbered rules, safe rollout order, and which evidence proves a rule change really took effect so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/solution"
				},
				{
					title: "Unit 9: Firewalls and Host Policy supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 9: Firewalls and Host Policy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-19-unit-9-firewalls-and-host-policy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-19-unit-9-firewalls-and-host-policy-supplemental-2/solution"
				},
				{
					title: "Unit 9: Firewalls and Host Policy supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 9: Firewalls and Host Policy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-20-unit-9-firewalls-and-host-policy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-20-unit-9-firewalls-and-host-policy-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Packet Capture and Deep Inspection",
			curriculum: [
				{
					title: "tcpdump and Beginner-Friendly Packet Anatomy",
					content:
						"This section covers `tcpdump` as the first deep-inspection tool students reach for when ports, routes, and DNS no longer explain the failure alone. They do not need to decode every bit of every header; they need to identify source, destination, protocol, ports, and the broad shape of the exchange."
				},
				{
					title: "Safe Filter Expressions",
					content:
						"Use small, safe filter expressions such as host, port, and protocol filters so captures stay focused and readable. Learn that the capture filter is part of the diagnostic design, not just an optimization for large networks."
				},
				{
					title: "Host Capture versus Router Capture",
					content:
						"This section covers capture placement as a question in its own right. Capturing on the host answers whether the host sent or received packets at all; capturing on a router or edge device answers whether the path is dropping or rewriting traffic before it reaches the service."
				},
				{
					title: "Project: Capture and Analyze a Local HTTP Request with tcpdump",
					content:
						"Use the packet-capture lab to watch one HTTP request from client to server and back, then identify the source port, destination port, and the packets that represent the response. The point is to make one full request visible in the capture rather than collecting noise.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Packet Capture and Deep Inspection",
					content:
						"Keep a short operations notebook for packet capture and deep inspection that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on capture placement, filter choice, and which packets confirmed the hypothesis so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/solution"
				},
				{
					title: "Unit 10: Packet Capture and Deep Inspection supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 10: Packet Capture and Deep Inspection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2/solution"
				},
				{
					title: "Unit 10: Packet Capture and Deep Inspection supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 10: Packet Capture and Deep Inspection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Common Application Protocols",
			curriculum: [
				{
					title: "HTTP and HTTPS",
					content:
						"Use HTTP and HTTPS to connect protocol behavior back to ports, hostnames, and TLS. Key idea: What remains visible before encryption, what becomes opaque after TLS, and why HTTPS diagnostics often require both packet-level and application-level thinking."
				},
				{
					title: "SSH as a Diagnostic and Administrative Protocol",
					content:
						"Treat SSH as both an application protocol and an operational dependency. If SSH works while the public app does not, that contrast becomes a powerful clue about listening services, firewall rules, routing, and reverse proxy layers."
				},
				{
					title: "SMTP and DNS as Support Protocols",
					content:
						"SMTP and DNS show that not every important network protocol looks like interactive browsing. Skill target: connect name resolution and mail transport to the same reachability, port, and policy concepts as the rest of the course."
				},
				{
					title: "How TLS Changes Visibility",
					content:
						"TLS protects application payload visibility but does not make the existence of the connection itself invisible. Key idea: Which layers still reveal addresses, ports, and timing and which layers become opaque after encryption begins."
				},
				{
					title: "Unit 11: Common Application Protocols: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Common Application Protocols",
					content:
						"Keep a short operations notebook for common application protocols that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which parts of the exchange were visible at the transport layer and which parts moved behind TLS so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/solution"
				},
				{
					title: "Unit 11: Common Application Protocols supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-23-unit-11-common-application-protocols-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-23-unit-11-common-application-protocols-supplemental-2/solution"
				},
				{
					title: "Unit 11: Common Application Protocols supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-24-unit-11-common-application-protocols-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-24-unit-11-common-application-protocols-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Secure Exposure of Services",
			curriculum: [
				{
					title: "Expose Only What Must Be Reachable",
					content:
						"This section covers exposure as a deliberate design decision rather than a side effect of starting a service. Skill target: Name which ports are meant to be public, which ports are private, and how firewall or proxy layers enforce that boundary."
				},
				{
					title: "Reverse Proxy and Firewall Layering",
					content:
						"Use reverse proxies and firewall rules together to show how multiple layers can protect or simplify service exposure. This keeps the course aligned with modern deployment practice where the app process often is not the only public-facing network surface."
				},
				{
					title: "Safe Port Forwarding and External Validation",
					content:
						"This section covers safe port forwarding as a last-mile exposure step that must be paired with limited scope and outside verification. Key idea: Validating from the same host is not enough once the question is whether another machine on another segment can really reach the service."
				},
				{
					title: "Project Pass: Validate the NAT and Exposure Topology from Outside",
					content:
						"Return to the router and NAT lab and treat it as the capstone exposure exercise: decide which service should be reachable, limit what is exposed, and verify the result from another network position. The project should tie together routing, firewalls, listening services, and diagnostics into one defensible path explanation.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Secure Exposure of Services",
					content:
						"Keep a short operations notebook for secure exposure of services that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on what is intentionally public, what stays private, and which external test proved the boundary so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				},
				{
					title: "Unit 12: Secure Exposure of Services supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 12: Secure Exposure of Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-25-unit-12-secure-exposure-of-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-25-unit-12-secure-exposure-of-services-supplemental-2/solution"
				},
				{
					title: "Unit 12: Secure Exposure of Services supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 12: Secure Exposure of Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-26-unit-12-secure-exposure-of-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-26-unit-12-secure-exposure-of-services-supplemental-3/solution"
				}
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
				},
				{
					title: "NS13 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a short operations notebook for expansion ideas and next steps that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which advanced networking path fits the learning goals and why; the explanation should stay grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "Network Systems Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Network Systems Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Network Systems Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/solution"
				},
				{
					title: "Network Systems Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Network Systems Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/solution"
				},
				{
					title: "Network Systems Lab 15 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-29-applied-studio-15-network-systems-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-29-applied-studio-15-network-systems-lab-15-supplemental-2/solution"
				},
				{
					title: "Network Systems Lab 15 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-30-applied-studio-15-network-systems-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-30-applied-studio-15-network-systems-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Network Systems Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Network Systems Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Network Systems Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/solution"
				},
				{
					title: "Network Systems Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Network Systems Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/solution"
				},
				{
					title: "Network Systems Lab 16 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-31-applied-studio-16-network-systems-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-31-applied-studio-16-network-systems-lab-16-supplemental-2/solution"
				},
				{
					title: "Network Systems Lab 16 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-32-applied-studio-16-network-systems-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-32-applied-studio-16-network-systems-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Network Systems Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Network Systems Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Network Systems Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/solution"
				},
				{
					title: "Network Systems Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Network Systems Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/solution"
				},
				{
					title: "Network Systems Lab 17 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/solution"
				},
				{
					title: "Network Systems Lab 17 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
