import AppliedFilters from "./AppliedFilters";
import { AppliedQueryFilter } from "@yext/answers-core";
import { StateMapper, useAnswersState } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
import { 
  getAppliedFilters,
  pruneAppliedFilters, 
  pruneNlpFilters, 
  createGroupedFilters 
} from '../utils/filterutils';

interface Props {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  mapStateToAppliedQueryFilters: StateMapper<AppliedQueryFilter[] | undefined>
}

/**
 * Container component for AppliedFilters
 */
export default function DecoratedAppliedFilters(props : Props): JSX.Element {
  const {hiddenFields = [], mapStateToAppliedQueryFilters, ...otherProps} = props;
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  let nlpFilters = useAnswersState(mapStateToAppliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}

