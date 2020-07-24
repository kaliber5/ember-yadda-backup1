const steps ={
  'Given foo'() {},
  'When bar'() {},
  'Then (baz)'(baz, assert) {
    debugger
  },
  'Given foo foo foo'() {},
  'When bar bar bar'() {},
  'Then baz baz baz'() {},
};

export default steps;
