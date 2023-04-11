// Copyright (c) 2018 Brannon Dorsey <brannon@brannondorsey.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import {Request, Response, NextFunction} from 'express';

type Item = (string | RegExp)[];

type ModeFn = {
	readonly mode?: 'both' | 'either',
	readonly onInvalid?: (req: Request, res: Response, next: NextFunction) => void,
};

type ConfigA = ModeFn & {
	readonly hosts: Item,
	readonly referers?: Item,
};

type ConfigB = ModeFn & {
	readonly hosts?: Item,
	readonly referers: Item,
};

type ConfigC = ModeFn & {
	readonly hosts: Item,
	readonly referers: Item,
};

const isAllowed = (headerValue?: string, allowedValues?: (string | RegExp)[]): boolean => {
	if (!headerValue || !allowedValues) {
		return false;
	}

	for (const candidate of allowedValues) {
		if (typeof candidate === 'string') {
			return candidate === headerValue;
		}

		if (candidate instanceof RegExp){
			return candidate.test(headerValue);
		}
	}

	return false;
}

/**
 * "Express.js middleware that protects Node.js servers from DNS Rebinding attacks by validating Host and Referer [sic] headers from incoming requests. If a request doesn't contain a whitelisted Host/Referer header, host-validation will respond with a 403 Forbidden HTTP error."
 *
 * @author https://github.com/brannondorsey/host-validation
 * @link https://www.npmjs.com/package/host-validation
 */
export const middlewareDnsRebinding = (config: ConfigA | ConfigB | ConfigC) => {
	const {hosts, referers, onInvalid, mode = 'both'} = config;

	if (!hosts && !referers) {
		throw new Error(`Invalid configuration. You forgot the "hosts" or "referers" fields.`);
	}

	if (hosts && !hosts.length) {
		throw new Error('The "hosts" field must contain at least one element.');
	}

	if (referers && !referers.length) {
		throw new Error('The "referers" field must contain at least one element.');
	}

	return (req: Request, res: Response, next: NextFunction): void => {
		const allowedHosts = isAllowed(req.headers.host, hosts);
		const allowedRefs = isAllowed(req.headers.referer, referers);
		let allowed = true;

		if (mode === 'both') {
			if (hosts && referers) {
				allowed = allowedHosts && allowedRefs;
			} else if (hosts) {
				allowed = allowedHosts;
			} else if (referers) {
				allowed = allowedRefs;
			}
		} else {
			allowed = allowedHosts || allowedRefs;
		}

		if (allowed) {
			return next();
		}

		if (typeof onInvalid === 'function') {
			return onInvalid(req, res, next);
		}

		res.status(403).send('Forbidden');
	}
};
