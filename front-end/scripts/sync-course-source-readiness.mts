import fs from "node:fs";
import path from "node:path";
import { courseCatalog, loadRawCourse } from "../src/stores/courses/index";
import { courseImplementationSourceRepos } from "../src/stores/courses/course-implementation-artifacts";
import type {
	RawCourse,
	RawCourseModuleItem
} from "../src/stores/courses/types";

const instructionRoot =
	"/Users/jacobanderson/Documents/Work/Instruction-Material";

const ignoredTopLevelDirs = new Set([
	"build",
	"cmake-build-debug",
	"node_modules",
	"dist",
	"__pycache__"
]);
const generatedReadinessFiles = new Set([
	"COURSE_SOURCE_MANIFEST.md",
	"SOURCE_BACKLOG.md",
	"verify-course-source.sh"
]);

function allItems(course: RawCourse) {
	return course.modules.flatMap(
		module =>
			[
				...module.curriculum.map(item => ({
					module: module.title,
					section: "curriculum",
					item
				})),
				...module.supplementalProjects.map(item => ({
					module: module.title,
					section: "supplementalProjects",
					item
				}))
			] as Array<{
				module: string;
				section: string;
				item: RawCourseModuleItem;
			}>
	);
}

function listTopDirs(root: string) {
	if (!fs.existsSync(root)) return [];

	return fs
		.readdirSync(root, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => entry.name)
		.filter(name => !name.startsWith("."))
		.filter(name => !ignoredTopLevelDirs.has(name))
		.sort((a, b) => a.localeCompare(b));
}

function sourceFiles(root: string) {
	if (!fs.existsSync(root)) return [];
	const results: string[] = [];
	const stack = [root];

	while (stack.length > 0) {
		const current = stack.pop()!;
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			if (entry.name.startsWith(".")) continue;
			const fullPath = path.join(current, entry.name);
			if (entry.isDirectory()) {
				if (!ignoredTopLevelDirs.has(entry.name)) stack.push(fullPath);
				continue;
			}
			const relative = path.relative(root, fullPath);
			if (generatedReadinessFiles.has(relative)) continue;
			if (
				/\.(?:java|py|cpp|c|h|hpp|js|ts|swift|cs|md)$/i.test(entry.name)
			) {
				results.push(relative);
			}
		}
	}

	return results.sort((a, b) => a.localeCompare(b));
}

function linkedFoldersForRepo(course: RawCourse, repo: string) {
	const folders = new Set<string>();
	const prefix = `github.com/instruction-material/${repo}/tree/main/`;

	for (const { item } of allItems(course)) {
		for (const url of [item.projectLink, item.solutionLink]) {
			if (!url?.includes(prefix)) continue;
			const after = url.split(prefix)[1] ?? "";
			const folder = after.split("/").filter(Boolean)[0];
			if (folder) folders.add(folder);
		}
	}

	return [...folders].sort((a, b) => a.localeCompare(b));
}

function comparableFolderName(folder: string) {
	return folder
		.toLowerCase()
		.replace(/(?:^|-)java$/u, "")
		.replace(
			/(?:^|-)(?:starter|solution|updated|template|reference)$/gu,
			""
		)
		.replace(/(?:^|-)all-star$/u, "")
		.replace(/[^a-z0-9]+/gu, "");
}

function classifyUnlinkedFolder(folder: string, linkedFolders: string[]) {
	const comparable = comparableFolderName(folder);
	const coveredByVariant = linkedFolders.some(
		linked => comparableFolderName(linked) === comparable
	);

	if (coveredByVariant) return "covered-by-linked-variant";
	if (
		/starter|solution|template|updated|reference|recap|check[- ]?in/i.test(
			folder
		)
	) {
		return "support-or-variant-source";
	}
	if (/legacy|archive|old|customized|copy|backup|deprecated/i.test(folder)) {
		return "legacy-or-archive";
	}

	return "inactive-source-candidate";
}

function markdownTable(headers: string[], rows: string[][]) {
	return [
		`| ${headers.join(" | ")} |`,
		`| ${headers.map(() => "---").join(" | ")} |`,
		...rows.map(row => `| ${row.join(" | ")} |`)
	].join("\n");
}

function writeFileIfChanged(file: string, content: string, mode?: number) {
	const normalized = `${content.trim()}\n`;
	if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== normalized) {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, normalized);
	}
	if (mode !== undefined) fs.chmodSync(file, mode);
}

function repoVerificationScript(repo: string) {
	const unityChecks =
		repo === "Unity-Game-Development"
			? `
for project in UGD-full-project-starter UGD-full-project-solution; do
  require_file "$project/ProjectSettings/ProjectVersion.txt"
  require_file "$project/Packages/manifest.json"
  require_file "$project/Packages/packages-lock.json"
  require_file "$project/Assets/Scripts/GameSession.cs"
  require_file "$project/Assets/Tests/EditMode/GameSessionTests.cs"
  require_file "$project/THIRD_PARTY_ASSETS.md"
done
require_file ".gitattributes"
`
			: "";

	return `#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
cd "$root"

fail() {
  printf 'course source verification failed: %s\\n' "$1" >&2
  exit 1
}

require_file() {
  [ -f "$1" ] || fail "missing $1"
}

require_file "COURSE_SOURCE_MANIFEST.md"
require_file "SOURCE_BACKLOG.md"
${unityChecks}
if find . \\
  \\( -path './.git' -o -path './node_modules' -o -path './Library' -o -path './Temp' -o -path './Logs' \\) -prune -o \\
  \\( -name '.replit' -o -name 'replit.nix' -o -name 'replit.nix.backup' -o -name 'replit_zip_error_log.txt' \\) -print | grep -q .; then
  fail "replit metadata should not be committed"
fi

source_count="$(find . \\
  \\( -path './.git' -o -path './node_modules' -o -path './Library' -o -path './Temp' -o -path './Logs' \\) -prune -o \\
  -type f \\( -name '*.py' -o -name '*.java' -o -name '*.cpp' -o -name '*.c' -o -name '*.h' -o -name '*.hpp' -o -name '*.js' -o -name '*.ts' -o -name '*.swift' -o -name '*.cs' -o -name '*.md' \\) -print | wc -l | tr -d ' ')"

[ "$source_count" -gt 0 ] || fail "no source-like files found"

printf 'course source verification passed: %s source-like files\\n' "$source_count"
`;
}

function unityProjectFiles(projectName: string, solution: boolean) {
	const requiredCoins = solution ? 5 : 3;
	const gameSession = solution
		? `using System;

namespace Course.UnityGameDevelopment
{
    public enum SessionState
    {
        Ready,
        Playing,
        Won,
        Failed
    }

    public sealed class GameSession
    {
        public int RequiredCoins { get; }
        public int Score { get; private set; }
        public SessionState State { get; private set; }

        public GameSession(int requiredCoins = ${requiredCoins})
        {
            if (requiredCoins <= 0)
                throw new ArgumentOutOfRangeException(nameof(requiredCoins), "Required coins must be positive.");

            RequiredCoins = requiredCoins;
            State = SessionState.Ready;
        }

        public void Start()
        {
            if (State == SessionState.Ready)
                State = SessionState.Playing;
        }

        public void CollectCoin()
        {
            if (State != SessionState.Playing)
                return;

            Score++;
            if (Score >= RequiredCoins)
                State = SessionState.Won;
        }

        public void HitHazard()
        {
            if (State == SessionState.Playing)
                State = SessionState.Failed;
        }

        public void Reset()
        {
            Score = 0;
            State = SessionState.Ready;
        }
    }
}
`
		: `using System;

namespace Course.UnityGameDevelopment
{
    public enum SessionState
    {
        Ready,
        Playing,
        Won,
        Failed
    }

    public sealed class GameSession
    {
        public int RequiredCoins { get; }
        public int Score { get; private set; }
        public SessionState State { get; private set; }

        public GameSession(int requiredCoins = ${requiredCoins})
        {
            if (requiredCoins <= 0)
                throw new ArgumentOutOfRangeException(nameof(requiredCoins), "Required coins must be positive.");

            RequiredCoins = requiredCoins;
            State = SessionState.Ready;
        }

        public void Start()
        {
            State = SessionState.Playing;
        }

        public void CollectCoin()
        {
            if (State != SessionState.Playing)
                return;

            Score++;
            if (Score >= RequiredCoins)
                State = SessionState.Won;
        }

        public void HitHazard()
        {
            if (State == SessionState.Playing)
                State = SessionState.Failed;
        }

        public void Reset()
        {
            Score = 0;
            State = SessionState.Ready;
        }
    }
}
`;

	const tests = solution
		? `using Course.UnityGameDevelopment;
using NUnit.Framework;

public sealed class GameSessionTests
{
    [Test]
    public void CollectingRequiredCoinsWins()
    {
        var session = new GameSession(2);

        session.Start();
        session.CollectCoin();
        session.CollectCoin();

        Assert.That(session.Score, Is.EqualTo(2));
        Assert.That(session.State, Is.EqualTo(SessionState.Won));
    }

    [Test]
    public void HazardFailsOnlyActiveGame()
    {
        var session = new GameSession();

        session.HitHazard();
        Assert.That(session.State, Is.EqualTo(SessionState.Ready));

        session.Start();
        session.HitHazard();
        Assert.That(session.State, Is.EqualTo(SessionState.Failed));
    }
}
`
		: `using Course.UnityGameDevelopment;
using NUnit.Framework;

public sealed class GameSessionTests
{
    [Test]
    public void NewSessionStartsReady()
    {
        var session = new GameSession();

        Assert.That(session.Score, Is.EqualTo(0));
        Assert.That(session.State, Is.EqualTo(SessionState.Ready));
        Assert.That(session.RequiredCoins, Is.GreaterThan(0));
    }
}
`;

	return new Map<string, string>([
		[
			"ProjectSettings/ProjectVersion.txt",
			`m_EditorVersion: 6000.3.15f1
m_EditorVersionWithRevision: 6000.3.15f1 (000000000000)`
		],
		[
			"Packages/manifest.json",
			`{
  "dependencies": {
    "com.unity.inputsystem": "1.14.0",
    "com.unity.test-framework": "1.5.2",
    "com.unity.ugui": "2.0.0"
  }
}`
		],
		[
			"Packages/packages-lock.json",
			`{
  "dependencies": {
    "com.unity.inputsystem": {
      "version": "1.14.0",
      "depth": 0,
      "source": "registry",
      "dependencies": {},
      "url": "https://packages.unity.com"
    },
    "com.unity.test-framework": {
      "version": "1.5.2",
      "depth": 0,
      "source": "registry",
      "dependencies": {
        "com.unity.ext.nunit": "2.0.5"
      },
      "url": "https://packages.unity.com"
    },
    "com.unity.ugui": {
      "version": "2.0.0",
      "depth": 0,
      "source": "registry",
      "dependencies": {},
      "url": "https://packages.unity.com"
    }
  }
}`
		],
		["Assets/Scripts/GameSession.cs", gameSession],
		[
			"Assets/Scripts/GameManager.cs",
			`using Course.UnityGameDevelopment;
using UnityEngine;

public sealed class GameManager : MonoBehaviour
{
    private readonly GameSession session = new();

    public int Score => session.Score;
    public SessionState State => session.State;

    public void StartGame() => session.Start();
    public void CollectCoin() => session.CollectCoin();
    public void FailRun() => session.HitHazard();
    public void ResetRun() => session.Reset();
}
`
		],
		[
			"Assets/Scripts/PlayerController.cs",
			`using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public sealed class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    private Rigidbody2D body = null!;

    private void Awake()
    {
        body = GetComponent<Rigidbody2D>();
    }

    private void FixedUpdate()
    {
        var horizontal = Input.GetAxisRaw("Horizontal");
        body.linearVelocity = new Vector2(horizontal * moveSpeed, body.linearVelocity.y);
    }
}
`
		],
		[
			"Assets/Scripts/Collectible.cs",
			`using UnityEngine;

public sealed class Collectible : MonoBehaviour
{
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player"))
            return;

        FindFirstObjectByType<GameManager>()?.CollectCoin();
        gameObject.SetActive(false);
    }
}
`
		],
		[
			"Assets/Scripts/Hazard.cs",
			`using UnityEngine;

public sealed class Hazard : MonoBehaviour
{
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
            FindFirstObjectByType<GameManager>()?.FailRun();
    }
}
`
		],
		["Assets/Tests/EditMode/GameSessionTests.cs", tests],
		[
			"Assets/Tests/PlayMode/PlayModeSmokeTests.cs",
			`using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;

public sealed class PlayModeSmokeTests
{
    [Test]
    public void ProjectCanCreateCoreRuntimeObjects()
    {
        var manager = new GameObject("GameManager").AddComponent<GameManager>();

        manager.StartGame();

        Assert.That(manager.State.ToString(), Is.EqualTo("Playing"));
        Object.DestroyImmediate(manager.gameObject);
    }
}
`
		],
		[
			"Assets/Scenes/README.md",
			`# Scene Contract

Create a scene named \`RelicRunner\` with:

- A \`GameManager\` object.
- A tagged \`Player\` object with \`PlayerController\`, \`Rigidbody2D\`, and \`Collider2D\`.
- At least ${requiredCoins} collectible objects.
- At least one hazard or out-of-bounds failure trigger.
- A restart path documented in the scene notes.
`
		],
		[
			"Assets/Prefabs/README.md",
			`# Prefab Contract

Keep reusable player, collectible, hazard, and UI prefabs here. Prefabs should be created inside Unity so their serialized references remain valid.
`
		],
		[
			"Assets/Art/README.md",
			`# Art Assets

Use self-created, Unity sample, Kenney, or other permissively licensed assets. Record every external asset in \`THIRD_PARTY_ASSETS.md\` before committing.
`
		],
		[
			"THIRD_PARTY_ASSETS.md",
			`# Third-Party Assets

No third-party assets are included in this ${projectName} baseline.

When assets are added, record:

- Asset name
- Source URL
- License
- Date imported
- Modifications
- First commit/tag where it appears
`
		],
		[
			".gitignore",
			`[Ll]ibrary/
[Tt]emp/
[Oo]bj/
[Bb]uild/
[Bb]uilds/
[Ll]ogs/
[Uu]ser[Ss]ettings/
.vs/
.idea/
.DS_Store`
		],
		[
			"README.md",
			`# ${projectName}

This is the ${solution ? "solution" : "starter"} full-project Unity baseline for Unity Game Development.

## Unity Version

- Unity 6.3 LTS / 6000.3.15f1
- Input System package
- Unity Test Framework package

## Verification

1. Open this folder in Unity Hub with the pinned editor version.
2. Run Edit Mode tests from \`Assets/Tests/EditMode\`.
3. Run the Play Mode smoke test from \`Assets/Tests/PlayMode\`.
4. Create or open the \`RelicRunner\` scene following \`Assets/Scenes/README.md\`.
5. Build a desktop profile after the scene is playable.

## Scope

The starter intentionally keeps scene wiring lightweight so students build the project in Unity. The solution includes the completed session rules and a broader test set, but still expects students to inspect scene wiring and asset attribution.
`
		]
	]);
}

function syncUnityProject(root: string) {
	writeFileIfChanged(
		path.join(root, ".gitattributes"),
		`*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.unity text eol=lf
*.prefab text eol=lf
*.asset text eol=lf
*.cs text eol=lf
*.json text eol=lf
*.md text eol=lf`
	);

	for (const [projectName, solution] of [
		["UGD-full-project-starter", false],
		["UGD-full-project-solution", true]
	] as const) {
		const projectRoot = path.join(root, projectName);
		for (const [relativeFile, content] of unityProjectFiles(
			projectName,
			solution
		)) {
			writeFileIfChanged(path.join(projectRoot, relativeFile), content);
		}
	}
}

const loadedCourses = (
	await Promise.all(
		courseCatalog.map(async entry => ({
			entry,
			course: await loadRawCourse(entry.id)
		}))
	)
).filter(
	(
		row
	): row is { entry: (typeof courseCatalog)[number]; course: RawCourse } =>
		Boolean(row.course)
);

const repos = new Map<
	string,
	Array<{ courseId: string; courseName: string; course: RawCourse }>
>();

for (const { entry, course } of loadedCourses) {
	const repo = courseImplementationSourceRepos[entry.id];
	if (!repo) continue;
	const rows = repos.get(repo) ?? [];
	rows.push({ courseId: entry.id, courseName: course.name, course });
	repos.set(repo, rows);
}

const summaries: string[] = [];

for (const [repo, mappedCourses] of [...repos].sort((a, b) =>
	a[0].localeCompare(b[0])
)) {
	const root = path.join(instructionRoot, repo);
	if (!fs.existsSync(root)) {
		summaries.push(`${repo}: missing local root`);
		continue;
	}

	if (repo === "Unity-Game-Development") syncUnityProject(root);

	const linkedFolders = [
		...new Set(
			mappedCourses.flatMap(({ course }) =>
				linkedFoldersForRepo(course, repo)
			)
		)
	].sort((a, b) => a.localeCompare(b));
	const linked = new Set(linkedFolders);
	const topDirs = listTopDirs(root);
	const unlinked = topDirs.filter(folder => !linked.has(folder));
	const backlogRows = unlinked.map(folder => {
		const classification = classifyUnlinkedFolder(folder, linkedFolders);
		const action =
			classification === "inactive-source-candidate"
				? "Inactive/promotable source. Do not link until the course text, starter/solution role, and verification expectation are added."
				: classification === "support-or-variant-source"
					? "Support, template, starter, solution, or updated variant. Keep available but do not count as a separate active project unless promoted."
					: classification === "legacy-or-archive"
						? "Legacy/archive material. Preserve for reference; do not link as active coursework without explicit migration."
						: "Covered by a linked starter/solution/update variant already used by the catalog.";

		return [folder, classification, action];
	});

	const manifest = [
		"# Course Source Manifest",
		"",
		`Canonical source repository: \`${repo}\``,
		"",
		"## Mapped Catalog Courses",
		"",
		...mappedCourses.map(
			({ courseId, courseName }) => `- \`${courseId}\`: ${courseName}`
		),
		"",
		"## Verification Gate",
		"",
		"- Run `./verify-course-source.sh` from this repository root before treating the source pack as ready.",
		"- The verification gate checks for this manifest, the source backlog ledger, source-like files, removed Replit metadata, and any repo-specific readiness files.",
		"- Project-specific unit tests or build commands should still be run inside individual project folders when a project includes its own test harness.",
		"",
		"## Active Catalog Targets",
		"",
		linkedFolders.length > 0
			? markdownTable(
					["Folder"],
					linkedFolders.map(folder => [`\`${folder}\``])
				)
			: "No active folder links were detected. This should be treated as a course authoring issue.",
		"",
		"## Source Inventory",
		"",
		`- Top-level folders: ${topDirs.length}`,
		`- Active linked folders: ${linkedFolders.length}`,
		`- Ledgered inactive/support folders: ${unlinked.length}`,
		`- Source-like files: ${sourceFiles(root).length}`
	].join("\n");

	const backlog = [
		"# Source Backlog Ledger",
		"",
		"This ledger records top-level source folders that are present in the repository but are not active catalog starter or solution targets. A folder listed here is intentionally not an unresolved audit failure.",
		"",
		"Promotion rule: move a folder out of this ledger only after the course text names where it belongs, whether it is starter or solution material, and how the student or tutor verifies it.",
		"",
		backlogRows.length > 0
			? markdownTable(
					["Folder", "Classification", "Action"],
					backlogRows.map(([folder, classification, action]) => [
						`\`${folder}\``,
						classification,
						action
					])
				)
			: "No inactive or support folders are currently outside active catalog links."
	].join("\n");

	writeFileIfChanged(path.join(root, "COURSE_SOURCE_MANIFEST.md"), manifest);
	writeFileIfChanged(path.join(root, "SOURCE_BACKLOG.md"), backlog);
	writeFileIfChanged(
		path.join(root, "verify-course-source.sh"),
		repoVerificationScript(repo),
		0o755
	);

	summaries.push(
		`${repo}: ${linkedFolders.length} active, ${unlinked.length} ledgered`
	);
}

console.log(summaries.join("\n"));
