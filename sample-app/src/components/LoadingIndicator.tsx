import '../sass/LoadingIndicator.scss';

export default function LoadingIndicator() {
	return (
		<div className="LoadingIndicator">
      <svg className= "LoadingIndicator-AnimatedIcon" viewBox="0 0 72 72" height="24" width="24">
        <circle className="LoadingIndicator-Circle" cx="36" cy="36" r="33" stroke="black" strokeWidth="3" fill="none"/>
      </svg>
    </div>
	)
}