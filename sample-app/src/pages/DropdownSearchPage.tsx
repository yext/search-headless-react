import { useState } from 'react';
import { SearchIntent, useAnswersActions } from '@yext/answers-headless-react';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { ReactComponent as Chevron } from '../icons/chevron.svg';
import SearchBar from '../components/SearchBar';
import DropdownSection from '../components/DropdownSection';
import { executeSearch, getSearchIntents, updateLocationIfNeeded } from '../utils/search-operations';

import '../sass/DropdownSearchPage.scss'
import { Link } from 'react-router-dom';

export default function DropdownSearchPage(): JSX.Element {

  const answersActions = useAnswersActions();

  const [isVertical, setIsVertical] = useState(true);
  const [shouldDisplayDropdown, setShouldDisplayDropdown] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState('people');

  const options = [{
    value: 'people',
    display: renderOption('people')
  }, {
    value: 'financial_professionals',
    display: renderOption('financial_professionals')
  },{
    value: 'events',
    display: renderOption('events')
  },{
    value: 'all',
    display: renderOption('all')
  }];

  function renderOption(value: string) {
    return (
      <div>
        {value}
      </div>
    );
  }

  function renderSearchButton () {
    return (
      <button
        className='SearchBar__submitButton'
        onClick={executeQuery}
      >
        <Link className='StandardSection__sectionLink' to={isVertical ? `/${selectedOptionValue}` : '/'}>
          <MagnifyingGlassIcon />
        </Link>
      </button>
    )
  }

  const executeQuery = async () => {
    let searchIntents: SearchIntent[] = [];
    if (!answersActions.state.location.userLocation) {
      searchIntents = await getSearchIntents(answersActions, isVertical) || [];
      await updateLocationIfNeeded(answersActions, searchIntents);
    }
    executeSearch(answersActions, isVertical);
  };

  return (
    <div className='dropdown-search-page'>
      <div className='dropdown'>
        <button
          className='Dropdown__toggleButton'
          onClick={() => {
            setShouldDisplayDropdown(!shouldDisplayDropdown);
          }}
        >
          <div className='drodown-label'>
            {selectedOptionValue}
          </div>
          <div className='chevron'>
            <Chevron />
          </div>
        </button>
        { shouldDisplayDropdown &&
          <DropdownSection
            options={options}
            optionIdPrefix='Search-'
            onClickOption={(option) => {
              if (option.value === 'all') {
                setIsVertical(false);
                answersActions.setVerticalKey('');
                answersActions.setState({
                  ...answersActions.state,
                  vertical: {}
                });
              } else {
                setIsVertical(true);
                answersActions.setVerticalKey(option.value);
                answersActions.setState({
                  ...answersActions.state,
                  universal: {}
                });
              }
              setSelectedOptionValue(option.value);
              setShouldDisplayDropdown(false);
            }}
            cssClasses={{
              sectionContainer: 'Autocomplete__dropdownSection',
              sectionLabel: 'Autocomplete__sectionLabel',
              optionsContainer: 'Autocomplete_sectionOptions',
              option: 'Autocomplete__option',
              focusedOption: 'Autocomplete__option--focused'
            }}
          />
        }
      </div>
      <SearchBar
        placeholder='Search...'
        isVertical={isVertical}
        screenReaderInstructionsId='SearchBar__srInstructions'
        renderCustomSearchButton={renderSearchButton}
      />
    </div>
  );
}
