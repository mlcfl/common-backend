import type {Request, Response, NextFunction} from 'express';

/**
 * Error handler for catching on the application level
 */
export const errorHandler = (app: string) => (error: unknown, req: Request, res: Response, next: NextFunction): void => {
	res.status(500).send(`Internal server error for the application "${app}"`);
};
