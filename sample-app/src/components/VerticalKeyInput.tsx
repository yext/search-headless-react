import { useAnswersActions } from '@yext/answers-headless-react';

function VerticalKeyInput() {
  const answersActions = useAnswersActions();
  return (
    <div>
      <label>Set Vertical Key</label>
      <input onChange={(e) => answersActions.setVerticalKey(e.target.value)} />
    </div>
  )
}

export default VerticalKeyInput;