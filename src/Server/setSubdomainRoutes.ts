import {join} from 'node:path';
import type {Express} from 'express';
import vhost from 'vhost';
import {Fs, type Project} from '~/services';
import {global404} from './global404';

/**
 * Check and init routes for subdomains
 */
export const setSubdomainsRoutes = async (server: Express, project: Project): Promise<void> => {
	const {
		env: {HOST},
		flatApps,
	} = project;

	for (const app of flatApps) {
		const entry = Fs.getBackendEntryPoint(app);
		const exists = await Fs.exists(Fs.rootPath, entry);

		if (!exists) {
			server.use(vhost(`${app}.${HOST}`, await global404(app)));
			continue;
		}

		const {load} = await import(join(Fs.rootPathDi, entry));
		server.use(vhost(`${app}.${HOST}`, await load(app)));
	}
};
