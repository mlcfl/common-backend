import {join} from 'node:path';
import {Express} from 'express';
import vhost from 'vhost';
import {Project, Fs} from '~/services';

/**
 * Check and init the default route (without subdomains)
 */
export const setDefaultRoute = async (server: Express): Promise<void> => {
	const {
		env: {HOST},
		config: {apps, defaultApp},
	} = Project.getInstance<Project>();

	if (!apps.includes(defaultApp)) {
		throw new Error(`Invalid default application "${defaultApp}". Possible values: "${apps.join(', ')}".`);
	}

	const entry = Fs.getBackendEntryPoint(defaultApp);
	const exists = await Fs.exists(Fs.rootPath, entry);

	if (!exists) {
		throw new Error(`The default application "${defaultApp}" does not exist in the following path: "${entry}".`);
	}

	const {load} = await import(join(Fs.rootPathDi, entry));
	server.use(vhost(HOST, load()));
};
