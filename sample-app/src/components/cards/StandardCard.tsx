import { CardProps } from '../../models/cardComponent';

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

  return (
    <div className='yxt-StandardCard'>
      {configuration.showOrdinal && result.index && renderOrdinal(result.index)}
      <div className='yxt-StandardCard-contentWrapper'>
        {result.name && renderTitle(result.name)}
      </div>
    </div>
  );
}

function renderOrdinal(ordinal: number) {
  return (
    <div className='yxt-StandardCard-ordinalWrapper'>
      <div className='yxt-StandardCard-ordinal'>
        {ordinal}
      </div>
    </div>
  );
}

function renderTitle(title: string) {
  return <div className='yxt-StandardCard-title'>{title}</div>
}