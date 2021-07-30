import { StatefulCore } from '@yext/answers-headless'
import { connectToStatefulCore } from '@yext/answers-headless-react';

interface Props {
  statefulCore: StatefulCore
};

function VerticalKeyInput({ statefulCore }: Props) {
  return (
    <div>
      <label>Set Vertical Key</label>
      <input onChange={(e) => statefulCore.setVerticalKey(e.target.value)} />
    </div>
  )
}

export default connectToStatefulCore(VerticalKeyInput);