import { act, render } from '@testing-library/react';
import { provideAnswersHeadless } from '@yext/answers-headless';
import { AnswersHeadlessContext } from '../../src';
import DecoratedAppliedFilters from '../../sample-app/src/components/DecoratedAppliedFilters';
import { Matcher } from '@yext/answers-core';
import { useCallback } from 'react';
import { verticalQueryResponseWithNlpFilters } from '../setup/responses/vertical-query';

describe('AppliedFilters component work as expected', () => {

  it('see that selected static filters appears and is removable', async () => {
    const answers = createAnswersHeadless();
    const mockedFilter = {
      fieldId: 'c_employeeCountry',
      matcher: Matcher.Equals,
      value: 'United States'
    };

    const MockedStaticFilter = () => {
      const onChange = useCallback(() => {
        answers.setFilter(null);
      }, []);
      return <button id='c_employeeCountry_United States' onClick={onChange}></button>;
    };
    answers.setFilter(mockedFilter);
    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>
        <MockedStaticFilter />
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
        />
      </AnswersHeadlessContext.Provider>
    );

    let filterLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(filterLabels.length).toBe(1);
    expect(filterLabels[0].innerHTML).toBe(mockedFilter.value);
    const filerRemoveButton = container
      .getElementsByClassName('AppliedFilters__removeFilterButton')[0] as HTMLElement;
    expect(filerRemoveButton).toBeTruthy();

    filerRemoveButton.click();
    filterLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(filterLabels.length).toBe(0);
  });

  it('see that selected facet appears and is removable', async () => {
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
    answers.setFacets(mockedFacets);
    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>\
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
        />
      </AnswersHeadlessContext.Provider>
    );

    let facetLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(facetLabels.length).toBe(1);
    expect(facetLabels[0].innerHTML).toBe(mockedFacets[0].options[0].displayName);
    const filerRemoveButton = container
      .getElementsByClassName('AppliedFilters__removeFilterButton')[0] as HTMLElement;
    expect(filerRemoveButton).toBeTruthy();

    filerRemoveButton.click();
    facetLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(facetLabels.length).toBe(0);
  });

  it('see that nlp filters appears and is not removable', async () => {
    const answers = createAnswersHeadless();
    const { container } = render(
      <AnswersHeadlessContext.Provider value={answers}>\
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
        />
      </AnswersHeadlessContext.Provider>
    );

    act(() => answers.setQuery('resultsWithNlpFilter'));
    await act( () => answers.executeVerticalQuery());

    const nlpFilterLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(nlpFilterLabels.length).toBe(1);
    expect(nlpFilterLabels[0].innerHTML)
      .toBe(verticalQueryResponseWithNlpFilters.response.appliedQueryFilters[0].displayValue);
    const filerRemoveButton = container
      .getElementsByClassName('AppliedFilters__removeFilterButton')[0] as HTMLElement;
    expect(filerRemoveButton).toBeFalsy();
  });

});

function createAnswersHeadless() {
  const answers = provideAnswersHeadless({
    apiKey: 'fake api key',
    experienceKey: 'fake exp key',
    locale: 'en',
  });
  answers.setVerticalKey('fakeVerticalKey');
  return answers;
}