import {Env} from './Env';
import {Config} from './Config';
import {CliArgs} from './CliArgs';

/**
 * Boot input parameters
 */
export type Boot = {
	readonly env: Env,
	readonly config: Config,
	readonly cliArgs: CliArgs,
};
