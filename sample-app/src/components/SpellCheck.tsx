import { useAnswersState } from '@yext/answers-headless-react'

interface Props {
  createLink: (correctedQuery: string | undefined) => string;
}

export default function SpellCheck (props: Props) {
  const correctedQuery = useAnswersState(state => state.spellCheck.correctedQuery);
  const link = props.createLink(correctedQuery);
  if (!correctedQuery) {
    return null;
  }
  return (
    <div className='SpellCheck'>
      <span className='SpellCheck__helpText'>Did you mean: </span>
      <a className='SpellCheck__link' href={link}>{correctedQuery}</a>
    </div>
  )
}