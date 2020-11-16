interface PageAttributesSparse {
  title?: string;
  index?: number;
}

export interface PageSparse {
  id: string;
  type: 'project';
  attributes: PageAttributesSparse;
}

interface PageAttributes extends PageAttributesSparse {
  html: string;
}

export interface Page extends PageSparse {
  attributes: PageAttributes;
}

export interface PageSparseWithChildren extends PageSparse {
  children: Record<string, PageSparseWithChildren>;
  parent?: PageSparseWithChildren;
}

//

export interface ResponseArray<T> {
  data: T[];
}

export interface ResponseSingle<T> {
  data: T;
}
