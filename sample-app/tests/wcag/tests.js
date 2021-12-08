const universalSearchTests = [
  {
    name: 'universal-search',
  },
  {
    name: 'universal-search--spellcheck',
    commands: [{ type: 'search', params: ['office sparce', 'input'] }]
  }
];

const verticalSearchTests = [
  {
    name: 'vertical-search',
    commands: [{ type: 'click', params: ['a[href="/people"]'] }]
  },
  {
    name: 'vertical-search',
    commands: [
      { type: 'click', params: ['a[href="/people"]'] },
      { type: 'search', params: ['engineer', 'input'] }
    ]
  },
  {
    name: 'vertical-search--financial-professional',
    commands: [
      { type: 'click', params: ['a[href="/financial_professionals"]'] },
      { type: 'search', params: ['connor', 'input'] }
    ]
  },
  {
    name: 'vertical-search--healthcare-professional',
    commands: [
      { type: 'click', params: ['a[href="/healthcare_professionals"]'] },
      { type: 'search', params: ['bob', 'input'] }
    ]
  }
];

const directAnswersTests = [
  {
    name: 'universal-search',
    commands: [{ type: 'search', params: ['where is joe exotic', 'input'] }]
  }
];

const tests = [
  ...universalSearchTests,
  ...verticalSearchTests, 
  ...directAnswersTests
]

module.exports = tests;
