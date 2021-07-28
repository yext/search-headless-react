import { StatefulCore } from '../../../lib/esm';
import { connectToStatefulCore } from '../bindings/connectToStatefulCore';

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