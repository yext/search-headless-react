import { act, render } from '@testing-library/react';
import { provideStatefulCore } from '@yext/answers-headless';
import { AnswersActionsContext } from '../../src/index';
import DecoratedAppliedFilters from '../../sample-app/src/components/DecoratedAppliedFilters';
import { Matcher } from '@yext/answers-core';
import { useCallback } from 'react';
import { verticalQueryResponseWithNlpFilters } from '../setup/responses/vertical-query';

describe('AppliedFilters component work as expected', () => {

  it('see that selected static filters appears and is removable', async () => {
    const statefulCore = createStatefulCore();
    const mockedFilter = {
      fieldId: 'c_employeeCountry',
      matcher: Matcher.Equals,
      value: 'United States'
    };

    const MockedStaticFilter = () => {
      const onChange = useCallback(() => {
        statefulCore.setFilter(null);
      }, []);
      return <button id='c_employeeCountry_United States' onClick={onChange}></button>;
    };
    statefulCore.setFilter(mockedFilter);
    const { container } = render(
      <AnswersActionsContext.Provider value={statefulCore}>\
        <MockedStaticFilter />
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
          removable={true}
        />
      </AnswersActionsContext.Provider>
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
    const statefulCore = createStatefulCore();
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
    statefulCore.setFacets(mockedFacets);
    const { container } = render(
      <AnswersActionsContext.Provider value={statefulCore}>\
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
          removable={true}
        />
      </AnswersActionsContext.Provider>
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
    const statefulCore = createStatefulCore();
    const { container } = render(
      <AnswersActionsContext.Provider value={statefulCore}>\
        <DecoratedAppliedFilters
          showFieldNames={true}
          delimiter='|'
          removable={true}
        />
      </AnswersActionsContext.Provider>
    );

    act(() => statefulCore.setQuery('resultsWithNlpFilter'));
    await act( () => statefulCore.executeVerticalQuery());

    const nlpFilterLabels = container.getElementsByClassName('AppliedFilters__filterValueText');
    expect(nlpFilterLabels.length).toBe(1);
    expect(nlpFilterLabels[0].innerHTML)
      .toBe(verticalQueryResponseWithNlpFilters.response.appliedQueryFilters[0].displayValue);
    const filerRemoveButton = container
      .getElementsByClassName('AppliedFilters__removeFilterButton')[0] as HTMLElement;
    expect(filerRemoveButton).toBeFalsy();
  });

});

function createStatefulCore() {
  const statefulCore = provideStatefulCore({
    apiKey: 'fake api key',
    experienceKey: 'fake exp key',
    locale: 'en',
  });
  statefulCore.setVerticalKey('fakeVerticalKey');
  return statefulCore;
}