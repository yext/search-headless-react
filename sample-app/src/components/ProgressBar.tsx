import '../sass/ProgressBar.scss';

export default function ProgressBar(props: { completePercentage: number }): JSX.Element {
  const { completePercentage } = props;
  return (
    <div className='ProgressBar'>
      <div className='ProgressBar__bar'>
        <div style={{ width: `${completePercentage}%` }} className='ProgressBar__percentage'></div>
      </div>
    </div>
  );
}