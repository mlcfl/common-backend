import type {Project} from './types';
import {Server} from './Server';

/**
 * Entry point to the entire project
 */
export const boot = async (params: Project.Boot): Promise<void> => {
	const server = new Server(params);
	await server.init();
	const port = await server.listen();
	console.log(`Server listening on port ${port}.`);
};
