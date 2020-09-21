import { module, test } from 'qunit';
import yadda, { Yadda, Library, Dictionary } from 'yadda';
import FeatureParser, {
  SpecificationExport,
  ScenarioExport,
} from 'yadda/lib/parsers/FeatureParser';
import { cached } from 'tracked-toolbox';
import requireModule from 'ember-require-module';
import composeSteps from './compose-steps';
import { StepDefinition } from '../types';
import { generateDictionary } from './dictionary';

export default class TestDeclarator {
  relativePath: string;
  featureStr: string;

  @cached get projectName(): string {
    return this.relativePath.split('/')[0];
  }

  @cached get legacyStepsFileName(): string {
    return this.relativePath.slice(0, this.relativePath.lastIndexOf('.')) + '-steps';
  }

  @cached get opinionatedStepsFileName(): string {
    return `${this.projectName}/tests/yadda/steps`;
  }

  @cached get featureParser(): FeatureParser {
    return new yadda.parsers.FeatureParser();
  }

  @cached get featureParsed(): SpecificationExport {
    return this.featureParser.parse(this.featureStr);
  }

  @cached get dictionaryClassic(): Dictionary {
    return generateDictionary();
  }

  @cached get library(): Library {
    // const legacyLibrary = requireModule(this.legacyStepsFileName) as (() => Library) | undefined;

    // if (legacyLibrary) {
    //   return legacyLibrary();
    // }

    const opinionatedLibrary = requireModule(this.opinionatedStepsFileName) as
      | StepDefinition
      | undefined;

    if (!opinionatedLibrary) {
      throw new Error(
        `Neither legacy steps \`${this.legacyStepsFileName}\` nor opinionated steps \`${this.opinionatedStepsFileName}\` found.`
      );
    }

    const library: Library = (yadda.localisation.default.library(
      this.dictionaryClassic
    ) as unknown) as Library;

    return composeSteps(library, opinionatedLibrary);
  }

  @cached get yaddaInstance(): Yadda {
    return yadda.createInstance(this.library);
  }

  constructor({ relativePath, feature }: { relativePath: string; feature: string }) {
    this.relativePath = relativePath;
    this.featureStr = feature;
  }

  declare(): void {
    module(this.featureParsed.title, (/* hooks: NestedHooks */) => {
      this.featureParsed.scenarios.forEach((scenario: ScenarioExport) => {
        test(scenario.title, (assert: Assert) => {
          return this.runScenario(scenario, assert);
        });
      });
    });
  }

  runScenario(scenario: ScenarioExport, assert: Assert): Promise<void> {
    return new Promise((resolve, reject) => {
      this.yaddaInstance.run(scenario.steps, { assert, ctx: {} }, (err: Error | null) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}
