import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import { useAnswersState } from '@yext/answers-headless-react';
import { universalResultsConfig } from './universalResultsConfig';

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

export default function Layout({ page }: { page: JSX.Element }) {
  const isVertical = useAnswersState(state => !!state.vertical.key);
  return (
    <div className='App'>
      <SearchBar
        placeholder='Search...'
        isVertical={isVertical}
      />
      <Navigation links={navLinks} />
      {page}
    </div>
  )
}