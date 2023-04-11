import {Singleton} from 'common/all/patterns';
import {Project as TProject} from '~/types';

/**
 * This class is responsible for the main project things (e.g. env configuration, project configuration, cli arguments)
 */
export class Project extends Singleton {
	private _env!: TProject.Env;
	private _config!: TProject.Config;
	private _cliArgs!: TProject.CliArgs;
	private _wasInited = false;

	/**
	 * Get env config
	 */
	get env(): TProject.Env {
		return this._env;
	}

	/**
	 * Get project config
	 */
	get config(): TProject.Config {
		return this._config;
	}

	/**
	 * Get cli arguments
	 *
	 * Highly recommended not to use this, because I don't see any options when you need it
	 */
	get cliArgs(): TProject.CliArgs {
		return this._cliArgs;
	}

	/**
	 * Init boot configuration object
	 */
	init({env, config, cliArgs}: TProject.Boot): this {
		if (this._wasInited) {
			throw new Error('The Project class has already been initialized. Do not use this method outside the "boot" function or the second time.');
		}

		this._env = env;
		this._config = config;
		this._cliArgs = cliArgs;

		this._compareConfigs();
		this._wasInited = true;

		return this;
	}

	/**
	 * Is project started in development mode?
	 */
	isDev(): boolean {
		return this._env.MODE === 'development';
	}

	/**
	 * Is project started in test mode?
	 */
	isTest(): boolean {
		return this._env.MODE === 'test';
	}

	/**
	 * Is project started in production mode?
	 */
	isProd(): boolean {
		return this._env.MODE === 'production';
	}

	/**
	 * Is env host === localhost
	 */
	isLocalhost(): boolean {
		return this._env.HOST === 'localhost';
	}

	/**
	 * Compare env mode vs cli args mode
	 */
	private _compareConfigs(): void {
		const modes = TProject.Modes;
		const {mode} = this._cliArgs;
		const isDev = this.isDev() && mode === modes.Dev;
		const isTest = this.isTest() && mode === modes.Test;
		const isProd = this.isProd() && mode === modes.Prod;

		if (!isProd && !isTest && !isDev) {
			throw new Error(`Invalid project configuration. The project has been started in "${mode}" mode, but .env is for "${this._env.MODE}" mode.`);
		}
	}
}
