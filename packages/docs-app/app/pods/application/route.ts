import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TocService from '../../services/toc';

export default class PageRoute extends Route {
  @service toc!: TocService;

  model(): Promise<unknown> {
    return this.toc.fetchPagesSparseTask.perform();
  }
}
