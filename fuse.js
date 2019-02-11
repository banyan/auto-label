const { FuseBox } = require("fuse-box");
const argv = require('yargs').argv;

const isWatch = argv.variant === 'watch';

const fuse = FuseBox.init({
  homeDir: "src",
  target: "server",
  output: "dist/$name.js",
});

const app = fuse.bundle("entrypoint").instructions("> [entrypoint.ts]");
isWatch && app.watch();

fuse.run();
