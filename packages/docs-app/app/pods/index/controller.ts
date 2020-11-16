import Controller from '@ember/controller';
import { Page } from '../../types';
import { IndexRouteModel } from './route';

export default class IndexController extends Controller {
  model!: IndexRouteModel;

  get page(): Page {
    return this.model.page;
  }
}
