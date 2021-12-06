import { Result, VerticalResults, UniversalLimit } from '@yext/answers-headless-react';
import { isValidElement, ReactNode } from 'react';
import recursivelyMapChildren from '../utils/recursivelyMapChildren';

interface EntityPreviewProps {
  verticalKey: string,
  children: (results: Result[]) => JSX.Element,
  limit?: number
}

/**
 * EntityPreview is intended for use within VisualSearchBar's renderEntityPreviews.
 * It provides results corresponding to its verticalKey through a props.children FACC.
 *
 * @remarks
 * You can optionally specify a limit for the results. This limit will be shared between
 * instances of EntityPreview with the same verticalKey.
 */
export default function EntityPreview(_: EntityPreviewProps) {
  return null;
}

/**
 * Recursively passes vertical results into instances of EntityPreview.
 */
export function transformEntityPreviews(entityPreviews: JSX.Element, verticalResultsArray: VerticalResults[]) {
  const verticalKeyToResults = getVerticalKeyToResults(verticalResultsArray);
  const renderedChildren = recursivelyMapChildren(entityPreviews, child => {
    if (!isValidElement(child) || child.type !== EntityPreview) {
      return child;
    }
    const { verticalKey, children } = child.props as EntityPreviewProps;
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
 * Calculates the restrictedVerticals query param from a ReactNode containing EntityPreview..
 * TODO: Currently unused, will be used in follow up PR after restricted verticals support is added to answers headless.
 */
export function calculateRestrictedVerticals(children: ReactNode): string[] {
  const restrictedVerticalsSet = new Set<string>();
  recursivelyMapChildren(children, c => {
    if (isValidElement(c) && c.type === EntityPreview) {
      const { verticalKey } = c.props as EntityPreviewProps;
      restrictedVerticalsSet.add(verticalKey);
    }
    return c;
  });
  return Array.from(restrictedVerticalsSet);
}

/**
 * Calculates the universalLimit query param from a ReactNode containing EntityPreview.
 */
export function calculateUniversalLimit(children: ReactNode): UniversalLimit {
  const universalLimit: Record<string, number | null> = {};
  recursivelyMapChildren(children, c => {
    if (isValidElement(c) && c.type === EntityPreview) {
      const { verticalKey, limit } = c.props as EntityPreviewProps;
      universalLimit[verticalKey] = limit || null;
    }
    return c;
  });
  return Object.keys(universalLimit).reduce<UniversalLimit>((limitWithDefaults, verticalKey) => {
    limitWithDefaults[verticalKey] = universalLimit[verticalKey] ?? 5;
    return limitWithDefaults;
  }, {})
}