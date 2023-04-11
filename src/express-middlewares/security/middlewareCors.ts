import cors, {CorsOptions} from 'cors';

/**
 * "CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options"
 *
 * @link https://www.npmjs.com/package/cors
 */
export const middlewareCors = (options?: CorsOptions) => cors(options);
