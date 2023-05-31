import type {RequestHandler} from 'express';
import hppMiddleware, {type Options} from 'hpp';

/**
 * "Express middleware to protect against HTTP Parameter Pollution attacks"
 *
 * @link https://www.npmjs.com/package/hpp
 */
export const hpp = (options?: Options): RequestHandler => hppMiddleware(options);
