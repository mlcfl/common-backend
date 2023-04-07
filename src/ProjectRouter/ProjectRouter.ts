import {Singleton} from 'common/all/patterns';
import {Project} from '~/types';
import {ProjectRouterError} from './ProjectRouterError';

/**
 * Router on the project level (not on the application level)
 */
export class ProjectRouter extends Singleton {
	private _config: Project.Config | null = null;

	/**
	 * Set configuration object
	 */
	setConfig(config: Project.Config): this {
		this._config = config;
		return this;
	}

	/**
	 * Return requested application
	 */
	getApp(subdomains: string[]): string {
		if (!this._config) {
			throw new ProjectRouterError('The configuration was not provided. Call "setConfig" before this method.');
		}

		if (!subdomains.length) {
			return this._config.defaultApp;
		}

		const [app] = subdomains;
		const {apps} = this._config;

		if (apps.includes(app)) {
			return app;
		}

		throw new ProjectRouterError(`Invalid application "${app}". Possible values: "${apps.join(', ')}"`);
	}
}
