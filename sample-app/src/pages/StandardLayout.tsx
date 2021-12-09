import Navigation from '../components/Navigation';
import { useAnswersState } from '@yext/answers-headless-react';
import { universalResultsConfig } from '../universalResultsConfig';
import { LayoutComponent } from '../PageRouter';
import SearchBar from '../components/SearchBar';
import SampleVisualSearchBar from '../components/VisualAutocomplete/SampleVisualSearchBar';

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
const StandardLayout: LayoutComponent = ({ page }) => {
  const isVertical = useAnswersState(state => !!state.vertical.verticalKey);
  return (
    <>
      {isVertical
        ? <SearchBar
          placeholder='Search...'
          isVertical={isVertical}
          screenReaderInstructionsId='SearchBar__srInstructions'
        />
        : <SampleVisualSearchBar />
      }
      <Navigation links={navLinks} />
      {page}
    </>
  )
}
export default StandardLayout;