import { CardProps } from '../../models/cardComponent';
import renderWithHighlighting from '../utils/renderWithHighlighting';

export interface StandardCardConfig {
  showOrdinal?: boolean
}

export interface StandardCardProps extends CardProps {
  configuration: StandardCardConfig
}

/**
 * This Component renders the base result card.
 * 
 * @param props - An object containing the result itself.
 */
export function StandardCard(props: StandardCardProps): JSX.Element {
  const { configuration, result } = props;
  if (result.highlightedFields) { console.log (result.highlightedFields)}
  return (
    <div className='StandardCard'>
      {configuration.showOrdinal && result.index && renderOrdinal(result.index)}
      <div className='StandardCard__contentWrapper'>
        {result.name && renderTitle(result.name)}
      </div>
    </div>
  );
}

function renderOrdinal(ordinal: number) {
  return (
    <div className='StandardCard__ordinalWrapper'>
      <div className='StandardCard__ordinal'>
        {ordinal}
      </div>
    </div>
  );
}

function renderTitle(title: string) {
  return <div className='StandardCard__title'>{title}</div>
}