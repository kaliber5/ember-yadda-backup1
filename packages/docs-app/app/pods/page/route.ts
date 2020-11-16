import Route from '@ember/routing/route';
import { Page } from '../../types';
import { inject as service } from '@ember/service';
import FetchService from '../../services/fetch';

export interface PageRouteModel {
  page: Page;
}

export default class PageRoute extends Route {
  @service fetch!: FetchService;

  async model({ id }: { id: string }): Promise<PageRouteModel> {
    const page = await this.fetch.fetchPageWithShoebox(id);
    return {
      page,
    };
  }
}
