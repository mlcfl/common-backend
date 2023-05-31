import type {Request, Response, NextFunction} from 'express';

/**
 * Enable HTTPS redirect for all HTTP requests
 *
 * Not used now, because on the production server proxy to http://localhost is used
 */
export const httpRedirect = () => (req: Request, res: Response, next: NextFunction) => {
	const {secure, method, originalUrl, headers: {host}} = req;

	if (secure) {
		return next();
	}

	method === 'GET'
		? res.redirect(301, `https://${host}${originalUrl}`)
		: res.status(400).send('HTTPS request expected, but HTTP received.');
};
