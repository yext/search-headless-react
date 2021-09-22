import { v4 as uuid } from 'uuid';

export const createVerticalQueryResponse = () => ({
  meta: {
    uuid: uuid(),
    errors: []
  },
  response: {
    businessId: 3575590,
    queryId: uuid(),
    resultsCount: 1,
    results: [
      {
        data: {
          id: '8YIR7-ueoAQ',
          type: 'video',
          description: 'Feel like you\'re in the story. WATCH and see how The New York Times is transforming the way immersive journalism is experienced with Verizon 5G Ultra ...',
          name: '5G Journalism Just Got Real with iPhone 12 Pro | New York Times | Verizon',
          youtube_channelID: 'UCDF1rHyRH8LcxbHX5_mrZ0w',
          youtube_publishedAt: '2020-11-24',
          youtube_thumbnailPhoto: {
            url: 'http://a.mktgcdn.com/p/1sfQumngz-gcAd2n9Gn8KwLUehxegf-57KEvLnImYC4/120x90.jpg',
            width: 120,
            height: 90,
            sourceUrl: 'https://i.ytimg.com/vi/8YIR7-ueoAQ/default.jpg',
            thumbnails: [
              {
                url: 'http://a.mktgcdn.com/p/1sfQumngz-gcAd2n9Gn8KwLUehxegf-57KEvLnImYC4/120x90.jpg',
                width: 120,
                height: 90
              }
            ]
          },
          videos: [
            {
              video: {
                url: 'https://www.youtube.com/watch?v=8YIR7-ueoAQ'
              }
            }
          ],
          uid: '26601715'
        },
        highlightedFields: {
          name: {
            value: '5G Journalism Just Got Real with iPhone 12 Pro | New York Times | Verizon',
            matchedSubstrings: [
              {
                offset: 33,
                length: 6
              }
            ]
          }
        }
      }
    ],
    appliedQueryFilters: [],
    facets: [],
    source: 'KNOWLEDGE_MANAGER',
    searchIntents: [],
    locationBias: {
      latitude: 38.9695,
      longitude: -77.3859,
      locationDisplayName: 'Herndon, Virginia, United States',
      accuracy: 'IP'
    }
  }
});
