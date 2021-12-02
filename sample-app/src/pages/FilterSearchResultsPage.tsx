import { useAnswersActions, Filter } from '@yext/answers-headless-react';
import FilterSearch from '../components/FilterSearch';
import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import DecoratedAppliedFilters from '../components/DecoratedAppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import '../sass/FilterSearchPage.scss';
import { StandardCard } from '../components/cards/StandardCard';
import { useLocation } from 'react-router';
import { FilterSeachPageLocationParams } from './FilterSearchPage';
import { useLayoutEffect, useRef } from 'react';
import LocationFilterSearch from '../components/LocationFilterSearch';

const filterSearchNameField = [{
  fieldApiName: 'name',
  entityType: 'ce_person'
}];

const filterSearchLocationField = [{
  fieldApiName: 'builtin.location',
  entityType: 'ce_person'
}];

const filterSearchLanguageField = [{
  fieldApiName: 'languages',
  entityType: 'ce_person'
}];

const staticFiltersGroupLabels = {
  c_employeeCountry: 'Employee Country',
  c_employeeDepartment: 'Employee Deparment'
}


export default function FilterSearchPageResults(props: { verticalKey: string }) {
  const { verticalKey } = props;
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    answersActions.setVerticalKey(verticalKey);
  });
  const onSubmit = () => {
    answersActions.setQuery('');
    answersActions.executeVerticalQuery();
  };
  const location = useLocation<FilterSeachPageLocationParams>();
  console.log(location.state);

  const selectedOptionRef = useRef<FilterSeachPageLocationParams>(location.state); 

  return (
    <div className='FilterSearchPage'>
      <div className='FilterSearchPage__filtersContainer'>
        <FilterSearch
          title='Filter Search for name!'
          onSelectOption={(optionValue: string, filter: Filter|undefined) => {
            const selectedOptionFilter = selectedOptionRef.current.filterSearchNameOption?.filter;
            selectedOptionFilter &&  answersActions.setFilterOption({ ...selectedOptionFilter, selected: false })
            selectedOptionRef.current.filterSearchNameOption = { optionValue, filter };
          }}
          inputValue={selectedOptionRef.current.filterSearchNameOption?.optionValue || ''}
          sectioned={false}
          searchFields={filterSearchNameField}
          screenReaderInstructionsId='FilterSearch-Name'
          customCssClasses={{
            inputElement: 'FilterSearchPage__inputElement',
            dropdownContainer: 'Autocomplete FilterSearchPage__autocompleteContainter'
          }}
        />
        <LocationFilterSearch
          title='Filter Search for location!'
          inputValue={selectedOptionRef.current.filterSearchLocationOption?.optionValue || ''}
          onSelectOption={(optionValue: string, filter: Filter|undefined) => {
            const selectedOptionFilter = selectedOptionRef.current.filterSearchLocationOption?.filter;
            selectedOptionFilter &&  answersActions.setFilterOption({ ...selectedOptionFilter, selected: false })
            selectedOptionRef.current.filterSearchLocationOption = { optionValue, filter };
          }}
          sectioned={false}
          searchFields={filterSearchLocationField}
          screenReaderInstructionsId='FilterSearch-Location'
          customCssClasses={{
            inputElement: 'FilterSearchPage__inputElement',
            dropdownContainer: 'Autocomplete FilterSearchPage__autocompleteContainter'
          }}
        />
        <FilterSearch
          title='Filter Search for languages!'
          onSelectOption={(optionValue: string, filter: Filter|undefined) => {
            const selectedOptionFilter = selectedOptionRef.current.filterSearchLanguageOption?.filter;
            selectedOptionFilter &&  answersActions.setFilterOption({ ...selectedOptionFilter, selected: false })
            selectedOptionRef.current.filterSearchLanguageOption = { optionValue, filter };
          }}
          inputValue={selectedOptionRef.current.filterSearchLanguageOption?.optionValue || ''}
          sectioned={false}
          searchFields={filterSearchLanguageField}
          screenReaderInstructionsId='FilterSearch-Language'
          customCssClasses={{
            inputElement: 'FilterSearchPage__inputElement',
            dropdownContainer: 'Autocomplete FilterSearchPage__autocompleteContainter'
          }}
        />
        <button onClick={onSubmit}>Submit</button>
      </div>
      <div className="FilterSearchResultsPage__results">
        <DirectAnswer />
        <ResultsCount />
        <DecoratedAppliedFilters
          showFieldNames={true}
          hiddenFields={['builtin.entityType']}
          delimiter='|'
          staticFiltersGroupLabels={staticFiltersGroupLabels}
        />
        <AlternativeVerticals
          currentVerticalLabel='People'
          verticalsConfig={[
            { label: 'Locations', verticalKey: 'KM' },
            { label: 'FAQs', verticalKey: 'faq' }
          ]}
        />
        <VerticalResults
          CardComponent={StandardCard}
          cardConfig={{ showOrdinal: true }}
          displayAllResults={true}
        />
      </div>
    </div>
  );
}