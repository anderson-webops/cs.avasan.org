import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function repositoryFile(path: string) {
	return readFileSync(resolve(__dirname, `../../${path}`), "utf8");
}

function composeService(compose: string, serviceName: string) {
	const match = compose.match(
		new RegExp(`\\n    ${serviceName}:\\n[\\s\\S]*?(?=\\n    [a-z][a-z-]*:\\n|\\nnetworks:)`)
	);
	expect(match, `missing Compose service ${serviceName}`).toBeTruthy();
	return match![0];
}

describe("versioned full-stack production deployment", () => {
	it("pins every GitHub Action to an immutable reviewed commit", () => {
		const workflowDirectory = resolve(__dirname, "../../.github/workflows");
		const codeqlWorkflow = repositoryFile(".github/workflows/codeql-analysis.yml");
		const actionReferences = readdirSync(workflowDirectory)
			.filter(filename => filename.endsWith(".yml") || filename.endsWith(".yaml"))
			.flatMap(filename =>
				readFileSync(resolve(workflowDirectory, filename), "utf8")
					.split(/\r?\n/)
					.map(line => line.trim())
					.filter(line => line.startsWith("uses:") || line.startsWith("- uses:"))
			);

		expect(actionReferences.length).toBeGreaterThan(0);
		for (const reference of actionReferences) {
			expect(reference).toMatch(
				/^-?\s*uses:\s+[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?@[a-f0-9]{40}\s+#\s+\S+$/
			);
		}
		expect(codeqlWorkflow).toMatch(/\non:\n\s+workflow_dispatch:\n\s+push:/);
	});

	it("publishes only the classroom proxy on loopback", () => {
		const compose = repositoryFile("compose.production.yml");
		const api = composeService(compose, "api");
		const mongo = composeService(compose, "mongo");

		expect(compose).toContain('"127.0.0.1:${CS_AVASAN_LISTEN_PORT:-8080}:8080"');
		expect(api).toContain("container_name: cs-avasan-org-api");
		expect(api).toContain('\n        expose:\n            - "3008"');
		expect(api).not.toContain("\n        ports:");
		expect(mongo).not.toContain("\n        ports:");
		expect(mongo).toContain(
			'- >-\n                    mongosh --quiet --username "$$MONGO_INITDB_ROOT_USERNAME"'
		);
		expect(mongo).toContain('--eval "quit(db.adminCommand(\'ping\').ok ? 0 : 2)"');
		expect(compose).toContain("data:\n        internal: true");
		expect(compose.match(/no-new-privileges:true/g)).toHaveLength(3);
		expect(compose.match(/\n        cap_drop:\n            - ALL/g)).toHaveLength(3);
		expect(compose.match(/\n        read_only: true/g)).toHaveLength(3);
		expect(compose.match(/\/tmp:rw,noexec,nosuid,size=32m/g)).toHaveLength(3);
		expect(compose).toMatch(/image: mongo:8[.]0[.]12-noble@sha256:[a-f0-9]{64}/);
	});

	it("maps /api exactly once and disables classroom access logs", () => {
		const proxy = repositoryFile("deploy/nginx.conf");
		const hostProxy = repositoryFile("deploy/host-nginx.conf.example");

		expect(proxy).toContain("location = /api");
		expect(proxy).toContain("location /api/");
		expect(proxy).toContain("proxy_pass http://api:3008/;");
		expect(proxy).toContain("proxy_buffering off;");
		expect(proxy).toContain("access_log off;");
		expect(proxy).toContain("absolute_redirect off;");
		expect(proxy).not.toContain(" combined");
		expect(proxy.match(/add_header Strict-Transport-Security/g)).toHaveLength(3);
		expect(proxy.match(/add_header X-Content-Type-Options/g)).toHaveLength(3);
		expect(proxy.match(/add_header Referrer-Policy/g)).toHaveLength(3);
		expect(proxy.match(/add_header Permissions-Policy/g)).toHaveLength(3);
		expect(proxy.match(/add_header X-Frame-Options/g)).toHaveLength(3);
		expect(proxy).toContain("proxy_set_header X-Forwarded-For $http_x_forwarded_for;");
		expect(proxy).toContain("try_files $uri $uri/ =404;");
		expect(proxy).not.toContain("try_files $uri $uri/ /index.html;");
		expect(hostProxy).toContain("proxy_set_header X-Forwarded-For $remote_addr;");
		expect(hostProxy.match(/access_log off;/g)).toHaveLength(2);
		expect(hostProxy).not.toContain(" combined");
		expect(hostProxy).toContain("listen 80;");
		expect(hostProxy).toContain("return 301 https://cs.avasan.org$request_uri;");
		expect(hostProxy).toContain("proxy_request_buffering off;");
		expect(hostProxy).toContain("proxy_buffering off;");
	});

	it("publishes one non-cacheable release identity for the site and API", () => {
		const compose = repositoryFile("compose.production.yml");
		const api = composeService(compose, "api");
		const frontendDockerfile = repositoryFile("Dockerfile");
		const apiDockerfile = repositoryFile("back-end/Dockerfile");
		const frontendReleaseWriter = repositoryFile(
			"front-end/scripts/write-release-metadata.mjs"
		);
		const netlify = repositoryFile("netlify.toml");
		const proxy = repositoryFile("deploy/nginx.conf");
		const server = repositoryFile("back-end/src/server.ts");
		const postDeployWorkflow = repositoryFile(
			".github/workflows/post-deploy.yml"
		);
		const httpSmokeClient = repositoryFile("scripts/http-smoke-client.mjs");
		const productionSmoke = repositoryFile("scripts/post-deploy-smoke.mjs");
		const rootPackage = JSON.parse(repositoryFile("package.json")) as {
			version: string;
		};

		expect(rootPackage.version).toBe("1.0.0");
		expect(compose.match(/CS_RELEASE_VERSION: \$\{CS_RELEASE_VERSION:-1[.]0[.]0\}/g))
			.toHaveLength(2);
		expect(compose.match(/SOURCE_REVISION: \$\{SOURCE_REVISION:-unknown\}/g))
			.toHaveLength(2);
		expect(api).not.toContain("\n        environment:\n            SOURCE_REVISION:");
		expect(frontendDockerfile).toContain("ARG CS_RELEASE_VERSION=1.0.0");
		expect(frontendDockerfile).toContain("ARG SOURCE_REVISION=unknown");
		expect(apiDockerfile).toContain("ARG CS_RELEASE_VERSION=1.0.0");
		expect(apiDockerfile).toContain("ARG SOURCE_REVISION=unknown");
		expect(frontendReleaseWriter).toContain(
			'environment.COMMIT_REF?.trim()'
		);
		expect(frontendReleaseWriter).toContain(
			"const sourceRevisionPattern = /^(?:[0-9a-f]{40}|unknown)$/;"
		);
		expect(proxy).toContain('/release.json "no-store";');
		expect(proxy).toContain("location = /release.json");
		expect(netlify).toContain('for = "/release.json"');
		expect(netlify).toContain('Cache-Control = "no-store"');
		expect(server).toContain('app.get("/release"');
		expect(server).toContain('res.set("Cache-Control", "no-store")');
		expect(productionSmoke).toContain('releaseMetadata("/release.json")');
		expect(productionSmoke).toContain('releaseMetadata("/api/release")');
		expect(productionSmoke).toContain(
			"The public site and API report different release identities."
		);
		expect(productionSmoke).not.toContain("fetch(");
		expect(httpSmokeClient).toContain('import http from "node:http"');
		expect(httpSmokeClient).toContain('import https from "node:https"');
		expect(httpSmokeClient).toContain("MAX_SAME_ORIGIN_REDIRECTS = 5");
		expect(httpSmokeClient).toContain(
			"Refused cross-origin smoke-test redirect"
		);
		expect(httpSmokeClient).toContain("Caused by:");
		expect(postDeployWorkflow).toContain("workflow_dispatch:");
		expect(postDeployWorkflow).toContain("expected_release:");
		expect(postDeployWorkflow).toContain("expected_revision:");
		expect(postDeployWorkflow).toContain("npm run verify:production");
	});

	it("keeps privacy features off in the checked-in deployment template", () => {
		const environment = repositoryFile("deploy/cs.env.example");
		const compose = repositoryFile("compose.production.yml");
		const api = composeService(compose, "api");
		const adminTools = composeService(compose, "admin-tools");
		const netlify = repositoryFile("netlify.toml");

		expect(environment).toContain("CLASSROOM_PRIVACY_APPROVED=false");
		expect(environment).toContain("STUDENT_ACCOUNTS_ENABLED=false");
		expect(environment).toContain("STUDENT_OAUTH_ENABLED=false");
		expect(environment).toContain("CLASSROOM_ANALYTICS_COLLECTION_ENABLED=false");
		expect(environment).toContain("VITE_CLASSROOM_PRIVACY_APPROVED=false");
		expect(environment).toContain("VITE_CLASSROOM_USAGE_ENABLED=false");
		expect(environment).not.toContain("CLASSROOM_ANALYTICS_SERVICE_KEY");
		expect(compose).toContain('TRUST_PROXY_HOPS: "1"');
		expect(compose).toContain("CLASSROOM_ORIGIN: https://cs.avasan.org");
		expect(compose).toContain(
			"MONGODB_URI: mongodb://${MONGO_APP_USERNAME:?set MONGO_APP_USERNAME}:${MONGO_APP_PASSWORD:?set MONGO_APP_PASSWORD}@mongo:27017/cs-avasan-org?authSource=cs-avasan-org"
		);
		expect(api).not.toContain("MONGO_ROOT_");
		expect(adminTools).not.toContain("MONGO_ROOT_");
		expect(environment).toContain("MONGO_APP_USERNAME=cs_avasan_app");
		expect(environment).toContain("MONGO_APP_PASSWORD=");
		expect(netlify).toContain('from = "/api/*"');
		expect(netlify).toContain("status = 404");
		expect(netlify).not.toContain('to = "/index.html"');
		expect(netlify).toContain('VITE_STUDENT_ACCOUNTS_ENABLED = "false"');
		expect(netlify).toContain('for = "/*"');
		expect(netlify).toContain('X-Frame-Options = "DENY"');
		expect(netlify).toContain('NODE_VERSION = "24.18.0"');
	});

	it("builds separate immutable frontend and API images from this source", () => {
		const dockerIgnore = repositoryFile(".dockerignore");
		const frontendDockerfile = repositoryFile("Dockerfile");
		const apiDockerfile = repositoryFile("back-end/Dockerfile");
		const continuousIntegration = repositoryFile(".github/workflows/ci.yml");
		const readme = repositoryFile("README.md");
		const mongoInit = repositoryFile("deploy/mongo-init/01-create-app-user.js");
		const environmentVerifier = repositoryFile("scripts/verify-deploy-env-permissions.sh");

		expect(dockerIgnore).toContain("deploy/cs.env");
		expect(dockerIgnore).toContain("**/.env.*");
		expect(frontendDockerfile).toContain("COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf");
		expect(frontendDockerfile).toContain("ARG VITE_CLASSROOM_PRIVACY_APPROVED=false");
		expect(frontendDockerfile).toContain("npm install --global npm@11.16.0");
		expect(frontendDockerfile).toMatch(/FROM nginxinc\/nginx-unprivileged:stable-alpine@sha256:[a-f0-9]{64}/);
		expect(frontendDockerfile).toMatch(/FROM node:24[.]18[.]0-alpine@sha256:[a-f0-9]{64}/);
		expect(apiDockerfile).toContain("npm install --global npm@11.16.0");
		expect(continuousIntegration.match(/npm i -g npm@11[.]16[.]0/g)).toHaveLength(8);
		expect(apiDockerfile).toMatch(/FROM node:24[.]18[.]0-alpine@sha256:[a-f0-9]{64}/);
		expect(apiDockerfile).toContain("npm run -w back-end build");
		expect(apiDockerfile).toContain('CMD ["node", "back-end/dist/server.js"]');
		expect(apiDockerfile).toContain("FROM npm-stage AS admin-stage");
		expect(apiDockerfile).toContain('CMD ["npm", "run", "-w", "back-end", "create-admin-ts"]');
		expect(continuousIntegration).toContain(
			"docker compose --env-file deploy/cs.env --profile tools -f compose.production.yml config --quiet"
		);
		expect(continuousIntegration).toContain(
			"docker compose --env-file deploy/cs.env --profile tools -f compose.production.yml build"
		);
		expect(continuousIntegration).toContain("up --detach --wait --no-build web");
		expect(continuousIntegration).toContain("down --volumes --remove-orphans");
		expect(continuousIntegration).toContain('"${origin}/api/readyz"');
		expect(continuousIntegration).toContain("SOURCE_REVISION: ${{ github.sha }}");
		expect(continuousIntegration).toContain("CS_EXPECTED_REVISION=\"${SOURCE_REVISION}\"");
		expect(continuousIntegration).toContain("npm run verify:production");
		expect(continuousIntegration).toContain('"${origin}/__cs-avasan-deployment-probe-missing"');
		expect(continuousIntegration).toContain('unknown_status}" = "404"');
		expect(continuousIntegration).toContain('student_status}" = "404"');
		expect(continuousIntegration).toContain("deprecationwarning|unhandledrejection|uncaughtexception");
		expect(readme).toContain("run --rm admin-tools npm run -w back-end create-admin-ts");
		expect(readme).toContain("install -m 600 deploy/cs.env.example deploy/cs.env");
		expect(readme).toContain("uses TypeScript source in the isolated tools image");
		expect(environmentVerifier).toContain("permissions must be 600");
		expect(mongoInit).toContain('{ role: "readWrite", db: applicationDatabaseName }');
		expect(mongoInit).not.toContain('role: "dbAdmin"');
		expect(mongoInit).not.toContain('role: "root"');
	});

	it("provides a confirmed non-HTTP analytics deletion operation", () => {
		const packageManifest = repositoryFile("back-end/package.json");
		const purgeCommand = repositoryFile("back-end/src/purge-classroom-analytics.ts");
		const runbook = repositoryFile("docs/privacy-operations.md");
		const server = repositoryFile("back-end/src/server.ts");

		expect(packageManifest).toContain('"purge-classroom-analytics-ts"');
		expect(purgeCommand).toContain("--confirm-delete-all-classroom-analytics");
		expect(runbook).toContain("purge-classroom-analytics-ts -- --confirm-delete-all-classroom-analytics");
		expect(server).not.toContain("purgeClassroomAnalyticsRecords");
	});

	it("does not expose database ping details through readiness", () => {
		const server = repositoryFile("back-end/src/server.ts");

		expect(server).toContain('error: "db-ping-failed"');
		expect(server).toContain('usingVault: mongoConnection.source === "vault"');
		expect(server).not.toContain("error instanceof Error ? error.message");
	});
});
