import Component from '@glimmer/component';
import { PageSparseWithChildren } from '../types';
import { cached } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import TocService from '../services/toc';

export interface TocComponentArgs {
  pageSparseWithChildren?: PageSparseWithChildren;
  noIndex?: boolean;
}

export default class TocComponent extends Component<TocComponentArgs> {
  @service toc!: TocService;

  get pageSparseWithChildren(): PageSparseWithChildren | undefined {
    return this.args.pageSparseWithChildren ?? this.toc.pageSparseIndexWithChildren;
  }

  @cached
  get pagesSorted(): PageSparseWithChildren[] {
    if (!this.pageSparseWithChildren) return [];

    return Object.values(this.pageSparseWithChildren.children).sort(
      (a, b) => (a.attributes.index || 0) - (b.attributes.index || 0)
    );
  }
}
