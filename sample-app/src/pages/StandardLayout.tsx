import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import { useAnswersState } from '@yext/answers-headless-react';
import { universalResultsConfig } from '../universalResultsConfig';
import { LayoutComponent } from '../PageRouter';

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
      <SearchBar
        placeholder='Search...'
        isVertical={isVertical}
        screenReaderInstructionsId='SearchBar__srInstructions'
      />
      <Navigation links={navLinks} />
      {page}
    </>
  )
}
export default StandardLayout;