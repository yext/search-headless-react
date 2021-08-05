import { Result } from '@yext/answers-core';
import { StandardCardConfig } from '../components/cards/StandardCard';

/**
 * The config types for each supported card.
 */
 export type CardConfigTypes = StandardCardConfig;

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