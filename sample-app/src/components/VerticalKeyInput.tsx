import { StatefulCore } from '@yext/answers-headless'
import { decorateWithStore } from '@yext/answers-headless-react';

interface Props {
  storeActions: StatefulCore
};

function VerticalKeyInput({ storeActions }: Props) {
  return (
    <div>
      <label>Set Vertical Key</label>
      <input onChange={(e) => storeActions.setVerticalKey(e.target.value)} />
    </div>
  )
}

export default decorateWithStore(VerticalKeyInput);