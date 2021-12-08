import { act, render } from '@testing-library/react';
import { 
  provideAnswersHeadless,
  AnswersHeadlessContext,
  Matcher,
  AnswersHeadless
} from '@yext/answers-headless-react';
import AppliedFilters, { AppliedFiltersCssClasses } from '../src/components/AppliedFilters';
import { useCallback } from 'react';
import { verticalQueryResponseWithNlpFilters } from '../tests/setup/responses/vertical-query';

const cssClasses: Required<AppliedFiltersCssClasses> = {
  filterLabel: 'filterLabel',
  removeFilterButton: 'removeFilterButton',
  appliedFiltersContainer: '',
  nlpFilter: '',
  removableFilter: ''
};

describe('AppliedFilters component works as expected', () => {

  it('Selected static filters appear and are removable', async () => {
    const answers = createAnswersHeadless();
    const mockedFilter = {
      fieldId: 'c_employeeCountry',
      matcher: Matcher.Equals,
      value: 'United States',
      selected: true
    };

    const MockedStaticFilter = () => {
      const onChange = useCallback(() => {
        answers.setStaticFilters([]);
      }, []);
      return <button id='c_employeeCountry_United States' onClick={onChange}></button>;
    };

    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>
        <MockedStaticFilter />
        <AppliedFilters
          customCssClasses={cssClasses}
        />
      </AnswersHeadlessContext.Provider>
    );

    act(() => answers.setQuery('someQuery'));
    await act( async () => { await answers.executeVerticalQuery() });
    act(() => answers.setStaticFilters([mockedFilter]));

    let filterLabels = container.getElementsByClassName(cssClasses.filterLabel);
    expect(filterLabels.length).toBe(1);
    expect(filterLabels[0].innerHTML).toBe(mockedFilter.value);
    const filerRemoveButton = container
      .getElementsByClassName(cssClasses.removeFilterButton)[0] as HTMLElement;
    expect(filerRemoveButton).toBeTruthy();

    filerRemoveButton.click();
    filterLabels = container.getElementsByClassName(cssClasses.filterLabel);
    expect(filterLabels.length).toBe(0);
  });

  it('A selected facet appears and is removable', async () => {
    const answers = createAnswersHeadless();
    const mockedFacets = [
      {
        fieldId: 'c_employeeDepartment',
        displayName: 'Employee Department',
        options: [{
          matcher: Matcher.Equals,
          value: 'technology',
          displayName: 'Technology',
          count: 1,
          selected: true
        }]
      }
    ];

    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>\
        <AppliedFilters customCssClasses={cssClasses}/>
      </AnswersHeadlessContext.Provider>
    );

    act(() => answers.setQuery('someQuery'));
    await act( async () => { await answers.executeVerticalQuery() });
    act(() => answers.setFacets(mockedFacets));

    let facetLabels = container.getElementsByClassName(cssClasses.filterLabel);
    expect(facetLabels.length).toBe(1);
    expect(facetLabels[0].innerHTML).toBe(mockedFacets[0].options[0].displayName);
    const filerRemoveButton = container
      .getElementsByClassName(cssClasses.removeFilterButton)[0] as HTMLElement;
    expect(filerRemoveButton).toBeTruthy();

    filerRemoveButton.click();
    facetLabels = container.getElementsByClassName(cssClasses.filterLabel);
    expect(facetLabels.length).toBe(0);
  });

  it('NLP filters appear and are not removable', async () => {
    const answers = createAnswersHeadless();
    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>\
        <AppliedFilters customCssClasses={cssClasses}/>
      </AnswersHeadlessContext.Provider>
    );

    act(() => answers.setQuery('resultsWithNlpFilter'));
    await act( async () => { await answers.executeVerticalQuery() });

    const nlpFilterLabels = container.getElementsByClassName(cssClasses.filterLabel);
    expect(nlpFilterLabels.length).toBe(1);
    expect(nlpFilterLabels[0].innerHTML)
      .toBe(verticalQueryResponseWithNlpFilters.response.appliedQueryFilters[0].displayValue);
    const filerRemoveButton = container
      .getElementsByClassName(cssClasses.removeFilterButton)[0] as HTMLElement;
    expect(filerRemoveButton).toBeFalsy();
  });

});

function createAnswersHeadless(): AnswersHeadless {
  const answers = provideAnswersHeadless({
    apiKey: 'fake api key',
    experienceKey: 'fake exp key',
    locale: 'en',
  });
  answers.setVerticalKey('fakeVerticalKey');
  return answers;
}