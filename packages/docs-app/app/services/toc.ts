import Service, { inject as service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import FetchService from './fetch';
import { TaskGenerator } from 'ember-concurrency';
import { dropTask } from 'ember-concurrency-decorators';
import { PageSparse, PageSparseWithChildren } from '../types';
import { taskFor } from 'ember-concurrency-ts';

export default class TocService extends Service {
  @service fetch!: FetchService;

  @dropTask fetchPagesSparseTask = taskFor(function* (
    this: TocService
  ): TaskGenerator<PageSparse[]> {
    return (yield this.fetch.fetchPagesWithShoebox()) as PageSparse[];
  });

  get pagesSparseSorted(): PageSparse[] | null {
    return (
      this.fetchPagesSparseTask.last?.value?.slice().sort((a, b) => a.id.localeCompare(b.id)) ??
      null
    );
  }

  @cached
  get pageSparseIndexWithEmptyChildren(): PageSparseWithChildren | undefined {
    if (!this.pagesSparseSorted) return;

    const pageSparseIndex = this.pagesSparseSorted.find((page) => page.id === 'index');

    if (!pageSparseIndex) {
      throw new Error('index page missing. Please create.');
    }

    return {
      ...pageSparseIndex,
      children: {},
    };
  }

  @cached
  get pageSparseIndexWithChildren(): PageSparseWithChildren | undefined {
    if (!this.pageSparseIndexWithEmptyChildren || !this.pagesSparseSorted) return;

    return this.pagesSparseSorted.reduce(
      (result: PageSparseWithChildren, pageSparse: PageSparse) => {
        if (pageSparse.id !== 'index') {
          const path = pageSparse.id.split('/');
          let parent: PageSparseWithChildren = result;

          path.forEach((id: string, index: number) => {
            if (index === path.length - 1) {
              parent.children[id] = {
                ...pageSparse,
                children: {},
                parent,
              };
            } else {
              if (!parent.children[id]) {
                throw new Error(
                  `Found page ${pageSparse.id}, but its parent does not exist. Please create.`
                );
              }

              parent = parent.children[id];
            }
          });
        }

        return result;
      },
      this.pageSparseIndexWithEmptyChildren
    ) as PageSparseWithChildren; // ToDo: avoid type casting https://github.com/microsoft/TypeScript/issues/25454
  }
}
