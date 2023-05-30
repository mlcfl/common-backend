/**
 * Project config from the builder
 */
type AppOptions = {
	readonly auth: boolean;
	readonly parts: string[];
};

export type Config = {
	readonly projectName: string;
	readonly projectRootDirName: string;
	readonly remoteRepositoryUri: string;
	readonly defaultApp: string;
	readonly apps: (string | [string, AppOptions])[];
	readonly parts: {
		readonly common: string[];
		readonly app: string[];
	};
};
