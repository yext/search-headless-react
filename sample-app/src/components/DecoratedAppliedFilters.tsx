import AppliedFilters from "./AppliedFilters";
import { AppliedQueryFilter } from "@yext/answers-core";
import { useAnswersState } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
import { 
  getAppliedFilters,
  pruneAppliedFilters, 
  pruneNlpFilters, 
  createGroupedFilters 
} from '../utils/filterutils';
import subscribeToAnswersUpdates from './utils/subscribeToAnswersUpdates';

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
export function DecoratedAppliedFiltersDisplay(props : DecoratedAppliedFiltersConfig): JSX.Element {
  const { hiddenFields = [], appliedQueryFilters, ...otherProps } = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = appliedQueryFilters || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}

export default subscribeToAnswersUpdates<DecoratedAppliedFiltersConfig, Omit<DecoratedAppliedFiltersConfig, 'appliedQueryFilters'>>(
  DecoratedAppliedFiltersDisplay, 
  props => {
    const appliedQueryFilters = useAnswersState(state => state.vertical?.results?.verticalResults.appliedQueryFilters);
    return { ...props, appliedQueryFilters };
  }
);
