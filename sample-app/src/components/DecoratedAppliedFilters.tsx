import AppliedFilters from "./AppliedFilters";
import { AppliedQueryFilter } from "@yext/answers-core";
import { useAnswersState } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
import withMapping from "./utils/withMapping";
import { 
  getAppliedFilters,
  pruneAppliedFilters, 
  pruneNlpFilters, 
  createGroupedFilters 
} from '../utils/filterutils';

export interface DecoratedAppliedFiltersConfig {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  appliedQueryFilters: AppliedQueryFilter[] | undefined
}

/**
 * Container component for AppliedFilters
 */
export function DecoratedAppliedFilters(props : DecoratedAppliedFiltersConfig): JSX.Element {
  const { hiddenFields = [], appliedQueryFilters, ...otherProps } = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = appliedQueryFilters || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}

export const MappedDecoratedAppliedFilters = withMapping(DecoratedAppliedFilters, {
  appliedQueryFilters: state => state.vertical?.results?.verticalResults.appliedQueryFilters
});
