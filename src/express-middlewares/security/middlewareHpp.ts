import {RequestHandler} from 'express';
import hpp from 'hpp';

/**
 * "Express middleware to protect against HTTP Parameter Pollution attacks"
 *
 * @link https://www.npmjs.com/package/hpp
 */
export const middlewareHpp = (): RequestHandler => hpp();
