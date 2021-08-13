import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react'
import '../sass/SpellCheck.scss';

export default function SpellCheck (): JSX.Element | null {
  const correctedQuery = useAnswersState(state => state.spellCheck.correctedQuery);
  const actions = useAnswersActions();
  if (!correctedQuery) {
    return null;
  }
  return (
    <div className='SpellCheck'>
      <span className='SpellCheck__helpText'>Did you mean: </span>
      <button className='SpellCheck__link' onClick={() => {
        actions.setQuery(correctedQuery);
        actions.executeVerticalQuery({ skipSpellCheck: true });
      }}>{correctedQuery}</button>
    </div>
  );
}