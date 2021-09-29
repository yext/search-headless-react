import StandardSection from "./StandardSection";
import { Result } from "@yext/answers-core";
import { CardConfig } from '../models/cardComponent';
import { UniversalAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";

export interface VerticalConfig {
  sectionTemplate?: string,
  cardConfig?: CardConfig,
  label?: string,
  limit?: number,
  viewMore?: boolean
}

export interface SectionTemplateConfig {
  results: Result[],
  verticalKey: string,
  verticalConfig: VerticalConfig,
  appliedFilters?: UniversalAppliedFiltersConfig,
}

/**
 * A functional component that can be used to render a section template for vertical results.
 */
type SectionComponent = (props: SectionTemplateConfig) => JSX.Element | null;

export const SectionTemplateRegistry: Record<string, SectionComponent> = {
  StandardSection
}
