import { NearFilterValue, Matcher } from '@yext/answers-core';

export interface DisplayableAppliedFilter {
  filterType: 'NLP_FILTER' | 'STATIC_FILTER' | 'FACET',
  fieldId: string,
  matcher: Matcher,
  value: string | number | boolean | NearFilterValue,
  groupLabel: string,
  label: string
}
