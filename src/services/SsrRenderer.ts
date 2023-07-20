import {basename, extname} from 'node:path';
import {type App} from 'vue';
import {type Router} from 'vue-router';
import {
	renderToString as renderFunction,
	type SSRContext,
} from 'vue/server-renderer';

/**
 * Project builder & SSR helper to transform an application into SSR version
 */
export class SsrRenderer {
	static async renderApp({
		route,
		manifest,
		renderToString,
		instance: {app, router},
	}: {
		route: string;
		manifest: Record<string, string[]>;
		renderToString: typeof renderFunction;
		instance: {app: App<Element>, router: Router};
	}): Promise<{html: string, assets: string, ctx: SSRContext}> {
		await router.push(route);
		await router.isReady();

		const ctx: SSRContext = {};
		const html = await renderToString(app, ctx);
		const assets = this._renderAssetLinks(manifest, ctx.modules);

		return {html, assets, ctx};
	}

	/**
	 * Return html tag for asset
	 */
	static getAssetLink(path: string): string {
		const ext = extname(path);
		const prefix = path[0] === '/' || /^https?/i.test(path) ? '' : '/';

		return {
			'.js': `<link rel="modulepreload" crossorigin href="${prefix}${path}">`,
			'.css': `<link rel="stylesheet" href="${prefix}${path}">`,
			'.woff': `<link rel="preload" href="${prefix}${path}" as="font" type="font/woff" crossorigin>`,
			'.woff2': `<link rel="preload" href="${prefix}${path}" as="font" type="font/woff2" crossorigin>`,
			'.gif': `<link rel="preload" href="${prefix}${path}" as="image" type="image/gif">`,
			'.jpg': `<link rel="preload" href="${prefix}${path}" as="image" type="image/jpeg">`,
			'.jpeg': `<link rel="preload" href="${prefix}${path}" as="image" type="image/jpeg">`,
			'.png': `<link rel="preload" href="${prefix}${path}" as="image" type="image/png">`,
		}[ext] ?? '';
	}

	/**
	 * Return html for assets based on manifest
	 */
	private static _renderAssetLinks(manifest: Record<string, string[]>, modules: Set<string>): string {
		let links = '';
		const used = new Set();

		for (const id of modules) {
			const files = manifest[id];

			if (!files) {
				continue;
			}

			for (const file of files) {
				if (used.has(file)) {
					continue;
				}

				used.add(file);
				const name = basename(file);

				if (manifest[name]) {
					for (const extraFile of manifest[name]) {
						used.add(extraFile);
						links += this.getAssetLink(extraFile);
					}
				}

				links += this.getAssetLink(file);
			}
		}

		return links;
	}
}
