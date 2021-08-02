import { useAnswersActions } from '@yext/answers-headless-react';

function VerticalKeyInput() {
  const storeActions = useAnswersActions();
  return (
    <div>
      <label>Set Vertical Key</label>
      <input onChange={(e) => storeActions.setVerticalKey(e.target.value)} />
    </div>
  )
}

export default VerticalKeyInput;