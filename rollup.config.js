import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import wasm from "@rollup/plugin-wasm";
import compressCssVariables from "postcss-variable-compress";
import hypothetical from "rollup-plugin-hypothetical";
import livereload from "rollup-plugin-livereload";
import multiInput from "rollup-plugin-multi-input";
import postcss from "rollup-plugin-postcss";
import { string } from "rollup-plugin-string";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import { generateSW } from "rollup-plugin-workbox";
import sveltePreprocess from "svelte-preprocess";
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import html from 'html-rollup-plugin';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default [
	{
		input: ["src/**/*.worker.ts"],
		output: {
			sourcemap: !production,
			format: "iife",
			name: "worker",
			dir: "public/build/",
		},
		plugins: [
			multiInput(),
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
			}),
			wasm({ publicPath: "" }),
			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
		],
	},

	{
		input: "src/main.ts",
		output: {
			sourcemap: !production,
			format: "iife",
			name: "app",
			file: production ? "public/build/bundle.[hash].js" : "public/build/bundle.dev.js",
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({ sourceMap: !production }),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
				},
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			postcss({
				extract: true,
				minimize: production ? { preset: 'default' } : false,
				plugins: production ? [compressCssVariables(['split-point-a'])] : [],
			}),
			string({ include: "src/worlds/**/*.yaml" }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ["svelte"],
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
			}),
			wasm({ publicPath: "" }),
			json(),

			html({
				template: 'src/index.html',
				dest: "public/",
				filename: 'index.html',
				inject: 'head',
				defer: true,
				ignore: /\.worker\.js|sw\.js$|global\.css$/,
				externals: []
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload("public"),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),

			generateSW({
				mode: production ? "production" : "development",
				swDest: "public/sw.js",
				inlineWorkboxRuntime: true,
				sourcemap: !production,
				globPatterns: ["**/*.{html,json,js,css,png,ico,json,wasm}"],
				globDirectory: "public/",
				skipWaiting: true,
				clientsClaim: true,
			}),
			replace({
				'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
				preventAssignment: true,
			}),
			hypothetical({
				allowFallthrough: true,
				files: {
					"./node_modules/@kahi-ui/framework/vendor/js-temporal.js": `export const Temporal = window.Temporal`,
				},
			}),
			visualizer(),
		],
		watch: {
			clearScreen: false,
		},
	},
];
