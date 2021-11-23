export interface Option {
  value: string,
  render: () => JSX.Element
}

export interface SectionProps {
  focusStatus?:  'active' | 'maintain' | 'reset',
  onFocusPastEdge?: () => {},
  options?: Option[]
}

export default function Section(props: SectionProps) : JSX.Element | null {
  return <div>Section with status {props.focusStatus}</div>
}