import StandardSection from "./StandardSection";
import { Result } from "@yext/answers-core";
import { CardConfig } from '../models/cardComponent';
import { DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";

export interface VerticalConfig {
  sectionTemplate?: string,
  cardConfig?: CardConfig,
  label?: string,
  limit?: number,
  viewMore?: boolean
}

export interface SectionTemplateConfig {
  results: Result[],
  resultsCount: number,
  verticalKey: string,
  verticalConfig: VerticalConfig,
  appliedFilters?: DecoratedAppliedFiltersConfig,
}

/**
 * A functional component that can be used to render a section template for vertical results.
 */
type SectionComponent = (props: SectionTemplateConfig) => JSX.Element | null;

export const SectionTemplateRegistry: Record<string, SectionComponent> = {
  StandardSection
}
