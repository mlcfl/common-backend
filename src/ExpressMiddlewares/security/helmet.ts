import helmetMiddleware, {type HelmetOptions} from 'helmet';

/**
 * "Helmet helps you secure your Express apps by setting various HTTP headers"
 *
 * @link https://www.npmjs.com/package/helmet
 */
export const helmet = (options?: HelmetOptions) => helmetMiddleware(options);
