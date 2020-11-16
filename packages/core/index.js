'use strict';

const FeatureParser = require('./lib/feature-parser');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  options: {
    autoImport: {
      webpack: {
        node: {
          fs: 'empty',
          path: 'empty',
        },
      },
    },
  },

  // included() {
  //   // Required by ember-auto-import
  //   this._super.included.apply(this, arguments);
  // },

  setupPreprocessorRegistry(type, registry) {
    console.log('setupPreprocessorRegistry')
    registry.add('js', {
      name: 'ember-cli-yadda',
      ext: ['feature', 'spec', 'specification'],
      toTree: (tree) => {
        console.log('setupPreprocessorRegistry toTree')
        return new FeatureParser(tree, this.options);
      },
    });
  },
};
