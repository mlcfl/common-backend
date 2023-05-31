import type {HelmetOptions} from 'helmet';
import type {Project} from '~/services';

/**
 * Return helmet configuration
 */
export const getHelmetConfig = (project: Project): HelmetOptions => {
	const {env: {HOST}} = project;
	const isDev = project.isDev();

	if (isDev) {
		return {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					// Allow proxy servers and WebSockets for Vite HMR
					scriptSrc: ["'self'", `${HOST}:*`],
					connectSrc: ["'self'", 'ws:'],
				},
			},
			// Allow Vite to download resources (e.g. sourcemaps)
			crossOriginEmbedderPolicy: false,
		};
	} else {
		return {
			contentSecurityPolicy: {
				useDefaults: true,
			},
			crossOriginEmbedderPolicy: true,
		};
	}
};
