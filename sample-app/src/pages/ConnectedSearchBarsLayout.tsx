import Navigation from '../components/Navigation';
import { useAnswersState } from '@yext/answers-headless-react';
import { universalResultsConfig } from '../universalResultsConfig';
import { LayoutComponent } from '../PageRouter';
import SearchBar from '../components/SearchBar';
import SampleVisualSearchBar from '../components/VisualAutocomplete/SampleVisualSearchBar';
import { useContext, useReducer } from 'react';
import { ConnectedSearchBarsContext } from '../components/contexts/SearchbarsContext';

const navLinks = [
  {
    to: '/',
    label: 'All'
  },
  ...Object.entries(universalResultsConfig).map(([verticalKey, config]) => ({
    to: verticalKey,
    label: config.label || verticalKey
  }))
]

/**
 * A LayoutComponent that provides a SearchBar and Navigation tabs to a given page.
 */
const ConnectedSearchBarsLayout: LayoutComponent = ({ page }) => {
  const isVertical = useAnswersState(state => !!state.vertical.verticalKey);
  const { searchBarsInput } = useContext(ConnectedSearchBarsContext);
  const [_, forceUpdate] = useReducer(x => !x, false);

  return (
    <>
      <ConnectedSearchBarsContext.Provider value={{ searchBarsInput }}>
        {isVertical
          ? <SearchBar
            onSubmit={(value: string|undefined) => {
              if (value) {
                searchBarsInput['main-experience-searchbar'] = value;
                forceUpdate();
              }
            }}
            customCssClasses={{
              container: 'w-5/12 h-8 mb-20 ml-auto'
            }}
            placeholder='Search...'
            isVertical={isVertical}
            screenReaderInstructionsId='SearchBar__srInstructions'
            searchBarId='top-right-searchbar'
          />
          : <SampleVisualSearchBar 
            searchBarId='top-right-searchbar'
            onSubmit={(value: string|undefined) => {
              if (value) {
                searchBarsInput['main-experience-searchbar'] = value;
                forceUpdate();
              }
            }}
            customCssClasses={{
              container: 'w-5/12 h-8 mb-20 ml-auto'
            }}
          />
        }
        {isVertical
          ? <SearchBar
            placeholder='Search...'
            isVertical={isVertical}
            screenReaderInstructionsId='SearchBar__srInstructions'
            searchBarId='main-experience-searchbar'
          />
          : <SampleVisualSearchBar 
            searchBarId='main-experience-searchbar'
          />
        }
      </ConnectedSearchBarsContext.Provider>
      <Navigation links={navLinks} />
      {page}
    </>
  )
}
export default ConnectedSearchBarsLayout;