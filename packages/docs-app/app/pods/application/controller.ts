import Controller from '@ember/controller';
import { PageSparse, PageSparseWithChildren } from '../../types';
import { ApplicationRouteModel } from './route';

export default class ApplicationController extends Controller {
  model!: ApplicationRouteModel;

  get pagesSparse(): PageSparse[] {
    return this.model.pagesSparse;
  }
}
