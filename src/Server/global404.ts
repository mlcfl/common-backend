import type {Request, Response} from 'express';

/**
 * If the requested subdomain or path wasn't found
 */
export const global404 = (app?: string) => (req: Request, res: Response): void => {
	app
		? res.status(404).send(`The application "${app}" was not installed.`)
		: res.status(404).send('The application or path does not exist.');
};
