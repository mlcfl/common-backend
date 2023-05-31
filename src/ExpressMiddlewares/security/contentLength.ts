import type {Request, Response, NextFunction} from 'express';

/**
 * Prevent large payload attacks
 *
 * @param {number} maxLength The size of the message body, in bytes
 */
export const contentLength = (maxLength: number) => (req: Request, res: Response, next: NextFunction): void => {
	const {headers: {'Content-Length': contentLength}} = req;
	const length = contentLength ? Number(contentLength) : 0;

	length > maxLength
		? res.status(413).send(`Payload too large, maximum length is ${maxLength}`)
		: next();
};
