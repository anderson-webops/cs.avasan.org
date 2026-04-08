# Network Systems Course Plan

## Setup and Tooling

Preferred IDE: `VS Code`. This course is command-line and lab oriented, so the
main requirement is a real Linux environment plus good terminal access.

Official links:

- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [VS Code WSL guide](https://code.visualstudio.com/docs/remote/wsl)

macOS walkthrough:

1. Install VS Code.
2. Add the `code` command to PATH from the Command Palette.
3. Plan to run networking labs against a Linux VM, remote server, or Docker-based environment rather than only the local Mac shell.
4. Install useful extensions: `Remote - SSH`, `Docker`, `YAML`, and `EditorConfig`.
5. Install common networking tools with your package manager as needed, then verify you can run `ssh`, `curl`, `dig`, and `traceroute`.

Windows walkthrough:

1. Install VS Code on the Windows side.
2. Install WSL2 and an Ubuntu distribution.
3. Install the `Remote - WSL` extension and keep the course workspace inside the Linux filesystem.
4. Add `Remote - SSH`, `Docker`, `YAML`, and `EditorConfig`.
5. Verify that terminals are launching in Linux and not PowerShell before starting port, route, and firewall labs.

Course-specific notes:

- Use a real Linux shell for `ip`, `ss`, `ufw`, `tcpdump`, and routing exercises.
- This course pairs naturally with a disposable VM or cloud instance so students can safely change firewall and network settings.

## Positioning

This course should build on the Linux systems course and explain how systems
communicate over local networks and the public internet. It should connect
commands, ports, sockets, routing, firewalls, and diagnostics into one mental
model.

## Audience and Prerequisites

- Completed `Linux Systems` or equivalent command-line experience
- Comfortable editing config files and running diagnostics from the shell

## Core Outcomes

- Explain what ports are and how they map to processes and services
- Understand routing from a local host through a router to outside networks
- Diagnose DNS, latency, firewall, and path problems
- Use Linux networking tools with confidence
- Configure UFW safely and reason about IPv4 and IPv6 behavior

## Recommended Structure

### Unit 1: The Network Stack in Plain English

- What a network interface is
- Packets, frames, sockets, ports
- TCP vs UDP
- Client/server flow

### Unit 2: Addresses and Naming

- MAC addresses
- IPv4 addresses
- IPv6 addresses
- DNS names vs IPs
- public vs private addressing

### Unit 3: Switches, Routers, NAT, and the Internet Edge

- Local subnet behavior
- default gateways
- how a router forwards traffic
- NAT and port forwarding
- why home networks differ from public servers

### Unit 4: Ports and Listening Services

- What a port really identifies
- ephemeral ports
- `ss`, `netstat`, `lsof -i`
- mapping ports to processes

### Unit 5: DNS and Name Resolution

- Recursive resolvers
- authoritative servers
- DNS caching
- `dig`, `nslookup`, `host`, `/etc/hosts`, resolver config

### Unit 6: Core Diagnostics

- `ping`, `traceroute`, `tracepath`, `mtr`
- `curl`, `nc`, `telnet` for connectivity checks
- interpreting timeout vs refusal vs reset

### Unit 7: Linux Interface and Route Management

- `ip addr`, `ip route`, `ip link`
- static vs dynamic routes
- interface states
- ARP and neighbor discovery with `ip neigh`

### Unit 8: IPv6 in Practice

- global unicast, link-local, loopback
- SLAAC and DHCPv6 at a conceptual level
- dual-stack behavior
- common admin mistakes

### Unit 9: Firewalls and Host Policy

- UFW basics
- allow, deny, limit, delete, numbered rules
- application profiles
- logging and safe rollout patterns
- relationship to `iptables` and `nftables`

### Unit 10: Packet Capture and Deep Inspection

- `tcpdump`
- packet anatomy at a beginner-friendly level
- safe filter expressions
- when to capture on host vs on router

### Unit 11: Common Application Protocols

- HTTP/HTTPS
- SSH
- SMTP
- DNS
- how TLS changes visibility

### Unit 12: Secure Exposure of Services

- exposing only what must be reachable
- reverse proxy and firewall layering
- safe port forwarding
- validating a deployment from outside

## Example Project Outlines

- Map all listening services on a Linux host
- Diagnose why a service is reachable locally but not from another machine
- Build a UFW policy for a web server and verify it
- Compare IPv4 and IPv6 resolution for the same hostname
- Capture and analyze a local HTTP request with `tcpdump`
- Simulate a router/NAT lab in a VM setup

## Delivery Notes

- Every module should include a diagram and a command lab
- Use failure signatures repeatedly: timeout, refusal, reset, bad DNS, wrong route
- Keep a running glossary of ports, protocols, and layers

## Expansion Ideas

- Add VPN and tunneling concepts
- Add BGP and internet routing as an advanced appendix
- Add wireless networking and WPA/WPA2 basics
- Add cloud networking patterns: security groups, load balancers, and VPCs
