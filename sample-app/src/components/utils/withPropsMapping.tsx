import { StateSelector, useAnswersState } from '@yext/answers-headless-react'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type GenericComponent<T> = (props: T) => JSX.Element | null;

type PropsMapping<T> = {
  [arg in keyof T]: StateSelector<T[arg]>
}

/**
 * a HOC that returns a new component wraps around the given component. It generate
 * the appropriate props through userAnswersState calls and an optional transform 
 * function to reuse the given component's logic.
 * 
 * @param Component the component for HOC to generate the props for and reuse its logic
 * @param propsMapping a mapping of wrapped component's props' field and the corresponding
 *                     state selector for HOC to invoke useAnswersState and get the actual
 *                     data required by the wrapped component
 * @param transformProps a function that can provide modification to the props before it's pass into
 *                  the wrapped component 
 * @returns a new component that uses the given component internally
 */
export default function withPropsMapping<T>(
  Component: GenericComponent<T>,
  propsMapping: Partial<PropsMapping<T>>,
  transformProps?: (x: T) => void
): GenericComponent<Optional<T, keyof typeof propsMapping>> {
  return (props: Optional<T, keyof typeof propsMapping>) => {
    const mappedProps : Record<string, any> = {}
    Object.entries(propsMapping).forEach(([key, val]) => {
      const mappedVal = useAnswersState(val as StateSelector<T>);
      mappedProps[key] = mappedVal;
    });

    let combinedProps = { ...props, ...mappedProps } as T;
    transformProps && transformProps(combinedProps);
    return <Component {...combinedProps}/>
  }
}
