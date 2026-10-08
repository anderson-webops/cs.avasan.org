import type {
	MongoConnectionEnvironment,
	MongoConnectionSelection
} from "./mongoConnection.js";
import { selectMongoConnection } from "./mongoConnection.js";

export const ADMIN_PASSWORD_RESET_CONFIRMATION
	= "--confirm-reset-julio-password";
export const ADMIN_PASSWORD_RECOVERY_DATABASE = "cs-avasan-org";
const ADMIN_PASSWORD_RECOVERY_VAULT_PATH = "secret/data/cs.avasan.org/mongodb";

export interface AdminPasswordRecoveryEnvironment extends MongoConnectionEnvironment {
	VAULT_MONGODB_SECRET_PATH?: string;
}

export class AdminPasswordRecoveryRefusal extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AdminPasswordRecoveryRefusal";
	}
}

export function requireAdminPasswordResetConfirmation(
	arguments_: readonly string[],
	interactive: boolean
): void {
	if (
		arguments_.length !== 1
		|| arguments_[0] !== ADMIN_PASSWORD_RESET_CONFIRMATION
	) {
		throw new AdminPasswordRecoveryRefusal(
			`Refusing teacher password recovery without exactly ${ADMIN_PASSWORD_RESET_CONFIRMATION}.`
		);
	}
	if (!interactive) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery requires an interactive terminal; passwords cannot be supplied as arguments or piped input."
		);
	}
}

export function requireAdminPasswordRecoveryDatabase(
	databaseName: string | undefined
): void {
	if (databaseName !== ADMIN_PASSWORD_RECOVERY_DATABASE) {
		throw new AdminPasswordRecoveryRefusal(
			`Refusing teacher password recovery unless the connected database is exactly ${ADMIN_PASSWORD_RECOVERY_DATABASE}.`
		);
	}
}

/** Use the same fail-closed credential selection as the API, confined to this fork. */
export async function selectAdminPasswordRecoveryConnection(
	arguments_: readonly string[],
	interactive: boolean,
	environment: AdminPasswordRecoveryEnvironment,
	readMongoSecret: () => Promise<{ uri: string }>
): Promise<MongoConnectionSelection> {
	requireAdminPasswordResetConfirmation(arguments_, interactive);
	const vaultRequested = [
		environment.VAULT_ADDR,
		environment.VAULT_ROLE_ID,
		environment.VAULT_SECRET_ID
	].some(value => Boolean(value?.trim()));
	if (
		vaultRequested
		&& (environment.VAULT_MONGODB_SECRET_PATH?.trim()
			|| ADMIN_PASSWORD_RECOVERY_VAULT_PATH)
		!== ADMIN_PASSWORD_RECOVERY_VAULT_PATH
	) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery requires the fork-specific Vault MongoDB secret path."
		);
	}
	const connection = await selectMongoConnection(
		environment,
		readMongoSecret
	);
	let parsed: URL;
	try {
		parsed = new URL(connection.uri);
	}
	catch {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery requires a valid fork-specific MongoDB URI."
		);
	}
	if (
		!["mongodb:", "mongodb+srv:"].includes(parsed.protocol)
		|| parsed.pathname !== `/${ADMIN_PASSWORD_RECOVERY_DATABASE}`
		|| parsed.searchParams.getAll("authSource").length !== 1
		|| parsed.searchParams.get("authSource")
		!== ADMIN_PASSWORD_RECOVERY_DATABASE
	) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery requires the fork-specific MongoDB database and authSource."
		);
	}
	return connection;
}
