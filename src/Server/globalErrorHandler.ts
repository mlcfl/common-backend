import type {Request, Response, NextFunction} from 'express';

/**
 * Global error handler for catching on the highest level
 */
export const globalErrorHandler = () => (error: unknown, req: Request, res: Response, next: NextFunction): void => {
	res.status(500).send('Internal server error');
};
