import { Yadda } from 'yadda';

export default {
  indexStr: /(\d+)(?:st|nd|rd|th)/,
  index: ['$indexStr', (indexStr) => parseInt(indexStr, 10)],
  indexZero: ['$indexStr', (indexStr) => parseInt(indexStr, 10) - 1],

  // address: '$street, $postcode',
  // street: /(\d+) (\w+)/,
  // postcode: /((GIR &0AA)|((([A-PR-UWYZ][A-HK-Y]?[0-9][0-9]?)|(([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRV-Y]))) &[0-9][ABD-HJLNP-UW-Z]{2}))/,
  // num: Yadda.converters.integer,

  // quantity: [/(\d+) (\w+)/, (amount, units) => ({ amount: amount, units: units })],

  // user: [
  //   '$user',
  //   async (userName) => (await fetch(`https://api.example.com/users/${userName}`)).json(),
  // ],
};
