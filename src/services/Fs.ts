import {cwd} from 'node:process';
import {join} from 'node:path';
import {access, constants} from 'node:fs/promises';

/**
 * Work with the file system in the project
 */
export class Fs {
	private static _rootPath = join(cwd(), '..');
	private static _rootPathDi = join(import.meta.url, '../../../../..');

	/**
	 * Absolute path to the project
	 */
	static get rootPath(): string {
		return this._rootPath;
	}

	/**
	 * Absolute path to the project for dynamic imports (with the "file://" schema)
	 */
	static get rootPathDi(): string {
		return this._rootPathDi;
	}

	/**
	 * Return the relative path from the root to the entry point for the application backend
	 */
	static getBackendEntryPoint(app: string): string {
		return `apps/${app}/${app}-backend/dist/index.js`;
	}

	/**
	 * Return the relative path from the root to the entry point for the application frontend
	 */
	static getFrontendEntryPoint(app: string): string {
		return `apps/${app}/${app}-frontend/dist/index.js`;
	}

	/**
	 * Check existence (directory or file)
	 */
	static async exists(...paths: string[]): Promise<boolean> {
		const path = paths.length === 1 ? paths[0] : join(...paths);

		try {
			await access(path, constants.F_OK);
			return true;
		} catch (e) {
			return false;
		}
	}
}
