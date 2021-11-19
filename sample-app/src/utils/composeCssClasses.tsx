import { composeTheme } from '@css-modules-theme/core';
import { Compose, Theme } from '@css-modules-theme/core';

/**
 * The method of combining a component's built-in CSS classes with custom CSS classes
 * @remarks
 * Merge keeps the component's built-in classes and adds the custom classes to them (default).
 * Replace ignore all of the component’s built-in classes and only uses the custom classes.
 * Assign keeps the component's built-in classes, however custom classes will completely override their associated built-in classes.
 */
export type Composition = 'merge' | 'replace' | 'assign';

/**
 * Combines a component's built-in CSS classes with custom CSS classes.
 * @param builtInClasses The component's built-in css classes
 * @param customClasses The custom classes to combine with the built-in ones
 * @param composition The method of combining the built-in classes with the custom classes
 * @returns 
 */
export function composeCssClasses<ClassInterface> (
  builtInClasses: ClassInterface,
  customClasses?: ClassInterface,
  composition?: Composition
): ClassInterface | Theme {
  if (!isThemeObject(customClasses)) {
    return builtInClasses;
  }
  if (!isThemeObject(builtInClasses)) {
    return customClasses ?? {};
  }
  const compose = getCssModulesCompose(composition);
  return composeTheme([{ theme: builtInClasses }, { theme: customClasses, compose }]);
}

/**
 * Transforms the Composition types to the Compose types of the css-modules-theme library
 * @param composition The composition method
 * @returns 
 */
function getCssModulesCompose(composition?: Composition): Compose {
  if (composition === 'replace') {
    return Compose.Replace;
  } else if (composition === 'assign') {
    return Compose.Assign;
  } else {
    return Compose.Merge;
  }
}

/**
 * Returns true if the object can be used a as css-modules-theme Theme
 * @param obj The object to test
 * @returns 
 */
function isThemeObject (obj: unknown): obj is Theme {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  return true;
}