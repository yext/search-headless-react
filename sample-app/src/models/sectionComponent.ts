import { Result } from "@yext/answers-core";
import { CardConfig } from './cardComponent';

export interface VerticalConfig {
  SectionComponent?: SectionComponent,
  cardConfig?: CardConfig,
  label?: string,
  viewMore?: boolean
}

export interface SectionConfig {
  results: Result[],
  verticalKey: string,
  header?: JSX.Element,
  cardConfig?: CardConfig,
  viewMore?: boolean
}

/**
 * A component that can be used to render a section template for vertical results.
 */
export type SectionComponent = (props: SectionConfig) => JSX.Element | null;
