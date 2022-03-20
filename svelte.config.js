import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

const contractsPath = path.resolve('contracts/out');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$contracts: contractsPath
				}
			},
			server: {
				fs: {
					// Allow serving files from one level up to the project root
					allow: [contractsPath]
				}
			}
		}
	}
};

export default config;
