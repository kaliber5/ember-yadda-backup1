'use strict';

const Filter = require('broccoli-persistent-filter');
const path = require('path');

class FeatureParser extends Filter {
  constructor(inputNode, options) {
    super(inputNode);
    this.options = options;
    this.extensions = ['feature', 'spec', 'specification'];
    this.targetExtension = 'js';
  }

  processString(content, relativePath) {
    const contentEscaped = content.replace(/`/g, '\\`');

    const module = `
      import { TestDeclarator } from '@ember-yadda/core/test-support';

      const relativePath = '${relativePath}';
      const feature = \`${contentEscaped}\`;

      const testDeclarator = new TestDeclarator({relativePath, feature});

      testDeclarator.declare();
    `;

    return module;
  }

  // Determine whether the source file should be processed, and optionally rename the output file when processing occurs
  // Return `null` to pass the file through without processing.
  getDestFilePath(relativePath) {
    const ext = path.extname(relativePath);
    if (ext === '.feature' || ext === '.spec' || ext === '.specification') {
      return relativePath.replace(ext, '-__ember-yadda__-test.js');
    }
    return null;
  }
}

module.exports = FeatureParser;
