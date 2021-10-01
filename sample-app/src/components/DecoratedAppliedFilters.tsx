import AppliedFilters from "./AppliedFilters";
import { AppliedQueryFilter } from "@yext/answers-core";
import { StateSelector, useAnswersState } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
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

interface DecoratedAppliedFiltersConfigWithMapping {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  mapStateToAppliedQueryFilters: StateSelector<AppliedQueryFilter[] | undefined>
}

//= state => state.vertical?.results?.verticalResults.appliedQueryFilters

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

/**
 * Container component for AppliedFilters with mapping in props
 */
export function DecoratedAppliedFiltersWithMapping(props : DecoratedAppliedFiltersConfigWithMapping): JSX.Element {
  const { hiddenFields = [], mapStateToAppliedQueryFilters, ...otherProps } = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = useAnswersState(mapStateToAppliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}
