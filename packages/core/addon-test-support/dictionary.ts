export interface DictionaryOpinionatedItem {
  macro: string;
  pattern: string | RegExp;
  converter?: (...args: unknown[]) => unknown;
}

export type DictionaryOpinionated = DictionaryOpinionatedItem[];

const dictionary: DictionaryOpinionated = [
  {
    macro: '_number',
    pattern: /(\d+(?:\.\d+)?)/,
    converter: (numberStr: string): number => parseFloat(numberStr),
  },
];

export default dictionary;
