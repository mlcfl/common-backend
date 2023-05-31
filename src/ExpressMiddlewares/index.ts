import * as security from './security';
import {json} from './json';
import {urlencoded} from './urlencoded';
import {notFound} from './notFound';
import {errorHandler} from './errorHandler';

export {
	security,
	json,
	urlencoded,
	notFound,
	errorHandler,
};

export const ExpressMiddlewares = {
	...security,
	json,
	urlencoded,
	notFound,
	errorHandler,
};
