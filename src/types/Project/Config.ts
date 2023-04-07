/**
 * Project config from the builder
 */
export type Config = {
	readonly projectName: string,
	readonly projectRootDirName: string,
	readonly remoteRepositoryUri: string,
	readonly defaultApp: string,
	readonly apps: string[],
	readonly noAuthApps: string[],
	readonly parts: {
		readonly common: string[],
		readonly app: string[],
	},
};
