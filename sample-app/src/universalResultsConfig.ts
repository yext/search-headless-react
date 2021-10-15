
import { StandardCard } from './components/cards/StandardCard';

export const universalResultsConfig = {
  people: {
    label: 'People',
    viewMore: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  events: {
    label: 'Events',
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  links: {
    label: 'Links',
    viewMore: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  financial_professionals: {
    label: 'Financial Professionals',
  },
  healthcare_professionals: {
    label: 'Healthcare Professionals',
  }
}