import {join} from 'node:path';
import express from 'express';
import {ProjectRouter} from './ProjectRouter';
import {Project} from './services';
import {Node, Project as TProject} from './types';

/**
 * Entry point to the entire project
 */
export const boot = (params: TProject.Boot): void => {
	const project = Project.getInstance<Project>();
	const router = ProjectRouter.getInstance<ProjectRouter>();
	const server = express();

	project.init(params);
	const {env, config} = project;
	router.setConfig(config);

	server.set('subdomain offset', env.SUBDOMAIN_OFFSET);

	server.get('*', async (req, res) => {
		try {
			const {subdomains} = req;
			const app = router.getApp(subdomains);
			const pathRoot = join(import.meta.url, '../../../..');// TODO: move to Fs
			const pathApp = join(pathRoot, `apps/${app}/${app}-backend/dist/index.js`);
			const module = await import(pathApp);

			const none = module.load();
			console.log(`None is null for the application "${app}"? - ${none === null ? 'yes' : 'no'}`);
			res.send(`
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<style>
				html {
					font-size: 10px;
			 }
				body {
					text-align: center;
					font-size: 0;
					line-height: 1;
			 }
				.sun {
					display: inline-flex;
					align-items: center;
					flex-direction: column;
					padding: 0 1.5rem;
			 }
				.sun__hoholok-center, .sun__hoholok-left, .sun__hoholok-right {
					display: inline-block;
					width: 2rem;
					height: 3rem;
					border-radius: 50% 50% 0 0;
					background-color: red;
			 }
				.sun__hoholok-left {
					left: -2rem;
					transform: rotate(-30deg) translateY(0.5rem);
			 }
				.sun__hoholok-right {
					right: -2rem;
					transform: rotate(30deg) translateY(0.5rem);
			 }
				.sun__hand {
					width: 4rem;
					height: 8rem;
					background-color: #f7d935;
			 }
				.sun__hand_left {
					margin-left: -1.5rem;
					border-radius: 100% 0 0 40%;
			 }
				.sun__hand_right {
					margin-right: -1.5rem;
					border-radius: 0 100% 40% 0;
			 }
				.sun__body {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 30rem;
					height: 30rem;
					border-radius: 50%;
					background-color: #f7d935;
					z-index: 1;
			 }
				.sun__leg {
					display: inline-block;
					margin-top: -1.5rem;
			 }
				.sun__leg-left {
					margin-right: 2rem;
					transform: rotate(10deg);
			 }
				.sun__leg-right {
					margin-left: 2rem;
					transform: rotate(-10deg);
			 }
				.sun__finger {
					display: inline-block;
					width: 2rem;
					height: 4rem;
					border-radius: 0 0 50% 50%;
					background-color: #464646;
			 }
				.sun__finger-left {
					transform: rotate(20deg) translateY(-0.4rem);
			 }
				.sun__finger-right {
					transform: rotate(-20deg) translateY(-0.4rem);
			 }
				.sun__inner {
					margin-top: -6rem;
					padding: 10px;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					align-items: center;
			 }
				.sun__eyes {
					width: 100%;
					margin-bottom: 1rem;
			 }
				.sun__eye {
					position: relative;
					display: inline-block;
					width: 6rem;
					height: 3rem;
					border-radius: 50%;
					background-color: white;
			 }
				.sun__eye::after {
					content: '';
					position: absolute;
					width: 1rem;
					height: 1rem;
					border-radius: 50%;
					background-color: black;
					top: 30%;
					left: 15%;
			 }
				.sun__eye-left {
					margin-right: 3rem;
			 }
				.sun__eye-right {
					margin-left: 3rem;
			 }
				.sun__cheek {
					display: inline-block;
					width: 2rem;
					height: 2rem;
					border-radius: 50%;
					background-color: pink;
			 }
				.sun__mouth {
					display: inline-block;
			 }
				.sun__mouth::before, .sun__mouth::after {
					content: '';
					display: block;
					width: 6rem;
					height: 2rem;
					background-color: orange;
			 }
				.sun__mouth::before {
					border-radius: 50% 50% 0 0;
					box-shadow: 0 0 2px 0px #000 6b;
					background: linear-gradient(0deg, rgba(217, 145, 14, 1) 0%, rgba(255, 165, 0, 1) 27%);
			 }
				.sun__mouth::after {
					border-radius: 0 0 50% 50%;
					box-shadow: 0 0 2px 0px #000 6b;
					background: linear-gradient(180deg, rgba(217, 145, 14, 1) 0%, rgba(255, 165, 0, 1) 27%);
			 }
				</style>

				<div class='sun'>
					<div class='sun__hoholok'>
						<div class='sun__hoholok-left'></div>
						<div class='sun__hoholok-center'></div>
						<div class='sun__hoholok-right'></div>
					</div>
					<div class='sun__body'>
						<div class='sun__hand sun__hand_left'></div>
						<div class=sun__inner>
							<div class='sun__eyes'>
								<div class='sun__eye sun__eye-left'></div>
								<div class='sun__eye sun__eye-right'></div>
							</div>
							<div class='sun__cheek sun__cheek-left'></div>
							<div class='sun__mouth'></div>
							<div class='sun__cheek sun__cheek-right'></div>
						</div>
						<div class='sun__hand sun__hand_right'></div>
					</div>
					<div class='sun__legs'>
						<div class='sun__leg sun__leg-left'>
							<div class='sun__finger sun__finger-left'></div>
							<div class='sun__finger sun__finger-center'></div>
							<div class='sun__finger sun__finger-right'></div>
						</div>
						<div class='sun__leg sun__leg-right'>
							<div class='sun__finger sun__finger-left'></div>
							<div class='sun__finger sun__finger-center'></div>
							<div class='sun__finger sun__finger-right'></div>
						</div>
					</div>
				</div>
			`);
		} catch (e) {
			// If application was not found
			if (e instanceof Error && 'code' in e) {
				const error = e as Node.Errors.SystemError;

				if (error.code === Node.ErrorCodes.ERR_MODULE_NOT_FOUND) {
					res.status(404).send('( ﾉ ﾟｰﾟ)ﾉ 404 ＼(ﾟｰﾟ＼)');
					return;
				}
			}

			// Any other error
			console.error(e);
			res.status(500).send('( ﾉ ﾟｰﾟ)ﾉ 500 ＼(ﾟｰﾟ＼)');
		}
	});

	server.listen(env.SERVER_PORT, () => {
		console.log(`Server listening on port ${env.SERVER_PORT}`);
	});
};
