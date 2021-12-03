import { StandardCard } from './components/cards/StandardCard';
import { VerticalConfig } from './components/UniversalResults';

export type UniversalResultsConfig = Record<string, VerticalConfig>;

export const universalResultsConfig: UniversalResultsConfig = {
  people: {
    label: 'People',
    viewAllButton: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: false
    }
  },
  events: {
    label: 'Events',
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: false
    }
  },
  links: {
    label: 'Links',
    viewAllButton: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: false
    }
  },
  financial_professionals: {
    label: 'Financial Professionals',
  },
  healthcare_professionals: {
    label: 'Healthcare Professionals',
  }
}