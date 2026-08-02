import type {
	MongoConnectionEnvironment,
	MongoConnectionSelection
} from "./mongoConnection.js";
import { selectMongoConnection } from "./mongoConnection.js";

export const CLASSROOM_ANALYTICS_PURGE_CONFIRMATION
	= "--confirm-delete-all-classroom-analytics";
export const CLASSROOM_ANALYTICS_DATABASE_NAME = "cs-avasan-org";

export interface ClassroomAnalyticsPurgeEnvironment
	extends MongoConnectionEnvironment {
	CLASSROOM_ANALYTICS_COLLECTION_ENABLED?: string;
}

type ReadMongoSecret = () => Promise<{ uri: string }>;

export class ClassroomAnalyticsPurgeRefusal extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ClassroomAnalyticsPurgeRefusal";
	}
}

export function requireExactClassroomAnalyticsPurgeConfirmation(
	arguments_: readonly string[]
): void {
	if (
		arguments_.length !== 1
		|| arguments_[0] !== CLASSROOM_ANALYTICS_PURGE_CONFIRMATION
	) {
		throw new ClassroomAnalyticsPurgeRefusal(
			`Refusing permanent deletion without exactly ${CLASSROOM_ANALYTICS_PURGE_CONFIRMATION}.`
		);
	}
}

export function requireClassroomAnalyticsCollectionDisabled(
	value: string | undefined
): void {
	if (value?.trim().toLowerCase() !== "false") {
		throw new ClassroomAnalyticsPurgeRefusal(
			"CLASSROOM_ANALYTICS_COLLECTION_ENABLED must be explicitly false before permanent deletion."
		);
	}
}

export function requireClassroomAnalyticsDatabase(
	databaseName: string | undefined
): void {
	if (databaseName !== CLASSROOM_ANALYTICS_DATABASE_NAME) {
		throw new ClassroomAnalyticsPurgeRefusal(
			`Refusing permanent deletion unless the connected database is exactly ${CLASSROOM_ANALYTICS_DATABASE_NAME}.`
		);
	}
}

export async function selectClassroomAnalyticsPurgeConnection(
	arguments_: readonly string[],
	environment: ClassroomAnalyticsPurgeEnvironment,
	readMongoSecret: ReadMongoSecret
): Promise<MongoConnectionSelection> {
	requireExactClassroomAnalyticsPurgeConfirmation(arguments_);
	requireClassroomAnalyticsCollectionDisabled(
		environment.CLASSROOM_ANALYTICS_COLLECTION_ENABLED
	);
	return selectMongoConnection(environment, readMongoSecret);
}
