import { CardProps } from '../../models/cardComponent';

/**
 * This Component renders the base result card.
 * 
 * @param props - An object containing the result itself.
 */
export default function StandardCard(props: CardProps): JSX.Element {
  return (
    <div className='yxt-StandardCard'>
      <div>{props.result.name}</div>
    </div>
  );
}