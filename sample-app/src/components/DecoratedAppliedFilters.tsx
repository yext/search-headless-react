import AppliedFilters from "./AppliedFilters";
import { useAnswersState } from '@yext/answers-headless-react';
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
  delimiter?: string
}

/**
 * Container component for AppliedFilters
 */
export default function DecoratedAppliedFilters({showFieldNames, hiddenFields = [], labelText, delimiter} : Props): JSX.Element {
  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);

  let nlpFilters = useAnswersState(state => state.vertical.results?.verticalResults.appliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);
  const groupedFilters: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);
  
  return (
    <AppliedFilters showFieldNames={showFieldNames} labelText={labelText} delimiter= {delimiter} appliedFilters={groupedFilters}/>
  );
}

