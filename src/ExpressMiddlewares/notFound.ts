import type {Request, Response} from 'express';

/**
 * If the requested path in the application wasn't found
 */
export const notFound = (app: string) => (req: Request, res: Response): void => {
	res.status(404).send(`Application "${app}": the requested path "${req.originalUrl}" not found.`);
};
