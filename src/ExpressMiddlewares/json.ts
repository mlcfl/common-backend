import type {RequestHandler} from 'express';
import bodyParser, {type OptionsJson} from 'body-parser';

/**
 * "Parse incoming request JSON bodies in a middleware before your handlers, available under the req.body property."
 *
 * @link https://www.npmjs.com/package/body-parser
 */
export const json = (options?: OptionsJson): RequestHandler => bodyParser.json(options);
