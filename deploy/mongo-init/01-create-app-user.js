const applicationUsername = process.env.MONGO_APP_USERNAME;
const applicationPassword = process.env.MONGO_APP_PASSWORD;

if (!applicationUsername || !applicationPassword) {
	throw new Error("MONGO_APP_USERNAME and MONGO_APP_PASSWORD are required.");
}

const applicationDatabaseName = "cs-avasan-org";
const applicationDatabase = db.getSiblingDB(applicationDatabaseName);
const applicationRoles = [{ role: "readWrite", db: applicationDatabaseName }];

if (applicationDatabase.getUser(applicationUsername)) {
	applicationDatabase.updateUser(applicationUsername, {
		pwd: applicationPassword,
		roles: applicationRoles
	});
} else {
	applicationDatabase.createUser({
		user: applicationUsername,
		pwd: applicationPassword,
		roles: applicationRoles
	});
}
