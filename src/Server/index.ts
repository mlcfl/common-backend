import express, {type Express} from 'express';
import {Project} from '~/services';
import {Project as TProject} from '~/types';
import {ExpressMiddlewares} from '~/ExpressMiddlewares';
import {setDefaultRoute} from './setDefaultRoute';
import {setSubdomainsRoutes} from './setSubdomainRoutes';
import {global404} from './global404';
import {globalErrorHandler} from './globalErrorHandler';
import {getHelmetConfig} from './getHelmetConfig';

/**
 * Project main server
 */
export class Server {
	private _project: Project;
	private _server: Express;
	private _isLocalhost: boolean;

	constructor(params: TProject.Boot) {
		this._project = Project.getInstance<Project>();
		this._project.init(params);
		this._server = express();
		this._isLocalhost = this._project.isLocalhost();

		this._setSubdomainOffset();
	}

	/**
	 * Constructor can't be async, so make async calls here
	 */
	async init(): Promise<this> {
		this._applyMiddlewaresBeforeRoutes();
		await this._initRoutes();
		this._applyMiddlewaresAfterRoutes();

		return this;
	}

	/**
	 * Start server listening
	 */
	async listen(): Promise<number> {
		const {env: {SERVER_PORT}} = this._project;

		return await new Promise((resolve, reject) => {
			this._server
				.listen(SERVER_PORT)
				.once('listening', resolve.bind(null, SERVER_PORT))
				.once('error', reject);
		});
	}

	/**
	 * Correction for subdomains
	 */
	private _setSubdomainOffset(): void {
		this._server.set('subdomain offset', this._isLocalhost ? 1 : 2);
	}

	/**
	 * Write express middlewares here to apply it before routing initialization.
	 * Common middlewares. Do not repeat them inside applications, it's redundant.
	 */
	private _applyMiddlewaresBeforeRoutes(): void {
		const {env: {HOST, SERVER_PORT}} = this._project;

		const helmet = ExpressMiddlewares.helmet(getHelmetConfig(this._project));
		this._server.use(helmet);

		// Hosts whitelist for DNS rebinding protection
		const host = this._isLocalhost ? `${HOST}:${SERVER_PORT}` : `${HOST}`;
		const hosts = [new RegExp(`^(?:.*\\.)?${host}$`)];
		this._server.use(ExpressMiddlewares.dnsRebinding({hosts}));
	}

	/**
	 * Initialize project routes for subdomains
	 */
	private async _initRoutes(): Promise<void> {
		await setDefaultRoute(this._server, this._project);
		await setSubdomainsRoutes(this._server, this._project);
	}

	/**
	 * Write express middlewares here to apply it after routing initialization
	 */
	private _applyMiddlewaresAfterRoutes(): void {
		// Global 404 (subdomain or path not found)
		this._server.use(global404());

		// Global error handler
		this._server.use(globalErrorHandler());
	}
}
