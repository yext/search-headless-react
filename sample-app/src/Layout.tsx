import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import { useAnswersState } from '@yext/answers-headless-react';
import { universalResultsConfig } from './universalResultsConfig';
import { LayoutComponent } from './PageRouter';

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
 * A LayoutComponent that renders a page with a SearchBar and Navigation tabs.
 */
const Layout: LayoutComponent = ({ page }) => {
  const isVertical = useAnswersState(state => !!state.vertical.key);
  return (
    <>
      <SearchBar
        placeholder='Search...'
        isVertical={isVertical}
      />
      <Navigation links={navLinks} />
      {page}
    </>
  )
}
export default Layout;