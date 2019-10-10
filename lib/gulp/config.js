const fs = require('fs');
const yaml = require('js-yaml');

// Get config if file exists, otherwise return empty config
function getConfig(path) {
  try {
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    return {};
  }
}

function processConfig(config) {
  ['scss', 'js', 'img', 'js-concat', 'svg-sprite'].forEach(key => {
    config[key] = config[key].map(val => {
      return {
        src: config.src_base_path + val.src,
        dest: config.dest_base_path + val.dest,
        name: val.name ? val.name : null
      };
    });
  });
  return config;
}

function config() {
  // Merge default options with custom options
  return processConfig(Object.assign(getConfig(require.resolve('./../../.buildozerrc')), getConfig(`${process.env.INIT_CWD}/.buildozerrc`)));
}

module.exports = config();

