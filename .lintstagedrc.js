'use strict';

const filesTypeScriptBrowser = [
  'packages/*/addon/**/*.ts',
  'packages/*/addon-test-support/**/*.ts',
  'packages/*/app/**/*.ts',
  'packages/*/mirage/**/*.ts',
  'packages/*/test-support/**/*.ts',
  'packages/*/tests/**/*.ts',
  'packages/*/types/**/*.ts',
];

const filesTypeScriptNode = [
  'packages/*/*.ts',
  'packages/*/.*.ts',
  'packages/*/blueprints/*/*.ts',
  'packages/*/config/**/*.ts',
  'packages/*/lib/*/index.ts',
  'packages/*/server/**/*.ts',
];

const filesTypeScriptBrowserStr = '{' + filesTypeScriptBrowser.join(',') + '}';
const filesTypeScriptNodeStr = '{' + filesTypeScriptNode.join(',') + '}';

module.exports = {
  // Run TSC on all the codebase.
  // Can't run TSC on individual files because we have two envs: Node and browser,
  // and TSC does not support providing a config and a path to a specific file at the same time.
  // Thus, two separate configs are used: one for Node, one for browser.
  // The function allows running the command globally, rather than once per each staged file.
  [filesTypeScriptBrowserStr]: () => 'yarn lint:ts -p tsconfig.json',
  [filesTypeScriptNodeStr]: () => 'yarn lint:ts -p tsconfig-node.json',

  // Run ESLint, typescript-eslint and Prettier on staged files only
  '**/*.{js,ts}': ['yarn lint:eslint --fix'],

  // Template lint
  '**/*.hbs': ['yarn ember-template-lint'],
};
