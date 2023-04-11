import {join} from 'node:path';
import {Express} from 'express';
import vhost from 'vhost';
import {Project, Fs} from '~/services';
import {subdomainNotFound} from './subdomainNotFound';

/**
 * Check and init routes for subdomains
 */
export const setSubdomainsRoutes = async (server: Express): Promise<void> => {
	const {
		env: {HOST},
		config: {apps},
	} = Project.getInstance<Project>();

	for (const app of apps) {
		const entry = Fs.getBackendEntryPoint(app);
		const exists = await Fs.exists(Fs.rootPath, entry);

		if (!exists) {
			server.use(vhost(`${app}.${HOST}`, subdomainNotFound(app)));
			continue;
		}

		const {load} = await import(join(Fs.rootPathDi, entry));
		server.use(vhost(`${app}.${HOST}`, load()));
	}
};
