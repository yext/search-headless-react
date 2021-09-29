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
  mapStateToAppliedQueryFilters: StateSelector<AppliedQueryFilter[] | undefined>
}

export interface UniversalAppliedFiltersConfig {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  filters: AppliedQueryFilter[] | undefined
}

/**
 * Container component for AppliedFilters
 */
export default function DecoratedAppliedFilters(props : DecoratedAppliedFiltersConfig): JSX.Element {
  const {hiddenFields = [], mapStateToAppliedQueryFilters, ...otherProps} = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = useAnswersState(mapStateToAppliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}

/**
 * Container component for AppliedFilters for universal results
 */
 export function UniversalAppliedFilters(props : UniversalAppliedFiltersConfig): JSX.Element {
  const {hiddenFields = [], filters, ...otherProps} = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = filters || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);

  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}