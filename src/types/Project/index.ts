import {Config as _Config} from './Config';
import {Env as _Env} from './Env';
import {CliArgs as _CliArgs} from './CliArgs';
import {Boot as _Boot} from './Boot';
import {Modes as _Modes} from './Modes';

/**
 * Project entities
 */
export namespace Project {
	export type Config = _Config;
	export type Env = _Env;
	export type CliArgs = _CliArgs;
	export type Boot = _Boot;
	export import Modes = _Modes;
}
