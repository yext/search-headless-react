import { Filter } from '@yext/answers-core';

export interface DisplayableFilter {
  filterType: 'NLP_FILTER' | 'STATIC_FILTER' | 'FACET',
  filter: Filter,
  groupLabel: string,
  label: string,
  filterCollectionId?: string
}
