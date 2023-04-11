import {Request, Response} from 'express';

/**
 * If the requested subdomain wasn't found
 */
export const subdomainNotFound = (app?: string) => (req: Request, res: Response): void => {
	app
		? res.status(404).send(`The application "${app}" was not installed.`)
		: res.status(404).send('The application does not exist.');
};
