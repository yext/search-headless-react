import { StatefulCore } from '@yext/answers-headless'
import { connectToStatefulCore } from '../bindings/connectToStatefulCore';
import { listenToStatefulCore } from '../bindings/listenToStatefulCore';

interface Props {
  vertKey?: string,
  statefulCore: StatefulCore
};

function VerticalKeyInput({ vertKey, statefulCore }: Props) {
  return (
    <div>
      <div> Hello Hooman, the key is: {vertKey}</div>
      <label>Set AND display the vertical key</label>
      {/* If we let vertKey be undefined, we will get the "controlled vs uncontroled" inputs warning from react
      https://github.com/facebook/react/issues/6222 */}
      <input onChange={(e) => statefulCore.setVerticalKey(e.target.value)} value={vertKey || ''} />
    </div>
  )
}

export default connectToStatefulCore(listenToStatefulCore(state => ({
  vertKey: state.vertical.key
}))(VerticalKeyInput));