import { Result, VerticalResults, UniversalLimit } from '@yext/answers-headless-react';
import { isValidElement, ReactNode } from 'react';
import recursivelyMapChildren from '../utils/recursivelyMapChildren';

interface VisualEntitiesProps {
  verticalKey: string,
  children: (results: Result[]) => JSX.Element,
  limit?: number
}

/**
 * VisualEntities is intended for use within VisualSearchBar's renderVisualEntities.
 * It provides results corresponding to its verticalKey through a props.children FACC.
 *
 * @remarks
 * You can optionally specify a limit for the results. This limit will be shared between
 * instances of VisualEntities with the same verticalKey.
 */
export default function VisualEntities(_: VisualEntitiesProps) {
  return null;
}

/**
 * Recursively passes vertical results into instances of VisualEntities.
 */
export function transformVisualEntities(visualEntities: JSX.Element, verticalResultsArray: VerticalResults[]) {
  const verticalKeyToResults = getVerticalKeyToResults(verticalResultsArray);
  const renderedChildren = recursivelyMapChildren(visualEntities, child => {
    if (!isValidElement(child) || child.type !== VisualEntities) {
      return child;
    }
    const { verticalKey, children } = child.props as VisualEntitiesProps;
    if (!(verticalKey in verticalKeyToResults)) {
      return null;
    }
    return children(verticalKeyToResults[verticalKey]);
  });
  return <>{renderedChildren}</>
}

/**
 * @returns a mapping of vertical key to VerticalResults
 */
function getVerticalKeyToResults(verticalResultsArray: VerticalResults[]): Record<string, Result[]> {
  return verticalResultsArray.reduce<Record<string, Result[]>>((prev, current) => {
    prev[current.verticalKey] = current.results;
    return prev;
  }, {});
}

/**
 * Calculates the restrictedVerticals query param from a ReactNode containing VisualEntities..
 * TODO: Currently unused, will be used in follow up PR after restricted verticals support is added to answers headless.
 */
export function calculateRestrictedVerticals(children: ReactNode): string[] {
  const restrictedVerticalsSet = new Set<string>();
  recursivelyMapChildren(children, c => {
    if (isValidElement(c) && c.type === VisualEntities) {
      const { verticalKey } = c.props as VisualEntitiesProps;
      restrictedVerticalsSet.add(verticalKey);
    }
    return c;
  });
  return Array.from(restrictedVerticalsSet);
}

/**
 * Calculates the universalLimit query param from a ReactNode containing VisualEntities.
 */
export function calculateUniversalLimit(children: ReactNode): UniversalLimit {
  const universalLimit: Record<string, number | null> = {};
  recursivelyMapChildren(children, c => {
    if (isValidElement(c) && c.type === VisualEntities) {
      const { verticalKey, limit } = c.props as VisualEntitiesProps;
      universalLimit[verticalKey] = limit || null;
    }
    return c;
  });
  return Object.keys(universalLimit).reduce<UniversalLimit>((limitWithDefaults, verticalKey) => {
    limitWithDefaults[verticalKey] = universalLimit[verticalKey] ?? 5;
    return limitWithDefaults;
  }, {})
}