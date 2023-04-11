import express from 'express';
import {Project} from './services';
import {Project as TProject} from './types';
import {middlewareHelmet, middlewareDnsRebinding} from './express-middlewares/security';
import {setDefaultRoute} from './boot/setDefaultRoute';
import {setSubdomainsRoutes} from './boot/setSubdomainsRoutes';
import {subdomainNotFound} from './boot/subdomainNotFound';

/**
 * Entry point to the entire project
 */
export const boot = async (params: TProject.Boot): Promise<void> => {
	const project = Project.getInstance<Project>();
	project.init(params);

	const {env: {HOST, SERVER_PORT}} = project;
	const isLocalhost = project.isLocalhost();
	const server = express();

	// Hosts whitelist for DNS rebinding protection
	const host = isLocalhost ? `${HOST}:${SERVER_PORT}` : `${HOST}`;
	const hosts = [new RegExp(`^(?:.*\\.)?${host}$`)];

	server.set('subdomain offset', isLocalhost ? 1 : 2);

	// Common middlewares. Do not repeat them inside applications, it's redundant.
	server.use(middlewareHelmet());
	server.use(middlewareDnsRebinding({hosts}));

	// Init project routes for subdomains
	await setDefaultRoute(server);
	await setSubdomainsRoutes(server);

	// 404
	server.use(subdomainNotFound());

	server.listen(SERVER_PORT, () => {
		console.log(`Server listening on port ${SERVER_PORT}.`);
	});
};
