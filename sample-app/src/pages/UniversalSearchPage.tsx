import UniversalResults from '../components/UniversalResults';
import DirectAnswer from '../components/DirectAnswer';
import { UniversalResultsConfig } from '../universalResultsConfig';
import SpellCheck from '../components/SpellCheck';
import usePage from '../hooks/usePage';

const universalResultsFilterConfig = {
  show: true
};

export default function UniversalSearchPage(props: { universalResultsConfig: UniversalResultsConfig}) {
  const { universalResultsConfig } = props;
  usePage();

  return (
    <div>
      <SpellCheck
        isVertical={false}
      />
      <DirectAnswer />
      <UniversalResults
        appliedFiltersConfig={universalResultsFilterConfig}
        verticalConfigs={universalResultsConfig}
      />
    </div>
  );
}