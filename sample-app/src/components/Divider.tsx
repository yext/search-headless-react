import { CompositionMethod, useComposedCssClasses } from "../hooks/useComposedCssClasses"

interface DividerCssClasses {
  divider?: string
}

const builtInCssClasses = {
  divider: 'w-full h-px bg-gray-200 my-4'
}

interface Props {
  customCssClasses?: DividerCssClasses,
  cssCompositionMethod?: CompositionMethod
}

export default function Divider({ customCssClasses, cssCompositionMethod }: Props) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  return <div className={cssClasses.divider}></div>
}