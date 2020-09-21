declare module 'qunit' {
  import { TestContext } from 'ember-test-helpers';
  export function test(
    name: string,
    callback: (this: TestContext, assert: Assert) => void | Promise<unknown>
  ): void;
}
