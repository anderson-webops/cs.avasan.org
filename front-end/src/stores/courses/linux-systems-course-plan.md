# Linux Systems Course Plan

## Positioning

This course should teach Linux as an operating environment, an administration
surface, and a debugging platform. It should start from shell basics and end
with services, logs, automation, deployment patterns, and day-to-day systems
operations.

## Audience and Prerequisites

- Comfortable using a keyboard-driven workflow
- No Linux background required for the first modules
- Basic programming familiarity is helpful but not required

## Core Outcomes

- Navigate and understand the Linux filesystem with confidence
- Use the shell for file management, inspection, editing, and automation
- Manage processes, services, packages, users, permissions, and logs
- Understand `systemd`, `cron`, `journalctl`, `systemctl`, and `/tmp`
- Deploy and troubleshoot a simple web service with Nginx or Apache

## Recommended Structure

### Unit 1: Shell Foundations

- Terminal basics, history, pipes, redirection, exit codes
- `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, `cat`, `less`, `head`, `tail`
- `grep`, `find`, `rg`, `sort`, `uniq`, `wc`, `xargs`

### Unit 2: Filesystem Hierarchy and Directory Purpose

- `/`, `/home`, `/root`, `/etc`, `/var`, `/usr`, `/opt`, `/tmp`, `/srv`, `/dev`
- `/proc` and `/sys` as pseudo-filesystems
- When application state belongs in `/var` vs `/srv` vs `/opt`

### Unit 3: Users, Groups, and Permissions

- `chmod`, `chown`, `chgrp`, `umask`
- Read/write/execute and directory permission semantics
- `sudo`, user accounts, service accounts, and least privilege

### Unit 4: Editing and Configuration

- `nano`, `vim`, `sed`, `tee`
- Safe config editing patterns
- Environment files and service-specific configuration

### Unit 5: Processes and Job Control

- `ps`, `top`, `htop`, `kill`, `pkill`, `nice`, `nohup`
- Background jobs, foreground jobs, signals, zombies, orphans

### Unit 6: Services and systemd

- What a service is
- Unit files
- `systemctl status/start/stop/restart/reload/enable/disable`
- Dependencies, startup ordering, restarts, environment overrides

### Unit 7: Logging and Observability

- `journalctl`
- log rotation
- application logs vs system logs
- diagnosing boot failures and service crashes

### Unit 8: Scheduling and Automation

- `cron`, crontab syntax, environment gotchas
- `systemd` timers vs cron
- scheduled cleanup and backup tasks

### Unit 9: Package Management and Software Layout

- `apt`, `dnf`, `yum`, `brew` on Linux where relevant
- package vs source install vs tarball
- keeping systems patched

### Unit 10: Networking from a Systems View

- `ip`, `ss`, `ping`, `curl`, `dig`
- interface state, routes, DNS, listening services
- bridge into the networking course

### Unit 11: Web Servers

- Nginx fundamentals
- Apache fundamentals
- reverse proxy vs static file serving
- virtual hosts, server blocks, TLS, reload vs restart

### Unit 12: Storage, Backups, and Reliability

- disks, mounts, `df`, `du`, `mount`, `fstab`
- backup patterns
- log and tmp cleanup
- recovery workflow after a bad config change

## Example Project Outlines

- Provision a personal Linux lab VM
- Deploy a static site from `/srv`
- Run a small app behind Nginx
- Configure an Apache virtual host and compare it to Nginx
- Create a `systemd` service for a toy app
- Write a backup script and schedule it with cron and then with a timer

## Delivery Notes

- Start every lesson with a command of the day and a quick drill
- Use intentional break/fix exercises
- Provide a sandbox VM image for all learners
- Include a troubleshooting notebook for every major unit

## Expansion Ideas

- Add Docker and container runtime basics
- Add SELinux/AppArmor as an advanced security unit
- Add load balancing and reverse proxy patterns
- Add a dedicated unit on SSH and remote operations

