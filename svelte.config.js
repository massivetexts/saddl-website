import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: node(),
		target: '#svelte',
		vite: {
			define: {
//				'process.env': {}
			}
		}
	},
};

export default config;
