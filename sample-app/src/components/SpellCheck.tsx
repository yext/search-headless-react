import { useAnswersState } from '@yext/answers-headless-react'
import '../sass/SpellCheck.scss';

export default function SpellCheck () {
  const correctedQuery = useAnswersState(state => state.spellCheck.correctedQuery);
  const link = createLink(correctedQuery);
  if (!correctedQuery) {
    return null;
  }
  return (
    <div className='SpellCheck'>
      <span className='SpellCheck__helpText'>Did you mean: </span>
      <a className='SpellCheck__link' href={link}>{correctedQuery}</a>
    </div>
  );

  function createLink (correctedQuery: string = '') : string {
    return `./?query=${correctedQuery}`;
  }
}