import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react'
import '../sass/SpellCheck.scss';

interface Props {
  isVertical: boolean
}

export default function SpellCheck (props: Props): JSX.Element | null {
  const correctedQuery = useAnswersState(state => state.spellCheck.correctedQuery);
  const answersActions = useAnswersActions();
  if (!correctedQuery) {
    return null;
  }
  return (
    <div className='SpellCheck'>
      <span className='SpellCheck__helpText'>Did you mean: </span>
      <button className='SpellCheck__link' onClick={() => {
        answersActions.setQuery(correctedQuery);
        answersActions.setSpellCheckEnabled(false);
        props.isVertical
          ? answersActions.executeVerticalQuery()
          : answersActions.executeUniversalQuery() 
        answersActions.setSpellCheckEnabled(true);
      }}>{correctedQuery}</button>
    </div>
  );
}