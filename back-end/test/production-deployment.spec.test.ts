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
		expect(mongo).toContain('- >-\n                    mongosh --quiet --username "$$MONGO_INITDB_ROOT_USERNAME"');
		expect(mongo).toContain("--eval \"quit(db.adminCommand('ping').ok ? 0 : 2)\"");
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
		expect(proxy).toContain("location ^~ /api/");
		expect(proxy).toContain("proxy_pass http://api:3008/;");
		expect(proxy).toContain("proxy_buffering off;");
		expect(proxy).toContain("access_log off;");
		expect(proxy).toContain("absolute_redirect off;");
		expect(proxy).not.toContain(" combined");
		expect(proxy.match(/add_header Strict-Transport-Security/g)).toHaveLength(6);
		expect(proxy.match(/add_header Content-Security-Policy/g)).toHaveLength(6);
		expect(proxy.match(/add_header X-Content-Type-Options/g)).toHaveLength(6);
		expect(proxy.match(/add_header Referrer-Policy/g)).toHaveLength(6);
		expect(proxy.match(/add_header Permissions-Policy/g)).toHaveLength(6);
		expect(proxy.match(/add_header X-Frame-Options/g)).toHaveLength(6);
		expect(proxy.match(/add_header Cross-Origin-Opener-Policy/g)).toHaveLength(6);
		expect(proxy.match(/add_header Cross-Origin-Resource-Policy/g)).toHaveLength(6);
		expect(proxy).toContain("proxy_set_header X-Forwarded-For $http_x_forwarded_for;");
		expect(proxy).toContain("proxy_hide_header Content-Security-Policy;");
		expect(proxy).toContain("proxy_hide_header X-Frame-Options;");
		expect(proxy).toContain("location ^~ /ide/");
		expect(proxy).toContain("location ^~ /python-ide/assets/");
		expect(proxy).toContain("script-src 'self' 'unsafe-inline'; connect-src 'self';");
		expect(proxy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdn.plot.ly;");
		expect(proxy).toContain("connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;");
		expect(proxy).not.toContain("wss:");
		expect(proxy).not.toContain("ws:");
		expect(proxy).not.toContain("blob: https:");
		expect(proxy).toContain("worker-src 'self' blob:");
		expect(proxy).toContain("try_files $uri $uri/ =404;");
		expect(proxy).not.toContain("try_files $uri $uri/ /index.html;");
		expect(proxy).toContain("location ~ ^(.+)/index[.]html$");
		expect(proxy).toContain("if ($request_uri ~ ^(.+)/index[.]html(?:[?]|$))");
		expect(proxy).toContain("if ($request_uri ~ ^/index[.]html(?:[?]|$))");
		expect(proxy).toContain("if ($request_uri ~ ^/ide/index[.]html(?:[?]|$))");
		expect(hostProxy).toContain("proxy_set_header X-Forwarded-For $remote_addr;");
		expect(hostProxy.match(/access_log off;/g)).toHaveLength(2);
		expect(hostProxy).not.toContain(" combined");
		expect(hostProxy).not.toContain("add_header");
		expect(hostProxy).toContain("proxy_pass http://127.0.0.1:8080;");
		expect(hostProxy).toContain("proxy_redirect off;");
		expect(hostProxy).not.toMatch(/^\s*(?:root|alias|try_files)\b/m);
		expect(hostProxy).toContain("listen 80;");
		expect(hostProxy).toContain("return 301 https://cs.avasan.org$request_uri;");
		expect(hostProxy).toContain("proxy_request_buffering off;");
		expect(hostProxy).toContain("proxy_buffering off;");
	});

	it("provides an atomic, single-process native production handoff", () => {
		const environment = repositoryFile("deploy/native/api.env.example");
		const service = repositoryFile("deploy/native/cs-avasan-api.service");
		const nativeProxy = repositoryFile("deploy/native/nginx.conf.example");
		const nativeStandardHeaders = repositoryFile("deploy/native/cs-avasan-security-headers.conf");
		const nativeIdeHeaders = repositoryFile("deploy/native/cs-avasan-ide-security-headers.conf");
		const deployScript = repositoryFile("scripts/deploy-native-release.sh");
		const nativeAnalyticsPurge = repositoryFile(
			"scripts/purge-native-classroom-analytics.sh"
		);
		const rollbackScript = repositoryFile("scripts/rollback-native-release.sh");
		const sourceVerifier = repositoryFile("scripts/verify-native-source.sh");
		const releaseTargetVerifier = repositoryFile(
			"scripts/verify-native-release-target.mjs"
		);
		const runtimePreflight = repositoryFile("scripts/verify-native-runtime-config.mjs");
		const documentation = repositoryFile("docs/native-production-deployment.md");

		expect(environment).toContain("MONGODB_URI=");
		expect(environment).toContain(
			"VAULT_MONGODB_SECRET_PATH=secret/data/cs.avasan.org/mongodb"
		);
		expect(environment).not.toContain("MONGO_ROOT_");
		expect(environment).not.toContain("VITE_");
		expect(environment).toContain("CLASSROOM_PRIVACY_APPROVED=false");
		expect(environment).toContain("STUDENT_ACCOUNTS_ENABLED=false");
		expect(environment).toContain("STUDENT_OAUTH_ENABLED=false");

		expect(service).toContain("User=cs-avasan");
		expect(service.match(/^ExecStart=/gmu)).toHaveLength(1);
		expect(service).toContain("EnvironmentFile=/etc/cs.avasan.org/api.env");
		expect(service).toContain("EnvironmentFile=/srv/cs.avasan.org/current/public-config.env");
		expect(service).toContain("ProtectSystem=strict");
		expect(service).toContain("NoNewPrivileges=true");
		expect(service).toContain("HOST=127.0.0.1");
		expect(service).toContain("PORT=3008");

		expect(nativeProxy).toContain("root /srv/cs.avasan.org/current/public;");
		expect(nativeProxy).toContain("listen 127.0.0.1:8080;");
		expect(nativeProxy).toContain("listen 443 quic;");
		expect(nativeProxy).toContain("listen [::]:443 quic;");
		expect(nativeProxy).toContain("http2 on;");
		expect(nativeProxy).toContain("http3 on;");
		expect(nativeProxy).toContain("quic_retry on;");
		expect(nativeStandardHeaders).toContain("add_header Alt-Svc 'h3=\":443\"; ma=86400' always;");
		expect(nativeIdeHeaders).toContain("add_header Alt-Svc 'h3=\":443\"; ma=86400' always;");
		expect(nativeStandardHeaders).toContain('add_header Cross-Origin-Opener-Policy "same-origin" always;');
		expect(nativeStandardHeaders).toContain('add_header Cross-Origin-Resource-Policy "same-origin" always;');
		expect(nativeIdeHeaders).toContain('add_header Cross-Origin-Opener-Policy "same-origin" always;');
		expect(nativeIdeHeaders).toContain('add_header Cross-Origin-Resource-Policy "same-origin" always;');
		expect(nativeProxy).toContain("proxy_pass http://127.0.0.1:3008/;");
		expect(nativeProxy).toContain("proxy_set_header X-Forwarded-For $remote_addr;");
		expect(nativeProxy).toContain("proxy_hide_header Content-Security-Policy;");
		expect(nativeProxy).toContain("proxy_hide_header X-Frame-Options;");
		expect(nativeProxy).toContain("@cs_avasan_api_not_found");
		expect(nativeProxy).toContain("'{\"message\":\"Not found\"}'");
		expect(nativeProxy).toContain("error_page 404 =404 /404.html;");
		expect(nativeProxy.match(/access_log off;/g)).toHaveLength(2);
		expect(nativeProxy).not.toContain("try_files $uri $uri/ /index.html;");
		expect(nativeProxy).toContain("location ~ ^(.+)/index[.]html$");
		expect(nativeProxy).toContain("if ($request_uri ~ ^(.+)/index[.]html(?:[?]|$))");
		expect(nativeProxy).toContain("if ($request_uri ~ ^/index[.]html(?:[?]|$))");
		expect(nativeProxy).toContain("if ($request_uri ~ ^/ide/index[.]html(?:[?]|$))");

		expect(deployScript).toContain("git -C \"$cs_source_dir\" archive \"$cs_revision\"");
		expect(deployScript).toContain('npm --prefix "$cs_build_source" ci --include=optional --strict-allow-scripts');
		expect(deployScript.match(/runuser --user cs-avasan -- env/g)).toHaveLength(3);
		expect(deployScript).toContain('npm_config_cache="$cs_build_root/npm-cache"');
		expect(deployScript).toContain('export -n "$cs_env_name"');
		expect(deployScript).toContain('export CLASSROOM_PRIVACY_APPROVED="${CLASSROOM_PRIVACY_APPROVED:-false}"');
		expect(deployScript).toContain('export STUDENT_ACCOUNTS_ENABLED="${STUDENT_ACCOUNTS_ENABLED:-false}"');
		expect(deployScript).toContain('export STUDENT_RECORD_RETENTION_DAYS="${STUDENT_RECORD_RETENTION_DAYS:-}"');
		expect(deployScript).toContain("never Mongo, session, OAuth, Vault, or diagnostics");
		expect(deployScript.match(/verify-native-source[.]sh/g)).toHaveLength(2);
		expect(deployScript).toContain(
			"Deployment requires an existing current release symlink for rollback."
		);
		expect(deployScript).toContain(
			"Current release changed while the candidate was prepared."
		);
		expect(deployScript).toContain('fail_activation "systemd daemon reload failed"');
		expect(deployScript).not.toContain("incomplete first activation");
		expect(deployScript).not.toContain('unlink "$cs_current_link"');
		expect(sourceVerifier).toContain("anderson-webops/cs.avasan.org");
		expect(sourceVerifier).toContain("refs/remotes/origin/main^{commit}");
		expect(sourceVerifier).toContain('cat-file -t "refs/tags/$cs_tag"');
		expect(sourceVerifier).not.toMatch(/git[^\n]*fetch/);
		expect(releaseTargetVerifier).toContain(
			"release target must be a real directory, not a symlink"
		);
		expect(releaseTargetVerifier).toContain(
			"release directory name does not match its immutable identity"
		);
		expect(deployScript).toContain('[[ "$(npm --version)" == "11.16.0" ]]');
		expect(deployScript).toContain(
			"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
		);
		expect(deployScript).toContain("Service unit names are invalid.");
		expect(deployScript).toContain("cmp --silent \"$cs_source_artifact\" \"$cs_installed_artifact\"");
		expect(deployScript).toContain(
			'"$(stat -c \'%u:%a\' "$cs_installed_artifact")" == "0:644"'
		);
		expect(deployScript).toContain('mv -T -- "$cs_staging_release" "$cs_final_release"');
		expect(deployScript).toContain("mv -Tf -- \"$cs_next_link\" \"$cs_link_name\"");
		expect(deployScript).toContain("CS_SITE_ORIGIN=http://127.0.0.1:8080");
		expect(deployScript).toContain("restore_previous");
		expect(deployScript).toContain('CS_EXPECTED_RELEASE="$cs_expected_version"');
		expect(deployScript).toContain('CS_EXPECTED_REVISION="$cs_expected_revision"');
		expect(deployScript).toContain('"$cs_previous_version"');
		expect(deployScript).toContain('"$cs_previous_revision"');
		expect(deployScript).toContain(
			"the previous release runtime was restored and verified."
		);
		expect(deployScript).toContain(
			"automatic rollback separately failed with status"
		);
		expect(deployScript).not.toContain("restore_previous >/dev/null 2>&1");
		expect(deployScript).toContain(
			'"$cs_build_source/scripts/purge-native-classroom-analytics.sh"'
		);
		expect(nativeAnalyticsPurge).toContain(
			'cs_confirmation="--confirm-delete-all-classroom-analytics"'
		);
		expect(nativeAnalyticsPurge).toContain(
			'[[ "$(stat -c \'%u:%a\' "$cs_api_env")" == "0:600" ]]'
		);
		expect(nativeAnalyticsPurge).toContain(
			'"$cs_release_dir/scripts/verify-native-runtime-config.mjs"'
		);
		expect(nativeAnalyticsPurge).toContain(
			'CLASSROOM_ANALYTICS_COLLECTION_ENABLED must be explicitly false'
		);
		expect(nativeAnalyticsPurge).toContain(
			'back-end/dist/purge-classroom-analytics.js'
		);
		expect(rollbackScript).toContain("restore_current");
		expect(rollbackScript).toContain(
			"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
		);
		expect(rollbackScript).toContain("Service unit names are invalid.");
		expect(rollbackScript.match(/verify-native-release-target[.]mjs/g)).toHaveLength(2);
		expect(rollbackScript).toContain(
			"Rollback requires current and previous release symlinks."
		);
		expect(rollbackScript).toContain("buildConfig.STUDENT_ACCOUNTS_ENABLED");
		expect(rollbackScript).toContain("CS_SITE_ORIGIN=http://127.0.0.1:8080");
		expect(rollbackScript).toContain('"$cs_current_manifest_version"');
		expect(rollbackScript).toContain('"$cs_current_manifest_revision"');
		expect(rollbackScript).toContain(
			"the original release runtime was restored and verified."
		);
		expect(rollbackScript).not.toContain("restore_current >/dev/null 2>&1");
		expect(runtimePreflight).toContain('parsed.pathname !== "/cs-avasan-org"');
		expect(runtimePreflight).toContain('parsed.searchParams.get("authSource") !== "cs-avasan-org"');
		expect(runtimePreflight).toContain("changed without a frontend rebuild");
		expect(documentation).toContain("do not run native and Compose CS stacks together.");
		expect(documentation).toContain("30–365-day");
	});

	it("publishes one non-cacheable release identity for the site and API", () => {
		const compose = repositoryFile("compose.production.yml");
		const api = composeService(compose, "api");
		const frontendDockerfile = repositoryFile("Dockerfile");
		const apiDockerfile = repositoryFile("back-end/Dockerfile");
		const frontendReleaseWriter = repositoryFile("front-end/scripts/write-release-metadata.mjs");
		const netlify = repositoryFile("netlify.toml");
		const proxy = repositoryFile("deploy/nginx.conf");
		const server = repositoryFile("back-end/src/server.ts");
		const postDeployWorkflow = repositoryFile(".github/workflows/post-deploy.yml");
		const httpSmokeClient = repositoryFile("scripts/http-smoke-client.mjs");
		const productionSmoke = repositoryFile("scripts/post-deploy-smoke.mjs");
		const rootPackage = JSON.parse(repositoryFile("package.json")) as {
			version: string;
		};

		expect(rootPackage.version).toBe("2.7.108");
		expect(compose.match(/CS_RELEASE_VERSION: \$\{CS_RELEASE_VERSION:-2[.]7[.]108\}/g)).toHaveLength(2);
		expect(compose.match(/SOURCE_REVISION: \$\{SOURCE_REVISION:\?set SOURCE_REVISION\}/g)).toHaveLength(2);
		expect(compose).not.toContain("SOURCE_REVISION:-unknown");
		expect(api).not.toContain("\n        environment:\n            SOURCE_REVISION:");
		expect(frontendDockerfile).toContain("ARG CS_RELEASE_VERSION=2.7.108");
		expect(frontendDockerfile).toContain("ARG SOURCE_REVISION=unknown");
		expect(apiDockerfile).toContain("ARG CS_RELEASE_VERSION=2.7.108");
		expect(apiDockerfile).toContain("ARG SOURCE_REVISION=unknown");
		expect(frontendReleaseWriter).toContain("environment.COMMIT_REF?.trim()");
		expect(frontendReleaseWriter).toContain("const sourceRevisionPattern = /^(?:[0-9a-f]{40}|unknown)$/;");
		expect(proxy).toContain('/release.json "no-store";');
		expect(proxy).toContain("location = /release.json");
		expect(netlify).toContain('for = "/release.json"');
		expect(netlify).toContain('Cache-Control = "no-store"');
		expect(server).toContain('app.get("/release"');
		expect(server).toContain("app.use(apiNotFound);");
		expect(server).toContain('mongoose.connection.db?.databaseName !== "cs-avasan-org"');
		expect(server).toContain('res.set("Cache-Control", "no-store")');
		expect(productionSmoke).toContain('releaseMetadata("/release.json")');
		expect(productionSmoke).toContain('releaseMetadata("/api/release")');
		expect(productionSmoke).toContain("const sourceRevisionPattern = /^[0-9a-f]{40}$/;");
		expect(productionSmoke).toContain("CS_EXPECT_STUDENT_ACCOUNTS_ENABLED");
		expect(productionSmoke).toContain("CS_EXPECT_STUDENT_OAUTH_ENABLED");
		expect(productionSmoke).toContain("CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED");
		expect(productionSmoke).toContain(
			'const classroomOrigin = "https://cs.avasan.org";'
		);
		expect(productionSmoke).toContain('event: "__deployment-probe-invalid"');
		expect(productionSmoke).toContain("response details were not logged");
		expect(productionSmoke).toContain('currentSmokePhase = "security headers"');
		expect(productionSmoke).toContain("verifyApiNotFound");
		expect(productionSmoke).toContain("duplicate Content-Security-Policy headers");
		expect(productionSmoke).not.toContain("smokeErrorMessage");
		expect(productionSmoke).toContain('adminRedirect.headers.get("location") === "/admin/"');
		expect(productionSmoke).toContain('["/admin/index.html", "/admin/"]');
		expect(productionSmoke).toContain('"/admin.html"');
		expect(productionSmoke).toContain('"/student-privacy.html"');
		expect(productionSmoke).toContain(
			'["/ide/index.html?course=python-1", "/ide/?course=python-1"]'
		);
		expect(productionSmoke).toContain('"/games/pond-paddlers"');
		expect(productionSmoke).toContain('"/games/crosswalk-critters"');
		expect(productionSmoke).toContain('"/games/machine-workshop"');
		expect(productionSmoke).toContain('"/games/comet-hopper"');
		expect(productionSmoke).toContain('const path = "/api/accounts/login";');
		expect(productionSmoke).toContain('body.message === "Bad credentials"');
		expect(productionSmoke).toContain(
			'currentSmokePhase = "invalid Admin login";'
		);
		expect(productionSmoke).toContain("verifyPondPaddlersBoundary");
		expect(productionSmoke).toContain(
			'"/api/pond-paddlers/rooms/INVALID0/join"'
		);
		expect(productionSmoke).toContain(
			'missingBody.message === "Race unavailable."'
		);
		expect(productionSmoke).toContain('"/python-ide?course=python-1"');
		expect(productionSmoke).toContain('"/python-ide.html?course=python-1"');
		expect(productionSmoke).toContain('"/python-ide/?course=python-1"');
		expect(productionSmoke).toContain(
			'"/bluej?mode=java&course=python-1"'
		);
		expect(productionSmoke).toContain(
			'"/ide/?mode=java&course=python-1"'
		);
		expect(productionSmoke).toContain("verifySecurityHeaders");
		expect(productionSmoke).toContain('validateContentSecurityPolicy(');
		expect(productionSmoke).toContain('["/ide/", "code-ide"]');
		expect(productionSmoke).toContain(
			'["/python-ide/assets/manifest.json", "code-ide"]'
		);
		expect(productionSmoke).toContain('"/graph-sketcher"');
		expect(productionSmoke).toContain('"/graph-sketcher/"');
		expect(productionSmoke).toContain('"/graph-sketcher/index.html"');
		expect(productionSmoke).toContain('"/graph-sketcher.html"');
		expect(productionSmoke).toContain(
			'"/licenses/graphsketcher-omni-source-license.txt"'
		);
		expect(productionSmoke).not.toContain("runProductionGraphSketcherSmoke");
		expect(productionSmoke).toContain("The public site and API report different release identities.");
		expect(productionSmoke).not.toContain("fetch(");
		expect(httpSmokeClient).toContain('import http from "node:http"');
		expect(httpSmokeClient).toContain('import https from "node:https"');
		expect(httpSmokeClient).toContain("MAX_SAME_ORIGIN_REDIRECTS = 5");
		expect(httpSmokeClient).toContain("Refused cross-origin smoke-test redirect");
		expect(httpSmokeClient).toContain("Caused by:");
		expect(postDeployWorkflow).toContain("workflow_dispatch:");
		expect(postDeployWorkflow).toContain("expected_release:");
		expect(postDeployWorkflow).toContain("expected_revision:");
		expect(postDeployWorkflow).toContain("student_accounts_enabled:");
		expect(postDeployWorkflow).toContain("student_oauth_enabled:");
		expect(postDeployWorkflow).toContain("classroom_analytics_collection_enabled:");
		expect(postDeployWorkflow).toContain("npm run verify:production");
	});

	it("keeps privacy features off in the checked-in deployment template", () => {
		const environment = repositoryFile("deploy/cs.env.example");
		const compose = repositoryFile("compose.production.yml");
		const api = composeService(compose, "api");
		const adminTools = composeService(compose, "admin-tools");
		const netlify = repositoryFile("netlify.toml");

		expect(environment).toContain("CLASSROOM_PRIVACY_APPROVED=false");
		expect(environment).toContain("CLASSROOM_PRIVACY_OPERATOR_NOTICE=");
		expect(environment).toContain("CLASSROOM_SERVICE_PROVIDER_NOTICE=");
		expect(environment).toContain("STUDENT_ACCOUNTS_ENABLED=false");
		expect(environment).toContain("STUDENT_OAUTH_ENABLED=false");
		expect(environment).toContain("STUDENT_RECORD_RETENTION_DAYS=");
		expect(environment).toContain("CLASSROOM_ANALYTICS_COLLECTION_ENABLED=false");
		expect(environment).not.toContain("VITE_CLASSROOM_PRIVACY_APPROVED=");
		expect(environment).not.toContain("VITE_STUDENT_ACCOUNTS_ENABLED=");
		expect(environment).not.toContain("VITE_STUDENT_OAUTH_ENABLED=");
		expect(environment).not.toContain("VITE_CLASSROOM_USAGE_ENABLED=");
		expect(environment).not.toContain("CLASSROOM_ANALYTICS_SERVICE_KEY");
		expect(compose).toContain('TRUST_PROXY_HOPS: "1"');
		expect(compose).toContain("CLASSROOM_ORIGIN: https://cs.avasan.org");
		expect(compose).toContain("VITE_STUDENT_RECORD_RETENTION_DAYS: ${STUDENT_RECORD_RETENTION_DAYS:-}");
		expect(compose).toContain("VITE_CLASSROOM_PRIVACY_APPROVED: ${CLASSROOM_PRIVACY_APPROVED:-false}");
		expect(compose).toContain("VITE_STUDENT_ACCOUNTS_ENABLED: ${STUDENT_ACCOUNTS_ENABLED:-false}");
		expect(compose).toContain("VITE_STUDENT_OAUTH_ENABLED: ${STUDENT_OAUTH_ENABLED:-false}");
		expect(compose).toContain("VITE_CLASSROOM_USAGE_ENABLED: ${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}");
		expect(compose).not.toContain("VITE_CLASSROOM_PRIVACY_APPROVED: ${VITE_CLASSROOM_PRIVACY_APPROVED");
		expect(compose).not.toContain("VITE_STUDENT_ACCOUNTS_ENABLED: ${VITE_STUDENT_ACCOUNTS_ENABLED");
		expect(compose).not.toContain("VITE_STUDENT_OAUTH_ENABLED: ${VITE_STUDENT_OAUTH_ENABLED");
		expect(compose).not.toContain("VITE_CLASSROOM_USAGE_ENABLED: ${VITE_CLASSROOM_USAGE_ENABLED");
		expect(compose).toContain("VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE: ${CLASSROOM_PRIVACY_OPERATOR_NOTICE:-}");
		expect(compose).toContain("VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE: ${CLASSROOM_SERVICE_PROVIDER_NOTICE:-}");
		expect(compose).toContain(
			"MONGODB_URI: mongodb://${MONGO_APP_USERNAME:?set MONGO_APP_USERNAME}:${MONGO_APP_PASSWORD:?set MONGO_APP_PASSWORD}@mongo:27017/cs-avasan-org?authSource=cs-avasan-org"
		);
		expect(api).not.toContain("MONGO_ROOT_");
		expect(adminTools).not.toContain("MONGO_ROOT_");
		expect(adminTools).toContain(
			"CLASSROOM_ANALYTICS_COLLECTION_ENABLED: ${CLASSROOM_ANALYTICS_COLLECTION_ENABLED:-false}"
		);
		expect(environment).toContain("MONGO_APP_USERNAME=cs_avasan_app");
		expect(environment).toContain("MONGO_APP_PASSWORD=");
		expect(netlify).toContain('from = "/api/*"');
		expect(netlify).toContain("status = 404");
		expect(netlify).not.toContain('to = "/index.html"');
		expect(netlify).toContain('VITE_STUDENT_ACCOUNTS_ENABLED = "false"');
		expect(netlify).toContain('VITE_STUDENT_RECORD_RETENTION_DAYS = ""');
		expect(netlify).toContain('for = "/*"');
		expect(netlify).toContain('Content-Security-Policy = "default-src');
		expect(netlify).toContain('for = "/ide/*"');
		expect(netlify).toContain('for = "/python-ide/assets/*"');
		expect(netlify).toContain("script-src 'self' 'unsafe-inline'; connect-src 'self';");
		expect(netlify).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://cdn.plot.ly;");
		expect(netlify).toContain("connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;");
		expect(netlify).not.toContain("wss:");
		expect(netlify).not.toContain("ws:");
		expect(netlify).not.toContain("blob: https:");
		expect(netlify).toContain("worker-src 'self' blob:");
		expect(netlify).toContain('X-Frame-Options = "DENY"');
		expect(netlify).toContain('NODE_VERSION = "24.18.0"');
	});

	it("builds separate immutable frontend and API images from this source", () => {
		const dockerIgnore = repositoryFile(".dockerignore");
		const frontendDockerfile = repositoryFile("Dockerfile");
		const apiDockerfile = repositoryFile("back-end/Dockerfile");
		const compose = repositoryFile("compose.production.yml");
		const continuousIntegration = repositoryFile(".github/workflows/ci.yml");
		const readme = repositoryFile("README.md");
		const mongoInit = repositoryFile("deploy/mongo-init/01-create-app-user.js");
		const environmentVerifier = repositoryFile("scripts/verify-deploy-env-permissions.sh");
		const adminProvisioner = repositoryFile("back-end/src/create-admin-user.ts");

		expect(dockerIgnore).toContain("deploy/cs.env");
		expect(dockerIgnore).toContain("**/.env.*");
		expect(frontendDockerfile).toContain("COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf");
		expect(frontendDockerfile).toContain("ARG VITE_CLASSROOM_PRIVACY_APPROVED=false");
		expect(frontendDockerfile).toContain("ARG VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE=");
		expect(frontendDockerfile).toContain("ARG VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE=");
		expect(frontendDockerfile).toContain("ARG VITE_STUDENT_RECORD_RETENTION_DAYS=");
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
		expect(adminProvisioner).toContain("selectMongoConnection(");
		expect(adminProvisioner).toContain("readMongoSecret");
		expect(compose).toMatch(
			/admin-tools:[\s\S]*VAULT_ADDR: \$\{VAULT_ADDR:-\}[\s\S]*VAULT_ROLE_ID: \$\{VAULT_ROLE_ID:-\}/
		);
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
		expect(continuousIntegration).toContain("env -u SOURCE_REVISION docker compose");
		expect(continuousIntegration).toContain('CS_EXPECTED_REVISION="${SOURCE_REVISION}"');
		expect(continuousIntegration).toContain("npm run verify:production");
		expect(continuousIntegration).toContain('"${origin}/__cs-avasan-deployment-probe-missing"');
		expect(continuousIntegration).toContain('unknown_status}" = "404"');
		expect(continuousIntegration).toContain('student_status}" = "404"');
		expect(continuousIntegration).toContain("deprecationwarning|unhandledrejection|uncaughtexception");
		expect(readme).toContain("run --rm admin-tools npm run -w back-end create-admin-ts");
		expect(readme).toContain("install -m 600 deploy/cs.env.example deploy/cs.env");
		expect(readme).toContain("uses TypeScript source in the isolated tools image");
		expect(readme).toContain("must not be promoted to `cs.avasan.org`");
		expect(readme).toContain('CS_EXPECTED_REVISION="${SOURCE_REVISION}"');
		expect(readme).toMatch(/before the deployment\s+timer records success/);
		expect(readme).toContain("must fail without recording success");
		expect(readme).toContain("http://127.0.0.1:8080/ide/");
		expect(readme).toContain("Use the proxy-only example for Compose");
		expect(readme).toContain("same-release native Nginx artifacts");
		expect(readme).toMatch(/do not record the\s+deployment as successful/);
		expect(environmentVerifier).toContain("permissions must be 600");
		expect(mongoInit).toContain('{ role: "readWrite", db: applicationDatabaseName }');
		expect(mongoInit).not.toContain('role: "dbAdmin"');
		expect(mongoInit).not.toContain('role: "root"');
	});

	it("provides a confirmed non-HTTP analytics deletion operation", () => {
		const packageManifest = repositoryFile("back-end/package.json");
		const purgeCommand = repositoryFile("back-end/src/purge-classroom-analytics.ts");
		const runbook = repositoryFile("docs/privacy-operations.md");
		const nativeRunbook = repositoryFile("docs/native-production-deployment.md");
		const server = repositoryFile("back-end/src/server.ts");

		expect(packageManifest).toContain('"purge-classroom-analytics-ts"');
		expect(purgeCommand).toContain("selectClassroomAnalyticsPurgeConnection");
		expect(purgeCommand).toContain("readMongoSecret");
		expect(purgeCommand).toContain("mongoose.connection.db?.databaseName");
		expect(runbook).toContain("purge-classroom-analytics-ts -- --confirm-delete-all-classroom-analytics");
		expect(runbook).toContain(
			"/srv/cs.avasan.org/current/scripts/purge-native-classroom-analytics.sh --confirm-delete-all-classroom-analytics"
		);
		expect(nativeRunbook).toContain(
			"/srv/cs.avasan.org/current/scripts/purge-native-classroom-analytics.sh --confirm-delete-all-classroom-analytics"
		);
		expect(server).not.toContain("purgeClassroomAnalyticsRecords");
	});

	it("does not expose database ping details through readiness", () => {
		const server = repositoryFile("back-end/src/server.ts");

		expect(server).toContain('error: "db-ping-failed"');
		expect(server).toContain('usingVault: mongoConnection.source === "vault"');
		expect(server).not.toContain("error instanceof Error ? error.message");
	});
});
