import { StepFn } from 'yadda';

export type StepArgs =
  | [Assert]
  | [unknown, Assert]
  | [unknown, unknown, Assert]
  | [unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, Assert]
  | [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, Assert];

export interface StepDefinition {
  [index: string]: StepImplementation;
}

export type StepImplementation = (this: StepFn, ...args: StepArgs) => void | Promise<void>;

export type Label = string;
export type SelectorCompound = string;

export type LabelTupleRaw = [Element[], Label, SelectorCompound];

export interface LabelTuple extends LabelTupleRaw {
  __isLabelTuple__: true;
}

export interface StepFnOpinionated extends StepFn {
  assert: Assert;
}
