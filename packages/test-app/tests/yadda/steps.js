const steps = {
  'Given $_number foos?'(number) {
    this.assert.equal(number, 2);
  },
  'When bar'() {},
  'Then (baz)'(baz, assert) {},
  'Given foo foo foo'() {},
  async 'When bar bar bar'() {
    console.log('before');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('after');
  },
  'Then baz baz baz'() {},
};

export default steps;
