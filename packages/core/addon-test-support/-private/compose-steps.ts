import { Library } from 'yadda';
import { StepDefinition, StepImplementation, LabelTuple, StepFnOpinionated } from '../types';
import requireModule from 'ember-require-module';

export const REGEX_STEP_NAME = /^(\S+) ([\s\S]+)$/;

function lookupStepByAlias(
  mergedStepDefinitions: StepDefinition,
  stepImplementation: StepImplementation | string
): StepImplementation {
  let currentStepImplementation = stepImplementation;
  let i = 0;

  // Lookup by alias
  while (typeof currentStepImplementation === 'string') {
    i++;

    if (i >= 256) {
      throw new Error(`Infinite loop in Yadda step aliases`);
    }

    if (!mergedStepDefinitions[currentStepImplementation]) {
      throw new Error(
        `Yadda step references a non-existing step.\nAlias: ${currentStepImplementation}`
      );
    }

    currentStepImplementation = mergedStepDefinitions[currentStepImplementation];
  }

  return currentStepImplementation;
}

function makeBetterMessage({
  message,
  stepName,
  stepImplName,
  args,
}: {
  message: string;
  stepName: string;
  stepImplName: string;
  args: unknown[];
}): string {
  message = `\n👟 ${stepName}\n⚙ ${stepImplName}\n⚠ ${message}\n\n🛠Arguments:`;

  args.forEach((arg, i) => {
    let argMessage = `${arg}`; // eslint-disable-line @typescript-eslint/restrict-template-expressions

    if (arg && (arg as LabelTuple).__isLabelTuple__) {
      const labelTuple: LabelTuple = arg as LabelTuple;

      argMessage = `Collection. Length: ${labelTuple[0].length}, Label: ${labelTuple[1]}, Selector: ${labelTuple[2]}`;
    }

    message += `\n    ${i}: ${argMessage}`;
  });

  return message;
}

function makeBetterError({
  error,
  stepName,
  stepImplName,
  args,
  message = makeBetterMessage({ message: error.message, stepName, stepImplName, args }),
}: {
  error: Error;
  stepName: string;
  stepImplName: string;
  args: unknown[];
  message?: string;
}): Error {
  if (error.stack) {
    const stack = error.stack.slice(error.message.length + error.constructor.name.length + 2);
    const newError = new Error(message);

    newError.stack = `${message}\n\n${stack}`;

    return newError;
  } else {
    error.message = message;
    return error;
  }
}

async function runAndLogOrThrow({
  assert,
  callback,
  stepName,
  stepImplName,
  args,
}: {
  assert: Assert;
  callback: () => void | Promise<void>;
  stepName: string;
  stepImplName: string;
  args: unknown[];
}): Promise<unknown> {
  let result;
  let isSuccessful = true;

  try {
    result = await callback();
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    const betterError = makeBetterError({ error, stepName, stepImplName, args });

    // No Try/Catch
    const QUnit = requireModule('qunit') as QUnit;
    if (QUnit.config.notrycatch) {
      throw betterError;
    }

    // Normal
    assert.pushResult({
      result: false,
      message: betterError.message,
      actual: undefined,
      expected: undefined,
    });
    isSuccessful = false;

    // Stop scenario execution without spamming into the report output
    throw new Error('Terminating further scenario execution after a previous error');
  }

  // Log successful step to QUnit
  if (isSuccessful && assert && assert.pushResult) {
    // eslint-disable-next-line no-irregular-whitespace
    assert.pushResult({
      result: true,
      message: `👟 ${stepName}\n  ⚙ ${stepImplName}`,
      actual: undefined,
      expected: undefined,
    });
  }

  return result;
}

export default function composeSteps(
  library: Library,
  ...stepDefinitions: StepDefinition[]
): Library {
  const mergedStepDefinitions: StepDefinition = stepDefinitions.reduce((a, b) => ({ ...a, ...b }));

  Object.keys(mergedStepDefinitions).forEach((stepImplName) => {
    const stepImplementation = mergedStepDefinitions[stepImplName];

    const regexResult = REGEX_STEP_NAME.exec(stepImplName);

    if (!regexResult)
      throw new Error(`Failed to parse the step implementation name: ${stepImplName}`);

    const [, methodNameRaw, assertionNameRaw] = regexResult;
    const methodName = methodNameRaw.toLowerCase() as 'define'; // actually, also 'given' | 'when' | 'then', but these are missing in @types/yadda

    async function decoratedCallback(
      this: StepFnOpinionated,
      ...args: unknown[]
    ): Promise<unknown> {
      const currentStepImplementation = lookupStepByAlias(
        mergedStepDefinitions,
        stepImplementation
      );

      return runAndLogOrThrow({
        assert: this.assert,
        callback: () => currentStepImplementation.call(this, ...args), // eslint-disable-line @typescript-eslint/no-unsafe-return
        stepName: this.step,
        stepImplName,
        args,
      });
    }

    if (typeof library[methodName] !== 'function') {
      throw new Error(
        `Yadda step name must start with given/when/then/define, was: "${stepImplName}"`
      );
    }

    // https://github.com/acuminous/yadda/issues/243#issuecomment-453115035
    const assertionName = `${assertionNameRaw}$`;

    library[methodName](assertionName, decoratedCallback);
  });

  return library;
}
