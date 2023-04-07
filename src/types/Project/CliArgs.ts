import {Modes} from './Modes';

/**
 * Boot cli arguments (from the builder Cli class)
 */
export type CliArgs = {
	readonly include?: string[];
	readonly exclude?: string[];
	readonly includeParts?: string[];
	readonly excludeParts?: string[];
	readonly strict?: boolean;
	readonly mode: Modes;
	readonly watch?: boolean;// in "start:dev --watch" mode
};
