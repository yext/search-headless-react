import { useAnswersState } from "@yext/answers-headless-react";
import { DirectAnswerType } from '@yext/answers-headless';
import renderHighlightedValue from './utils/renderHighlightedValue';
import classNames from "classnames";
import '../sass/DirectAnswer.scss';

interface DirectAnswerProps {
  cssClasses?: {
    container?: string,
    containerLoading?: string,
    title?: string,
    content?: string,
    description?: string
  }
}

const defaultCSSClasses = {
  container: 'DirectAnswer',
  containerLoading: 'DirectAnswer--loading',
  title: 'DirectAnswer__title',
  content: 'DirectAnswer__content',
  description: 'DirectAnswer__contentDescription'
};

export default function DirectAnswer(props: DirectAnswerProps): JSX.Element | null {
  const directAnswerResult = useAnswersState(state => state.directAnswer.result);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);
  if (!directAnswerResult) {
    return null;
  }
  const { cssClasses: customCssClasses } = props;
  const cssClasses = Object.assign(defaultCSSClasses, customCssClasses);
  const containerCssClasses = classNames(cssClasses.container, { [cssClasses.containerLoading]: isLoading });

  return (
    <div className={containerCssClasses}>
      <div className={cssClasses.title}>
        {directAnswerResult.type === DirectAnswerType.FeaturedSnippet
          ? directAnswerResult.value
          : `${directAnswerResult.entityName} / ${directAnswerResult.fieldName}`}
      </div>
      <div className={cssClasses.content}>
        <div className={cssClasses.description}>
          {directAnswerResult.type === DirectAnswerType.FeaturedSnippet 
            ? renderHighlightedValue(directAnswerResult.snippet)
            : directAnswerResult.value}
        </div>
        {directAnswerResult.relatedResult.link 
          && <a href={directAnswerResult.relatedResult.link}>View More</a>}
      </div>
    </div>
  )
}
