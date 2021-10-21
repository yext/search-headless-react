import { NearFilterValue, Matcher } from '@yext/answers-core';

export interface DisplayableFilter {
  filterType: 'NLP_FILTER' | 'STATIC_FILTER' | 'FACET',
  fieldId: string,
  matcher: Matcher,
  value: string | number | boolean | NearFilterValue,
  count?: number,
  groupLabel: string,
  label: string
}
