import { CardComponent } from '../../models/cardComponent';
import { CardType } from '../../models/cardTypes';
import StandardCard from './StandardCard';

const cardRegistry: Record<CardType, CardComponent> = {
  [CardType.Standard]: StandardCard
}

/**
 * Returns the Component class corresponding to the provided card type.
 * 
 * @param type - The card type.
 */
export function getComponentClassFromType(type: CardType): CardComponent {
  if (type in Object.keys(cardRegistry)) {
    return cardRegistry[type];
  } else {
    throw Error(`${type} is not a supported card type`);
  }
}