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
  appliedQueryFilters?: AppliedQueryFilter[] | undefined
  mapStateToAppliedQueryFilters?: StateSelector<AppliedQueryFilter[] | undefined>
}


/**
 * Container component for AppliedFilters
 */
export default function DecoratedAppliedFilters(props : DecoratedAppliedFiltersConfig): JSX.Element {
  const { 
    hiddenFields = [],
    appliedQueryFilters,
    mapStateToAppliedQueryFilters = state => state.vertical?.results?.verticalResults.appliedQueryFilters, 
    ...otherProps
  } = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = useAnswersState(mapStateToAppliedQueryFilters) || [];
  if (appliedQueryFilters) {
    nlpFilters = appliedQueryFilters || [];
  }
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}
