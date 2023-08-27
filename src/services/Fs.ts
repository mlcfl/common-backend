import {cwd} from 'node:process';
import {join} from 'node:path';
import {access, constants, readFile} from 'node:fs/promises';

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
	 * Return the relative path from the root to the compiled entry point for the application backend
	 */
	static getBackendEntryPoint(app: string): string {
		return `apps/${app}/${app}-backend/dist/index.js`;
	}

	/**
	 * Return the relative path from the root to the compiled entry point for the application frontend
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

	/**
	 * Get file content
	 */
	static async readFile(path: string): Promise<string> {
		return await readFile(path, {encoding: 'utf-8'});
	}

	/**
	 * Get parsed JSON file content
	 */
	static async readJsonFile<T>(path: string): Promise<T> {
		const content = await readFile(path, {encoding: 'utf-8'});

		return JSON.parse(content);
	}
}
