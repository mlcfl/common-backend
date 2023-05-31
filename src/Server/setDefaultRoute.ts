import {join} from 'node:path';
import type {Express} from 'express';
import vhost from 'vhost';
import {Fs, type Project} from '~/services';

/**
 * Check and init the default route (without subdomains)
 */
export const setDefaultRoute = async (server: Express, project: Project): Promise<void> => {
	const {
		env: {HOST},
		config: {defaultApp},
		flatApps,
	} = project;

	if (!flatApps.includes(defaultApp)) {
		throw new Error(`Invalid default application "${defaultApp}". Possible values: "${flatApps.join(', ')}".`);
	}

	const entry = Fs.getBackendEntryPoint(defaultApp);
	const exists = await Fs.exists(Fs.rootPath, entry);

	if (!exists) {
		throw new Error(`The default application "${defaultApp}" does not exist in the following path: "${entry}".`);
	}

	const {load} = await import(join(Fs.rootPathDi, entry));
	server.use(vhost(HOST, await load(defaultApp)));
};
