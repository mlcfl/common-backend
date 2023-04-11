import {RequestHandler} from 'express';
import bodyParser, {OptionsUrlencoded} from 'body-parser';

/**
 * "Parse incoming request URL-encoded bodies in a middleware before your handlers, available under the req.body property."
 *
 * @link https://www.npmjs.com/package/body-parser
 */
export const middlewareUrlencoded = (options?: OptionsUrlencoded): RequestHandler => bodyParser.urlencoded({extended: true, ...options});
