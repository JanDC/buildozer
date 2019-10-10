'use strict';

// Load plugins that are required by multiple tasks
const gulp = require('gulp');
const config = require('./lib/gulp/config.js');

// Only load browserSync when needed
// eslint-disable-next-line import/order
const browserSync = config.browsersync.proxy || config.browsersync.server ? require('browser-sync').create() : false;

// Get all tasks
const clean = require('./lib/gulp/clean.js');
const copy = require('./lib/gulp/copy.js');
const {css, cssCompile} = require('./lib/gulp/css.js');
const {img, imgCompile, svgSprite} = require('./lib/gulp/image.js');
const {js, jsCompile, jsConcat} = require('./lib/gulp/js.js');

// Change working dir back to initial dir
process.chdir(process.env.INIT_CWD);

// Watch files
function watchFiles() {
  config.scss.forEach(scss => {
    // eslint-disable-next-line func-names
    gulp.watch(scss.src, function css() {
      return cssCompile({src: scss.src, dest: scss.dest, browserSync});
    });
    cssCompile({src: scss.src, dest: scss.dest});
  });

  config.js.forEach(j => {
    // eslint-disable-next-line func-names
    gulp.watch(j.src, function js() {
      return jsCompile({src: j.src, dest: j.dest, browserSync});
    });
    jsCompile({src: j.src, dest: j.dest});
  });

  config['js-concat'].forEach(js => {
    // eslint-disable-next-line func-names
    gulp.watch(js.src, function concat() {
      return jsConcat({src: js.src, dest: js.dest, js: js.name, browserSync});
    });
    jsConcat({src: js.src, dest: js.dest, js: js.name});
  });

  config.img.forEach(i => {
    // eslint-disable-next-line func-names
    gulp.watch(i.src, function img() {
      return imgCompile({src: i.src, dest: i.dest, browserSync});
    });
    imgCompile({src: i.src, dest: i.dest});
  });

  config['svg-sprite'].forEach(sprite => {
    // eslint-disable-next-line func-names
    gulp.watch(sprite.src, function svgSpriteCreate() {
      return svgSprite({src: sprite.src, dest: sprite.dest, name: sprite.name, browserSync});
    });
    svgSprite({src: sprite.src, dest: sprite.dest, name: sprite.name});
  });

  if (browserSync !== false) {
    browserSync.init({
      proxy: config.browsersync.proxy,
      server: config.browsersync.server,
      notify: false,
      open: false
    });

    if (config.browsersync.reload) {
      gulp.watch(config.browsersync.reload).on('change', browserSync.reload);
    }
  }
}

function setProduction(cb) {
  process.env.NODE_ENV = 'production';
  cb();
}

// Define complex tasks
const build = gulp.series(setProduction, clean, copy, gulp.parallel(css, js, img));
const watch = gulp.series(clean, copy, watchFiles);

// Export tasks
exports.copy = copy;
exports.img = img;
exports.css = css;
exports.js = js;
exports['js-concat'] = jsConcat;
exports['svg-sprite'] = svgSprite;
exports.clean = clean;
exports.setProduction = setProduction;
exports.build = build;
exports.watch = watch;
