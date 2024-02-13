import {join} from 'node:path';
import type {Express, Request, Response} from 'express';
import vhost from 'vhost';
import {Fs, type Project} from '~/services';
import {global404} from './global404';

/**
 * Check and init routes for subdomains
 */
export const setSubdomainsRoutes = async (server: Express, project: Project): Promise<void> => {
	const {
		env: {HOST, SERVER_PORT},
		config: {defaultApp},
		flatApps,
	} = project;

	const redirectHandler = ({protocol}: Request, res: Response) => {
		const host = project.isLocalhost() ? `${HOST}:${SERVER_PORT}` : HOST;
		res.redirect(301, `${protocol}://${host}`);
	};

	for (const app of flatApps) {
		const entry = Fs.getBackendEntryPoint(app);
		const exists = await Fs.exists(Fs.rootPath, entry);

		// Redirect the subdomain to the main domain to avoid the default application being initialized twice
		if (app === defaultApp) {
			server.use(vhost(`${app}.${HOST}`, redirectHandler));
			continue;
		}

		if (!exists) {
			server.use(vhost(`${app}.${HOST}`, await global404(app)));
			continue;
		}

		const {load} = await import(join(Fs.rootPathDi, entry));
		server.use(vhost(`${app}.${HOST}`, await load(app)));
	}
};
