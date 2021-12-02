import { useHistory } from 'react-router';
import { useAnswersActions, Filter } from '@yext/answers-headless-react';
import FilterSearch from '../components/FilterSearch';
import LocationFilterSearch from '../components/LocationFilterSearch';
import '../sass/FilterSearchPage.scss';
import { useRef } from 'react';

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

interface SelectedFilterSearchOption {
  optionValue: string,
  filter: Filter|undefined
}

export interface FilterSeachPageLocationParams {
  filterSearchNameOption: SelectedFilterSearchOption | null,
  filterSearchLocationOption: SelectedFilterSearchOption | null,
  filterSearchLanguageOption: SelectedFilterSearchOption | null
}

export default function FilterSearchPage(props: { verticalKey: string }) {
  const { verticalKey } = props;
  const answersActions = useAnswersActions();
  answersActions.setStaticFilters([]);
  answersActions.setVerticalKey(verticalKey);
  const history = useHistory();
  const selectedOptionRef = useRef<FilterSeachPageLocationParams>({
    filterSearchNameOption: null,
    filterSearchLocationOption: null,
    filterSearchLanguageOption: null,
  }); 

  const onSubmit = () => {
    answersActions.setQuery('');
    answersActions.executeVerticalQuery();
    history.push({
      pathname:'/filter-search-results-page',
      state: selectedOptionRef.current
    })
  };

  return (
    <div className='FilterSearchPage'>
      <h1 style={{ margin: '100px' }}>Some other website content...</h1>
      <div className='FilterSearchPage__filtersContainer'>
        <FilterSearch
          title='Filter Search for name!'
          onSelectOption={(optionValue: string, filter: Filter|undefined) => {
            const selectedOptionFilter = selectedOptionRef.current.filterSearchNameOption?.filter;
            selectedOptionFilter &&  answersActions.setFilterOption({ ...selectedOptionFilter, selected: false })
            selectedOptionRef.current.filterSearchNameOption = { optionValue, filter };
          }}
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
      <h1 style={{ margin: '100px' }}>Some other website content...</h1>
    </div>
  );
}