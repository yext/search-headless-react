import { Result } from '@yext/answers-core';
import { CardConfigTypes } from '../components/cards/cardRegistry';

/**
 * The props provided to every {@link CardComponent).
 */
export interface CardProps {
  result: Result,
  configuration: CardConfigTypes
}

/**
 * A functional component that can be used to render a result card.
 */
export type CardComponent = (props: CardProps) => JSX.Element;