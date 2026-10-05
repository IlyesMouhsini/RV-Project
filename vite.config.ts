import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-netlify';
import path from 'path';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter()
		}),
		tailwindcss()
	],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	}
});