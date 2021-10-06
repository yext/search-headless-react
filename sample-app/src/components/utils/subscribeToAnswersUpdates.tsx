type GenericComponent<T> = (props: T) => JSX.Element | null;

/**
 * a HOC that can subscribe given component to changes in Answers State and other
 * props data transformation using the provided function and pass the return value as
 * props for the given component.
 * 
 * The generic types are optional. T defines the original component's props. 
 * K defines the new component's props.
 *
 * @param Component the component for HOC to generate the props for and reuse its logic
 * @param transformProps a function that can provide modification to the initial props 
 *                       and pass the new modified props into the given component 
 * @returns a new component that uses the given component internally
 */
export default function subscribeToAnswersUpdates<T, K=Partial<T>>(
  Component: GenericComponent<T>,
  transformProps: (initialProps: K) => T
): GenericComponent<K> {
  return (props: K) => {
    const transformedProps = transformProps(props);
    return <Component {...transformedProps}/>
  }
}
