import { useAnswersState } from "@yext/answers-headless-react";
import { FeaturedSnippetDirectAnswer, FieldValueDirectAnswer } from '@yext/answers-headless';
import renderWithHighlighting from './utils/renderWithHighlighting';
import classNames from "classnames";
import '../sass/DirectAnswer.scss';

interface DirectAnswerProps {
  cssClasses?: {
    container?: string,
    title?: string,
    content?: string,
    description?: string
  }
}

const defaultCSSClasses = {
  container: 'DirectAnswer',
  title: 'DirectAnswer__title',
  content: 'DirectAnswer__content',
  description: 'DirectAnswer__contentDescription'
};

function isFeaturedSnippetDirectAnswer(
  answer: FeaturedSnippetDirectAnswer | FieldValueDirectAnswer
): answer is FeaturedSnippetDirectAnswer {
  return 'snippet' in answer;
}

export default function DirectAnswer(props: DirectAnswerProps): JSX.Element | null {
  const directAnswerResult = useAnswersState(state => state.directAnswer.result);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);
  if (!directAnswerResult) {
    return null;
  }
  const { cssClasses:customCssClasses } = props;
  const cssClasses = Object.assign(defaultCSSClasses, customCssClasses);
  const containerCssClasses = classNames(cssClasses.container, { [`${cssClasses.container}--loading`]: isLoading });

  return (
    <div className={containerCssClasses}>
      <div className={cssClasses.title}>
        {isFeaturedSnippetDirectAnswer(directAnswerResult)
          ? directAnswerResult.value
          : `${directAnswerResult.entityName} / ${directAnswerResult.fieldName}`}
      </div>
      <div className={cssClasses.content}>
        <div className={cssClasses.description}>
          {isFeaturedSnippetDirectAnswer(directAnswerResult) 
            ? renderWithHighlighting(directAnswerResult.snippet)
            : directAnswerResult.value}
        </div>
        {directAnswerResult.relatedResult.link 
          && <a href={directAnswerResult.relatedResult.link}>View More</a>}
      </div>
    </div>
  )
}
