# The Raytracer Challenge REPL

This project is a web based REPL (Read Eval Print Loop) of the [Raytracer Challenge in Rust project](https://github.com/jakobwesthoff/the_ray_tracer_challenge_in_rust). It utilizes the Raytracer written in Rust compiled to Webassembly and provides a live editor interface to configure a scene and render it live in any modern browser.

## Try it out. It is available online

A running instance can be found online at [http://raytracer.xyz].

## Join me while I develop the Raytracer

The [Raytracer Challenge in Rust](https://github.com/jakobwesthoff/the_ray_tracer_challenge_in_rust) development can be followed live on [YouTube (MrJakob)](https://www.youtube.com/channel/UC-2w7N7aCqs_QclGUtXkSqg).

I invite you to join me while I present an overview of how the Raytracer REPL works and utilizes the Rust Raytracer using Webassembly:

[![Join me while I present how the REPL and Webassembly integration was built](share/youtube_link.jpg)]()

## Development

The following section describes all the needed prerequisites and information needed to setup a working development environment to build and work on the REPL code base itself.

### Prerequisites

In order to build the Raytracer REPL the following tool dependencies are needed:

* [nvm (node version manager)](https://github.com/nvm-sh/nvm)
  * **OR** [nodejs v16.x.x](https://nodejs.org/en/)
* [Rust Compiler and Toolset](https://www.rust-lang.org/tools/install).
  * See [QuickBytes: Rust Setup](https://youtu.be/Xc_dDtJzpk4) for a quick video introduction.
* [wasm-opt from the binaryen collection](https://github.com/WebAssembly/binaryen)
* [wasm-pack](https://github.com/rustwasm/wasm-pack)

Once all those tools are installed and available you can proceed to install the needed nodejs dependencies.

### Installing the needed nodejs/javascript dependencies

All the needed JavaScript dependencies are installed using *npm*:

```shell
npm install
```

Once download and setup is finished all dependencies for building the REPL are installed on your system.

### Building the REPL

The primary entry point into all build and development operations is *npm*.

**tl;dr:** Execute `npm run dev`, which builds all the Rust and JavaScript dependencies starts a web server with it and automatically rebuilds and pushes the changes via Live-Reload.

The following commands are available through `npm`

`npm run dev`
: Build and locally serve a development version of the REPL. The JavaScript and Svelte part is configured with Live-Reload. Therefore any changes are automatically rebuild into the release and served to the browser.

`npm run build`
: Create a release build of the Webassembly module as well as the JavaScript bundle and store everything in the `public/build` folder.

`npm run build:web`
: Create a release build of the JavaScript bundle.

`npm run build:wasm`
: Create a release build of the Webassembly module.

`npm run clean`
: Remove all Rust and JavaScript build artifacts.

`npm run clean:web`
: Remove all JavaScript build artifacts.

`npm run clean:wasm`
: Remove all Webassembly build artifacts.

`npm start`
: Start a simple web server module serving the release build locally

### Build Artifacts

The build artifacts of the Rust part of the REPL can be found in the `rust/pkg` folder after build. The JavaScript bundle as well as every web related build artifact can be found within `public/build`. Furthermore the files `public/sw.js` and `public/sw.js.map` are generated during the build process.

### Rollup

The JavaScript/TypeScript bundle is created using [rollup](https://rollupjs.org/guide/en/). The configuration can is available at `rollup.config.js`.

Statistics about the created bundle is available after build within the `stats.html` file. It can be used to check which components are stored within the bundle.

### ServiceWorker

A ServiceWorker module is build during bundling, which is used to precache all assets of the REPL as well as supporting offline loading and usage, once it has been accessed once.

**Note:** Currently the ServiceWorker is inactive, as I have a problem with precaching the assets and still loading new versions once they are deployed to the server. Until I figured this part out the ServiceWorker is not loaded. If you now how to create a ServiceWorker using workbox, which precaches as well as uses a Stale-While-Revalidate strategy for those assets, feel free to contact me.
