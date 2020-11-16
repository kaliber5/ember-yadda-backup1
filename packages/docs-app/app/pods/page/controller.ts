import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { Page, PageSparseWithChildren } from '../../types';
import { PageRouteModel } from './route';
import TocService from '../../services/toc';
import { cached, tracked } from '@glimmer/tracking';

export default class PageController extends Controller {
  @service toc!: TocService;

  @tracked model!: PageRouteModel; // need tracked here, otherwise the template won't update

  get page(): Page {
    return this.model.page;
  }

  @cached
  get pageSparseWithChildren(): PageSparseWithChildren | undefined {
    if (!this.toc.pageSparseIndexWithChildren) {
      return undefined;
    }

    return this.page.id.split('/').reduce((result: PageSparseWithChildren, segment: string) => {
      if (!result || !result.children[segment]) {
        throw new Error(`Unable to find PageSparseWithChildren for ${this.page.id}`);
      }

      return result.children[segment];
    }, this.toc.pageSparseIndexWithChildren);
  }

  @cached
  get prevPageSparse(): PageSparseWithChildren | undefined {
    return this._findSiblingPageSparse(-1);
  }

  @cached
  get nextPageSparse(): PageSparseWithChildren | undefined {
    return this._findSiblingPageSparse(1);
  }

  _findSiblingPageSparse(direction: 1 | -1): PageSparseWithChildren | undefined {
    const page = this.pageSparseWithChildren;

    if (!page) return;

    const parent = page.parent;

    if (!parent) return;

    const siblingsSorted = Object.values(parent.children).sort((a, b) => a.id.localeCompare(b.id));

    const indexSorted = siblingsSorted.findIndex(
      (candidate: PageSparseWithChildren) => candidate.id === page.id
    );

    if (indexSorted === -1) {
      throw new Error(`page ${page.id} not found among its own children`);
    }

    // Sibling
    if (siblingsSorted[indexSorted + direction]) {
      return siblingsSorted[indexSorted + direction];
    }

    // Own parent
    else if (direction === -1) {
      return parent;
    }

    // Own child
    else if (Object.values(page.children).length) {
      const childrenSorted = Object.values(page.children).sort((a, b) => a.id.localeCompare(b.id));
      return childrenSorted[0];
    }

    // Parent's next sibling
    else if (parent.parent) {
      const parentSiblingsSorted = Object.values(parent.parent.children).sort((a, b) =>
        a.id.localeCompare(b.id)
      );

      const indexSorted = parentSiblingsSorted.findIndex(
        (candidate: PageSparseWithChildren) => candidate.id === parent.id
      );

      if (indexSorted === -1) {
        throw new Error(`page ${parent.id} not found among its own children`);
      }

      return parentSiblingsSorted[indexSorted + 1];
    }
  }
}
