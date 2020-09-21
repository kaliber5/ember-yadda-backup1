import yadda, { Dictionary, Converter } from 'yadda';
import { DictionaryOpinionated } from '../dictionary';
import { wrapWithNodeStyle } from './utils';

const _dictionaryOpinionatedSingleton: DictionaryOpinionated = [];

export function addDictionary(...dictionariesOpinionated: DictionaryOpinionated[]): void {
  dictionariesOpinionated.forEach((dictionaryOpinionated) => {
    _dictionaryOpinionatedSingleton.push(...dictionaryOpinionated);
  });
}

export function generateDictionary(): Dictionary {
  const dictionary: Dictionary = new yadda.Dictionary();

  _dictionaryOpinionatedSingleton.forEach(({ macro, pattern, converter }) => {
    const converterClassic = converter ? (wrapWithNodeStyle(converter) as Converter) : undefined;
    dictionary.define(macro, pattern, converterClassic);
  });

  return dictionary;
}
