import process from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_PASSWORD_RESET_CONFIRMATION } from "../src/security/adminPasswordRecovery.js";

const mocks = vi.hoisted(() => ({
	connect: vi.fn(),
	disconnect: vi.fn(),
	question: vi.fn(),
	reset: vi.fn(),
	readMongoSecret: vi.fn(),
	connection: { readyState: 0, db: { databaseName: "cs-avasan-org" } }
}));

vi.mock("mongoose", () => ({
	default: {
		connect: mocks.connect,
		disconnect: mocks.disconnect,
		connection: mocks.connection
	}
}));
vi.mock("readline-sync", () => ({ question: mocks.question }));
vi.mock("../src/services/adminPasswordRecovery.js", () => ({
	resetJulioAdminPassword: mocks.reset
}));
vi.mock("../src/vaultClient.js", () => ({
	readMongoSecret: mocks.readMongoSecret
}));

const originalArgv = process.argv;
const originalArguments = [...process.argv];
const originalExitCode = process.exitCode;
const originalInputTty = Object.getOwnPropertyDescriptor(
	process.stdin,
	"isTTY"
);
const originalOutputTty = Object.getOwnPropertyDescriptor(
	process.stdout,
	"isTTY"
);
const passphrase = "a private replacement passphrase";

function setTerminal(interactive: boolean) {
	Object.defineProperty(process.stdin, "isTTY", {
		value: interactive,
		configurable: true
	});
	Object.defineProperty(process.stdout, "isTTY", {
		value: interactive,
		configurable: true
	});
}

beforeEach(() => {
	vi.resetModules();
	vi.resetAllMocks();
	for (const name of [
		"VAULT_ADDR",
		"VAULT_ROLE_ID",
		"VAULT_SECRET_ID",
		"VAULT_MONGODB_SECRET_PATH"
	]) {
		vi.stubEnv(name, "");
	}
	vi.stubEnv(
		"MONGODB_URI",
		"mongodb://classroom@mongo/cs-avasan-org?authSource=cs-avasan-org"
	);
	process.argv = originalArgv;
	process.argv.splice(
		0,
		process.argv.length,
		"node",
		"reset-admin-password.ts",
		ADMIN_PASSWORD_RESET_CONFIRMATION
	);
	process.exitCode = undefined;
	setTerminal(true);
	mocks.connection.readyState = 0;
	mocks.connection.db.databaseName = "cs-avasan-org";
	mocks.connect.mockImplementation(async () => {
		mocks.connection.readyState = 1;
	});
	mocks.disconnect.mockImplementation(async () => {
		mocks.connection.readyState = 0;
	});
	mocks.question
		.mockReturnValueOnce("julio@example.test")
		.mockReturnValueOnce(passphrase)
		.mockReturnValueOnce(passphrase);
	mocks.reset.mockResolvedValue(undefined);
	vi.spyOn(console, "log").mockImplementation(() => {});
	vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
	process.argv = originalArgv;
	process.argv.splice(0, process.argv.length, ...originalArguments);
	process.exitCode = originalExitCode;
	if (originalInputTty)
		Object.defineProperty(process.stdin, "isTTY", originalInputTty);
	else Reflect.deleteProperty(process.stdin, "isTTY");
	if (originalOutputTty)
		Object.defineProperty(process.stdout, "isTTY", originalOutputTty);
	else Reflect.deleteProperty(process.stdout, "isTTY");
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

describe("Admin password recovery CLI without a real database", () => {
	it("confirms hidden replacement input and announces revoked sessions only after success", async () => {
		await import("../src/reset-admin-password.js");
		await vi.waitFor(() =>
			expect(mocks.disconnect).toHaveBeenCalledTimes(1)
		);
		expect(mocks.question).toHaveBeenCalledTimes(3);
		for (const [, options] of mocks.question.mock.calls.slice(1)) {
			expect(options).toEqual({
				hideEchoBack: true,
				mask: "",
				keepWhitespace: true
			});
		}
		expect(mocks.reset).toHaveBeenCalledWith(
			"julio@example.test",
			passphrase,
			passphrase
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining("All previous Admin sessions are revoked")
		);
		expect(console.error).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
	});

	it("rejects piped input before connection or credential prompts", async () => {
		setTerminal(false);
		await import("../src/reset-admin-password.js");
		await vi.waitFor(() => expect(process.exitCode).toBe(1));
		expect(mocks.connect).not.toHaveBeenCalled();
		expect(mocks.question).not.toHaveBeenCalled();
		expect(mocks.reset).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining("interactive terminal")
		);
	});

	it("refuses a mismatched connected database before password prompts or any account mutation", async () => {
		mocks.connection.db.databaseName = "classes";
		await import("../src/reset-admin-password.js");
		await vi.waitFor(() =>
			expect(mocks.disconnect).toHaveBeenCalledTimes(1)
		);
		expect(mocks.question).not.toHaveBeenCalled();
		expect(mocks.reset).not.toHaveBeenCalled();
		expect(console.log).not.toHaveBeenCalled();
		expect(process.exitCode).toBe(1);
	});

	it("suppresses driver credentials and never announces success after a connection failure", async () => {
		mocks.connect.mockRejectedValueOnce(
			new Error(
				"driver mongodb://secret-user:secret-password@mongo/cs-avasan-org"
			)
		);
		await import("../src/reset-admin-password.js");
		await vi.waitFor(() => expect(process.exitCode).toBe(1));
		expect(mocks.question).not.toHaveBeenCalled();
		expect(mocks.reset).not.toHaveBeenCalled();
		expect(console.log).not.toHaveBeenCalled();
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining("no success was confirmed")
		);
		expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(
			/secret-user|secret-password|mongodb:\/\//
		);
	});

	it("disconnects after failed reset without logging the password or underlying failure", async () => {
		mocks.reset.mockRejectedValueOnce(
			new Error(`credential failure ${passphrase}`)
		);
		await import("../src/reset-admin-password.js");
		await vi.waitFor(() =>
			expect(mocks.disconnect).toHaveBeenCalledTimes(1)
		);
		expect(process.exitCode).toBe(1);
		expect(console.log).not.toHaveBeenCalled();
		expect(
			JSON.stringify(vi.mocked(console.error).mock.calls)
		).not.toContain(passphrase);
	});
});
