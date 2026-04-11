import type { RawCourse } from "./types";

export const linuxSystemsCourse: RawCourse = {
	name: "Linux Systems",
	modules: [
		{
			title: "LS0 Setup and Tooling",
			curriculum: [
				{
					title: "Why the Linux Environment Is the Real Classroom",
					content:
						"Position the course as an operating-systems and administration class, not just a list of shell commands. Students should treat the Linux environment as the place where files live, services run, logs accumulate, and debugging happens, with VS Code or another editor acting only as a careful companion to terminal work."
				},
				{
					title: "Recommended Tooling on macOS",
					content:
						"Walk macOS learners through installing VS Code, enabling the `code` command, and preparing to work against a Linux VM, a hosted Linux box, or a remote machine over SSH. Stress that the goal is not to make macOS pretend to be Linux, but to make it easy to reach a real Linux environment and edit configuration files safely."
				},
				{
					title: "Recommended Tooling on Windows with WSL2",
					content:
						"Show Windows learners how to install WSL2 with Ubuntu, connect through the `Remote - WSL` extension, and confirm that new terminals are actually opening inside Linux rather than PowerShell. This early verification matters because the rest of the course assumes that package management, paths, permissions, and process tools are being exercised in Linux itself."
				},
				{
					title: "Course Outcomes and Daily Operating Habits",
					content:
						"Set the expectation that students will finish the course able to navigate the filesystem confidently, inspect and edit configs, manage services and logs, automate routine work, and deploy a small web service. Every lesson should begin with a command-of-the-day drill and should end with a short note about what changed on the system, what was verified, and how to undo the change safely."
				},
				{
					title: "Project: Provision a Personal Linux Lab VM",
					content:
						"Use the personal lab starter to verify the active user, shell, kernel, package manager, and core commands needed for the course. The goal is to build a known-good Linux workspace before any later unit depends on paths, service management, or package installation working correctly.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Setup and Tooling",
					content:
						"Keep a running notebook for setup and tooling that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on environment identity, path problems, remote access, and shell confusion so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LS0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-ls0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-ls0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LS0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-ls0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-ls0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Shell Foundations",
			curriculum: [
				{
					title: "Terminal Basics, History, Pipes, Redirection, and Exit Codes",
					content:
						"Introduce the shell as a command runner that connects small tools together. Students should learn how command history reduces repeated typing, how pipes move output from one tool into another, how redirection captures output into files, and how exit codes communicate success or failure even when a command prints nothing interesting."
				},
				{
					title: "Core Navigation and File Management Commands",
					content:
						"Practice `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, `cat`, `less`, `head`, and `tail` until students can move through a directory tree without guessing. Tie every command back to a practical question: Where am I, what files are here, what changed, and how do I inspect something without damaging it."
				},
				{
					title: "Filtering and Searching in the Shell",
					content:
						"Teach `grep`, `find`, `rg`, `sort`, `uniq`, `wc`, and `xargs` as a family of inspection tools rather than isolated commands. The key lesson is that Linux work scales when students can search a tree, narrow results, count patterns, and pass findings into a follow-up command without manually copying file names around."
				},
				{
					title: "Build Small Pipelines Before Writing Scripts",
					content:
						"Show how to answer concrete questions with one pipeline at a time, such as counting log lines that contain a word or finding the largest directories in a project. This frames scripting as the next step after repeatable command-line thinking instead of as a separate skill."
				},
				{
					title: "Unit 1: Shell Foundations: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-1-shell-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-1-shell-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Shell Foundations",
					content:
						"Keep a running notebook for shell foundations that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on working-directory mistakes, quoting issues, and broken pipelines so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-1-shell-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-1-shell-foundations/solution"
				},
				{
					title: "Unit 1: Shell Foundations supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Shell Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-unit-1-shell-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-unit-1-shell-foundations-supplemental-2/solution"
				},
				{
					title: "Unit 1: Shell Foundations supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: Shell Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-unit-1-shell-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-unit-1-shell-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Filesystem Hierarchy and Directory Purpose",
			curriculum: [
				{
					title: "Read the Linux Filesystem as a Map of Intent",
					content:
						'Walk through `/`, `/home`, `/root`, `/etc`, `/var`, `/usr`, `/opt`, `/tmp`, `/srv`, and `/dev` with the question "what belongs here and why." Students should leave this lesson understanding that path choice signals meaning: configuration in one place, durable application state in another, temporary scratch data somewhere else, and service-owned content somewhere else again.'
				},
				{
					title: "Pseudo-Filesystems: /proc and /sys",
					content:
						"Explain that `/proc` and `/sys` are live views into kernel and system state rather than ordinary persisted files. Use them to inspect process details, memory, mounted filesystems, or device information so students start seeing Linux as a system they can question directly."
				},
				{
					title: "Choosing Between /var, /srv, and /opt",
					content:
						"Teach the judgment call behind application layout. Content that a service is serving often fits under `/srv`, mutable state belongs under `/var`, and self-contained optional software can live under `/opt`; students should be able to defend those choices instead of scattering files arbitrarily."
				},
				{
					title: "Project: Deploy a Static Site from /srv",
					content:
						"Use the static-site lab to make the directory-purpose lesson concrete by placing a document root under `/srv/linux-systems-site`, copying in content, and pairing that path with an Nginx server block. Students should explain why `/srv` is appropriate for served content and why `/tmp` or a random home-directory path would be a weaker production choice.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Filesystem Hierarchy and Directory Purpose",
					content:
						"Keep a running notebook for filesystem hierarchy and directory purpose that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing paths, wrong ownership, and confusing service file layout so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/solution"
				},
				{
					title: "Unit 2: Filesystem Hierarchy and Directory Purpose supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Filesystem Hierarchy and Directory Purpose. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-2-filesystem-hierarchy-and-directory-purpos/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX05-unit-2-filesystem-hierarchy-and-directory-purpos/solution"
				},
				{
					title: "Unit 2: Filesystem Hierarchy and Directory Purpose supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Filesystem Hierarchy and Directory Purpose. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-2-filesystem-hierarchy-and-directory-purpos/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-2-filesystem-hierarchy-and-directory-purpos/solution"
				}
			]
		},
		{
			title: "Unit 3: Users, Groups, and Permissions",
			curriculum: [
				{
					title: "Read, Write, Execute, and Directory Permission Semantics",
					content:
						"Teach the difference between file permissions and directory permissions, especially the fact that execute on a directory governs traversal rather than program execution. Students should be able to predict what happens when a service can read a file but cannot enter the directory that contains it."
				},
				{
					title: "Ownership Changes with chmod, chown, chgrp, and umask",
					content:
						"Practice `chmod`, `chown`, `chgrp`, and `umask` as daily administrative tools rather than obscure syntax. The learning goal is to understand default file creation behavior, shared-group workflows, and the difference between changing permissions on existing content versus controlling how new files are born."
				},
				{
					title: "sudo, Service Accounts, and Least Privilege",
					content:
						"Explain why not everything should run as root and why long-lived services often need dedicated identities. Connect least privilege to practical decisions such as document-root ownership, writable log directories, and which account should own deployed application code."
				},
				{
					title: "Permission Debugging as a Systems Skill",
					content:
						"Use realistic failures such as `Permission denied` during a deploy, an unreadable log file, or a web server that cannot open its content directory. Students should build the habit of checking user identity, group membership, file ownership, and mode bits before making random permission changes."
				},
				{
					title: "Unit 3: Users, Groups, and Permissions: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-3-users-groups-and-permissions/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-3-users-groups-and-permissions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Users, Groups, and Permissions",
					content:
						"Keep a running notebook for users, groups, and permissions that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on permission denied errors, incorrect owners, and over-broad chmod use so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-3-users-groups-and-permissions/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX06-unit-3-users-groups-and-permissions/solution"
				},
				{
					title: "Unit 3: Users, Groups, and Permissions supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: Users, Groups, and Permissions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-3-users-groups-and-permissions-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-3-users-groups-and-permissions-supplemental/solution"
				},
				{
					title: "Unit 3: Users, Groups, and Permissions supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 3: Users, Groups, and Permissions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-3-users-groups-and-permissions-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-3-users-groups-and-permissions-supplemental/solution"
				}
			]
		},
		{
			title: "Unit 4: Editing and Configuration",
			curriculum: [
				{
					title: "Terminal Editing with nano, vim, sed, and tee",
					content:
						"Students do not need to become editor fanatics, but they do need to edit files confidently in a Linux environment. Teach `nano` and `vim` for interactive edits, then show how `sed` and `tee` help with controlled replacements, scripted updates, and privilege-bound writes."
				},
				{
					title: "Safe Configuration Editing Patterns",
					content:
						"Model a careful workflow: inspect the current file, copy a backup, edit one focused section, run the service's validation command if available, and only then reload. This matters because many production outages are not caused by writing the config at all; they are caused by editing without a validation-and-rollback habit."
				},
				{
					title: "Environment Files and Service-Specific Configuration",
					content:
						"Show how applications often separate executable code from environment settings, secrets, or per-service overrides. Students should understand why environment files are useful, where they are typically referenced from, and why configuration should be explicit enough that another operator can reconstruct the service later."
				},
				{
					title: "Readable Configs Beat Clever Configs",
					content:
						"Teach students to favor clear comments, stable indentation, and small focused changes over dense one-liners that are hard to audit later. The Linux operator who comes back to a file three weeks later should still be able to explain what changed and why."
				},
				{
					title: "Unit 4: Editing and Configuration: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-4-editing-and-configuration/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-4-editing-and-configuration/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Editing and Configuration",
					content:
						"Keep a running notebook for editing and configuration that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on syntax mistakes, partial edits, missing backups, and forgotten validation steps so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-4-editing-and-configuration/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX07-unit-4-editing-and-configuration/solution"
				},
				{
					title: "Unit 4: Editing and Configuration supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: Editing and Configuration. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-4-editing-and-configuration-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-4-editing-and-configuration-supplemental-2/solution"
				},
				{
					title: "Unit 4: Editing and Configuration supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: Editing and Configuration. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-4-editing-and-configuration-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-4-editing-and-configuration-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: Processes and Job Control",
			curriculum: [
				{
					title: "Inspecting Processes with ps, top, and htop",
					content:
						"Teach process inspection as a story about what is running, who owns it, how much CPU or memory it is using, and whether it still matches the expected command line. Students should be able to move between snapshot tools like `ps` and live views like `top` or `htop` depending on whether they are chasing a momentary bug or an active performance problem."
				},
				{
					title: "Signals, kill, pkill, and Process Shutdown",
					content:
						"Explain that `kill` sends signals rather than magically destroying processes. Compare graceful termination to forceful termination and teach students to inspect why a process is stuck before escalating to stronger signals."
				},
				{
					title: "Foreground Jobs, Background Jobs, nohup, and Shell Sessions",
					content:
						"Use a toy command to show how backgrounding works, what the jobs table tracks, and why `nohup` changes the survival story when a terminal closes. This gives learners a bridge between ad hoc command-line operation and real service management."
				},
				{
					title: "Zombies, Orphans, and Process Ownership",
					content:
						"Introduce zombies and orphans as bookkeeping realities of process supervision rather than as mysterious trivia. Students should know what it means when a parent process fails to reap a child and why proper service management is better than leaving long-lived application processes attached to random shells."
				},
				{
					title: "Unit 5: Processes and Job Control: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-5-processes-and-job-control/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-5-processes-and-job-control/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Processes and Job Control",
					content:
						"Keep a running notebook for processes and job control that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on stuck jobs, wrong PIDs, signal misuse, and shell-session surprises so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-5-processes-and-job-control/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX08-unit-5-processes-and-job-control/solution"
				},
				{
					title: "Unit 5: Processes and Job Control supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Processes and Job Control. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-5-processes-and-job-control-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-5-processes-and-job-control-supplemental-2/solution"
				},
				{
					title: "Unit 5: Processes and Job Control supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Processes and Job Control. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-5-processes-and-job-control-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-5-processes-and-job-control-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Services and systemd",
			curriculum: [
				{
					title: "What a Service Is and Why systemd Matters",
					content:
						"Frame services as named, supervised processes that should survive shell exits, expose status, and restart predictably when something goes wrong. `systemd` matters because it gives Linux a common language for startup ordering, service lifecycle management, logging integration, and scheduled work."
				},
				{
					title: "Reading Unit Files",
					content:
						"Walk through the structure of a unit file by identifying the role of `[Unit]`, `[Service]`, and `[Install]` sections. Students should understand why working directory, executable path, environment variables, user identity, and restart policy all belong in the definition instead of being left to memory."
				},
				{
					title: "Daily Commands: status, start, stop, restart, reload, enable, disable",
					content:
						"Teach `systemctl status/start/stop/restart/reload/enable/disable` as a minimal operator toolkit. The important distinction is not only what each verb does, but when reload is safer than restart, when enable affects future boots instead of the current session, and how to verify state after each action."
				},
				{
					title: "Dependencies, Startup Ordering, and Environment Overrides",
					content:
						"Introduce the idea that services often depend on networking, storage, or other daemons becoming ready first. Use simple examples to show why startup ordering, drop-in overrides, and environment files matter for predictable boots and maintainable operations."
				},
				{
					title: "Project: Create a systemd Service for a Toy App",
					content:
						"Use the toy-service lab to package a simple long-running process under `systemd` and then operate it with start, stop, restart, enable, and log inspection commands. The lab should make students justify each path, user, restart policy, and environment choice in the unit file rather than treating service files as boilerplate.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Services and systemd",
					content:
						"Keep a running notebook for services and systemd that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on bad ExecStart paths, missing working directories, failed boots, and restart loops so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/solution"
				},
				{
					title: "Unit 6: Services and systemd supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Services and systemd. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX13-unit-6-services-and-systemd-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX13-unit-6-services-and-systemd-supplemental-2/solution"
				},
				{
					title: "Unit 6: Services and systemd supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 6: Services and systemd. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX14-unit-6-services-and-systemd-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX14-unit-6-services-and-systemd-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Logging and Observability",
			curriculum: [
				{
					title: "journalctl as the First Stop for Service Debugging",
					content:
						"Teach `journalctl` as the central way to read systemd-managed service output, boot logs, and recent failures. Students should learn how to scope logs by unit, boot, and time window so they can answer targeted questions instead of dumping enormous unfiltered output."
				},
				{
					title: "Application Logs vs System Logs",
					content:
						"Differentiate between logs written by applications, logs written by services through the journal, and platform logs about the machine itself. This distinction helps students decide whether they are debugging code behavior, service supervision, or a deeper machine problem."
				},
				{
					title: "Log Rotation and Retention",
					content:
						"Explain why logs cannot grow forever and why reliable systems choose explicit retention policies. Use simple examples of access logs, error logs, and archived logs to show how observability has to be balanced with disk usage and operational hygiene."
				},
				{
					title: "Diagnosing Boot Failures and Service Crashes",
					content:
						"Work through a break/fix story where a service fails after a bad config change or a wrong file path. Students should learn to start with status, move to recent logs, identify the first trustworthy error, and only then decide whether the fix is a config repair, a path correction, or a permission change."
				},
				{
					title: "Unit 7: Logging and Observability: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-7-logging-and-observability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-7-logging-and-observability/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Logging and Observability",
					content:
						"Keep a running notebook for logging and observability that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on log scoping, noisy output, missing files, and crash-timeline reconstruction so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-7-logging-and-observability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX09-unit-7-logging-and-observability/solution"
				},
				{
					title: "Unit 7: Logging and Observability supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Logging and Observability. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX15-unit-7-logging-and-observability-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX15-unit-7-logging-and-observability-supplemental-2/solution"
				},
				{
					title: "Unit 7: Logging and Observability supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Logging and Observability. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX16-unit-7-logging-and-observability-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX16-unit-7-logging-and-observability-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Scheduling and Automation",
			curriculum: [
				{
					title: "cron and Crontab Syntax",
					content:
						"Introduce `cron` as the classic scheduling tool for repeatable command execution. Students should learn how to read the five timing fields, how to test a command manually before scheduling it, and why the command written into the crontab needs full paths and explicit assumptions."
				},
				{
					title: "Cron Environment Gotchas",
					content:
						"Teach the common surprise that scheduled jobs often run with a smaller environment than interactive shells. Missing PATH entries, relative paths, and unstated shell assumptions are routine sources of failure, so students should learn to make scheduled commands self-sufficient and observable."
				},
				{
					title: "systemd Timers vs cron",
					content:
						"Compare `systemd` timers to `cron` in terms of logging, service integration, missed-run behavior, and operational visibility. The aim is not to declare one winner forever, but to help students choose the right scheduling surface for the kind of system they are operating."
				},
				{
					title: "Automating Cleanup and Backup Tasks",
					content:
						"Use cleanup and backup examples to show how small shell scripts become maintainable operational tools when they are idempotent, logged, and scheduled deliberately. Students should understand how a reliable scheduled task includes verification, retention thinking, and a failure story instead of only a command that seems to work once."
				},
				{
					title: "Project: Write a Backup Script and Schedule It with cron and a Timer",
					content:
						"Use the backup lab to build a small archive script, schedule it first with `cron` and then with a `systemd` timer, and compare the operational experience. Students should be able to explain what changed in observability, environment handling, and reliability when they moved between the two schedulers.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Scheduling and Automation",
					content:
						"Keep a running notebook for scheduling and automation that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing PATH entries, silent cron failures, and timer verification so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/solution"
				},
				{
					title: "Unit 8: Scheduling and Automation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Scheduling and Automation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX17-unit-8-scheduling-and-automation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX17-unit-8-scheduling-and-automation-supplemental-2/solution"
				},
				{
					title: "Unit 8: Scheduling and Automation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 8: Scheduling and Automation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX18-unit-8-scheduling-and-automation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX18-unit-8-scheduling-and-automation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Package Management and Software Layout",
			curriculum: [
				{
					title: "Package Managers: apt, dnf, yum, and Related Tools",
					content:
						"Introduce package management as the operating system's official mechanism for installing, upgrading, and removing software with tracked dependencies. Students should recognize that command syntax differs across distributions, but the underlying administrative questions stay the same: what is installed, where did it come from, and how will it be updated safely later."
				},
				{
					title: "Package Install vs Source Build vs Tarball Drop",
					content:
						"Compare system packages, source builds, and manually unpacked tarballs in terms of traceability, maintenance burden, and filesystem placement. This lesson should make students suspicious of software that appears in production without a clear install method, owner, or upgrade path."
				},
				{
					title: "Understand Where Installed Software Lives",
					content:
						"Tie package management back to filesystem layout by showing how binaries, libraries, config files, and service units can end up under different directories. Students should learn to inspect the package view of software and the filesystem view of software together instead of assuming that an installed app is a single folder."
				},
				{
					title: "Keeping Systems Patched without Losing Control",
					content:
						"Teach patching as a balance between timeliness and operational confidence. Students should practice reading what will change, understanding whether a service restart is implied, and recording what was upgraded so that post-change debugging has an audit trail."
				},
				{
					title: "Unit 9: Package Management and Software Layout: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-9-package-management-and-software-layout/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-9-package-management-and-software-layout/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Package Management and Software Layout",
					content:
						"Keep a running notebook for package management and software layout that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing commands, package-version confusion, and untracked manual installs so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-9-package-management-and-software-layout/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX10-unit-9-package-management-and-software-layout/solution"
				},
				{
					title: "Unit 9: Package Management and Software Layout supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Package Management and Software Layout. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX19-unit-9-package-management-and-software-layout-su/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX19-unit-9-package-management-and-software-layout-su/solution"
				},
				{
					title: "Unit 9: Package Management and Software Layout supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 9: Package Management and Software Layout. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX20-unit-9-package-management-and-software-layout-su/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX20-unit-9-package-management-and-software-layout-su/solution"
				}
			]
		},
		{
			title: "Unit 10: Networking from a Systems View",
			curriculum: [
				{
					title: "Inspect Interfaces and Routes with ip",
					content:
						"Teach `ip` as the modern way to inspect addresses, interfaces, and routes. Students should be able to answer basic systems questions such as whether the machine has an address, which interface owns it, and where packets are expected to go next."
				},
				{
					title: "Listening Services and Sockets with ss",
					content:
						"Use `ss` to connect network thinking back to process thinking. A student should be able to inspect which ports are listening, whether an expected service is actually bound, and whether a reverse proxy or app process is reachable on the port the rest of the configuration assumes."
				},
				{
					title: "Testing Connectivity with ping, curl, and dig",
					content:
						"Teach `ping`, `curl`, and `dig` as distinct tools with distinct jobs: reachability, HTTP-level testing, and DNS inspection. The point is to avoid hand-wavy networking guesses and replace them with specific checks at the right layer."
				},
				{
					title: "Bridge to a Networking Course without Losing the Systems Lens",
					content:
						"Keep the focus on the administrator's day-to-day needs: is the interface up, is the route present, is DNS returning what I expect, and is the service listening where the proxy thinks it is. That systems lens gives students enough network competence to operate a host even before they take a deeper networking course."
				},
				{
					title: "Unit 10: Networking from a Systems View: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-10-networking-from-a-systems-view/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-10-networking-from-a-systems-view/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Networking from a Systems View",
					content:
						"Keep a running notebook for networking from a systems view that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on wrong bind addresses, DNS mismatches, missing routes, and dead ports so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-10-networking-from-a-systems-view/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX11-unit-10-networking-from-a-systems-view/solution"
				},
				{
					title: "Unit 10: Networking from a Systems View supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: Networking from a Systems View. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX21-unit-10-networking-from-a-systems-view-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX21-unit-10-networking-from-a-systems-view-supplemen/solution"
				},
				{
					title: "Unit 10: Networking from a Systems View supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 10: Networking from a Systems View. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX22-unit-10-networking-from-a-systems-view-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX22-unit-10-networking-from-a-systems-view-supplemen/solution"
				}
			]
		},
		{
			title: "Unit 11: Web Servers",
			curriculum: [
				{
					title: "Nginx Fundamentals",
					content:
						"Teach Nginx as both a static file server and a reverse proxy. Students should understand the role of a `server` block, a document root, a location block, and the difference between testing config syntax and actually reloading the service."
				},
				{
					title: "Apache Fundamentals",
					content:
						"Introduce Apache as another major hosting surface with a different configuration style but many of the same core ideas. Learners should be able to identify the Apache equivalents of document roots, virtual hosts, access and error logs, and configuration activation."
				},
				{
					title: "Reverse Proxy vs Static File Serving",
					content:
						"Make students explain the operational difference between serving files directly from disk and forwarding requests to an upstream application. This distinction is central to real Linux work because it shapes what should be inspected first during an outage: the content path, the web server config, the upstream process, or the network path between them."
				},
				{
					title: "TLS, Virtual Hosts, Server Blocks, Reload vs Restart",
					content:
						"Even if the full TLS setup is saved for later, students should learn the vocabulary and the lifecycle commands. A careful operator validates config, reloads when possible, restarts only when necessary, and understands that multi-site hosting depends on explicit host-based routing whether the server is Nginx or Apache."
				},
				{
					title: "Project: Run a Small App Behind Nginx",
					content:
						"Use the reverse-proxy lab to place a toy application on an internal port and then serve it through Nginx. This project should force students to verify the app independently, confirm the listening socket, inspect proxy headers, and prove whether a bug lives in the app, the proxy, or the network path between them.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/solution"
				},
				{
					title: "Project: Configure an Apache Virtual Host and Compare It to Nginx",
					content:
						"Use the Apache lab to serve a parallel site and write a short compare-and-contrast note between Apache `<VirtualHost>` configuration and Nginx `server` blocks. The point is to make students comfortable operating more than one web server family without losing the underlying mental model.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS4-Apache-Virtual-Host-Compare/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS4-Apache-Virtual-Host-Compare/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Web Servers",
					content:
						"Keep a running notebook for web servers that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on syntax errors, bad roots, proxy loops, wrong ports, and reload-vs-restart mistakes so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/solution"
				},
				{
					title: "Unit 11: Web Servers supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Web Servers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX23-unit-11-web-servers-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX23-unit-11-web-servers-supplemental-2/solution"
				},
				{
					title: "Unit 11: Web Servers supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 11: Web Servers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX24-unit-11-web-servers-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX24-unit-11-web-servers-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Storage, Backups, and Reliability",
			curriculum: [
				{
					title: "Disks, Mounts, and Capacity with df, du, mount, and fstab",
					content:
						'Introduce storage management through the operator questions that come up in real systems work: what is mounted, how full is it, and what will happen on the next boot. Students should learn to distinguish device-level thinking from directory-level usage so that they can tell whether a problem is "the filesystem is full" or "one path is unexpectedly large."'
				},
				{
					title: "Backup Patterns for Small Linux Systems",
					content:
						"Teach backups as a reliability practice rather than a checkbox. Students should think about what must be preserved, how often it changes, where archives should live, how retention works, and how to tell whether a backup succeeded beyond simply seeing that a file was created."
				},
				{
					title: "log and tmp Cleanup as Operational Hygiene",
					content:
						"Connect cleanup to both reliability and security by showing how leftover logs, temporary files, and stale archives can consume space or expose unnecessary data. Students should learn that predictable cleanup is part of stable system behavior, not an afterthought once the machine is already in trouble."
				},
				{
					title: "Recovery Workflow after a Bad Config Change",
					content:
						"End the course with recovery discipline: find the most recent change, validate syntax, compare against backups, rollback narrowly, and document the incident. Students should leave knowing that reliable operations is not the absence of mistakes; it is the presence of a repeatable recovery workflow when a change goes wrong."
				},
				{
					title: "Unit 12: Storage, Backups, and Reliability: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-12-storage-backups-and-reliability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-12-storage-backups-and-reliability/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Storage, Backups, and Reliability",
					content:
						"Keep a running notebook for storage, backups, and reliability that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on full disks, bad mounts, failed backups, and rollback after broken config changes so students build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-12-storage-backups-and-reliability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX12-unit-12-storage-backups-and-reliability/solution"
				},
				{
					title: "Unit 12: Storage, Backups, and Reliability supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Storage, Backups, and Reliability. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX25-unit-12-storage-backups-and-reliability-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX25-unit-12-storage-backups-and-reliability-suppleme/solution"
				},
				{
					title: "Unit 12: Storage, Backups, and Reliability supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 12: Storage, Backups, and Reliability. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX26-unit-12-storage-backups-and-reliability-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX26-unit-12-storage-backups-and-reliability-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: linux systems lab 14",
			curriculum: [
				{
					title: "linux systems lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: linux systems lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "linux systems lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: linux systems lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "linux systems lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: linux systems lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-linux-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-linux-systems-lab-14/solution"
				},
				{
					title: "linux systems lab 14: Review and Reflection",
					content:
						"Close Applied Studio 14: linux systems lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "linux systems lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: linux systems lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-linux-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX01-linux-systems-lab-14/solution"
				},
				{
					title: "Applied Studio 14: linux systems lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: linux systems lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX27-applied-studio-14-linux-systems-lab-14-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX27-applied-studio-14-linux-systems-lab-14-supplemen/solution"
				},
				{
					title: "Applied Studio 14: linux systems lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: linux systems lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX28-applied-studio-14-linux-systems-lab-14-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX28-applied-studio-14-linux-systems-lab-14-supplemen/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: linux systems lab 15",
			curriculum: [
				{
					title: "linux systems lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: linux systems lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "linux systems lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: linux systems lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "linux systems lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: linux systems lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-linux-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-linux-systems-lab-15/solution"
				},
				{
					title: "linux systems lab 15: Review and Reflection",
					content:
						"Close Applied Studio 15: linux systems lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "linux systems lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: linux systems lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-linux-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX02-linux-systems-lab-15/solution"
				},
				{
					title: "Applied Studio 15: linux systems lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: linux systems lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX29-applied-studio-15-linux-systems-lab-15-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX29-applied-studio-15-linux-systems-lab-15-supplemen/solution"
				},
				{
					title: "Applied Studio 15: linux systems lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: linux systems lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX30-applied-studio-15-linux-systems-lab-15-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX30-applied-studio-15-linux-systems-lab-15-supplemen/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: linux systems lab 16",
			curriculum: [
				{
					title: "linux systems lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: linux systems lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "linux systems lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: linux systems lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "linux systems lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: linux systems lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-linux-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-linux-systems-lab-16/solution"
				},
				{
					title: "linux systems lab 16: Review and Reflection",
					content:
						"Close Applied Studio 16: linux systems lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "linux systems lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: linux systems lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-linux-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX03-linux-systems-lab-16/solution"
				},
				{
					title: "Applied Studio 16: linux systems lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: linux systems lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX31-applied-studio-16-linux-systems-lab-16-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX31-applied-studio-16-linux-systems-lab-16-supplemen/solution"
				},
				{
					title: "Applied Studio 16: linux systems lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: linux systems lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX32-applied-studio-16-linux-systems-lab-16-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX32-applied-studio-16-linux-systems-lab-16-supplemen/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: linux systems lab 17",
			curriculum: [
				{
					title: "linux systems lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: linux systems lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "linux systems lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: linux systems lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "linux systems lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: linux systems lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-linux-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-linux-systems-lab-17/solution"
				},
				{
					title: "linux systems lab 17: Review and Reflection",
					content:
						"Close Applied Studio 17: linux systems lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "linux systems lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: linux systems lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-linux-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX04-linux-systems-lab-17/solution"
				},
				{
					title: "Applied Studio 17: linux systems lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: linux systems lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX33-applied-studio-17-linux-systems-lab-17-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX33-applied-studio-17-linux-systems-lab-17-supplemen/solution"
				},
				{
					title: "Applied Studio 17: linux systems lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: linux systems lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX34-applied-studio-17-linux-systems-lab-17-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LSX34-applied-studio-17-linux-systems-lab-17-supplemen/solution"
				}
			]
		}
	]
};
