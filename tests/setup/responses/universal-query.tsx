import { v4 as uuid } from 'uuid';

export const universalQueryResponseWithFilters = {
  meta: {
    uuid: uuid(),
    errors: []
  },
  response: {
    businessId: 3350634,
    modules: [
      {
        verticalConfigId: "KM",
        resultsCount: 821,
        encodedState: "",
        results: [
          {
            data: {
              id: "2917513710699998040",
              type: "location",
              website: "https://locations.yext.com/us/va/mclean/7900-westpark-drive.html",
              address: {
                line1: "7900 Westpark Drive",
                line2: "Suite T200",
                city: "McLean",
                region: "VA",
                postalCode: "22102",
                countryCode: "US"
              },
              addressHidden: false,
              description: "Yext is the global digital knowledge management leader.",
              hours: {
                monday: {
                  openIntervals: [
                    {
                      start: "01:00",
                      end: "14:00"
                    }
                  ]
                }
              },
              name: "Office Space",
              cityCoordinate: {
                latitude: 38.936519622802734,
                longitude: -77.18428039550781
              },
              c_names: [
                "my name is Steve",
                "your name is Rose"
              ],
              displayCoordinate: {
                latitude: 38.9246498,
                longitude: -77.2169181
              },
              facebookPageUrl: "https://www.facebook.com/Yext-Cafe-2073644659328705/",
              geocodedCoordinate: {
                latitude: 38.9246498,
                longitude: -77.2169181
              },
              isoRegionCode: "VA",
              localPhone: "+16467624579",
              mainPhone: "+18884442988",
              routableCoordinate: {
                latitude: 38.9243984,
                longitude: -77.2178386
              },
              services: [
                "Dogs",
                "Cats",
                "Sleep"
              ],
              timezone: "America/New_York",
              websiteUrl: {
                url: "https://locations.yext.com/us/va/mclean/7900-westpark-drive.html",
                preferDisplayUrl: false
              },
              yextDisplayCoordinate: {
                latitude: 38.9246498,
                longitude: -77.2169181
              },
              yextRoutableCoordinate: {
                latitude: 38.9243984,
                longitude: -77.2178386
              },
              categoryIds: [
                "668"
              ],
              timeZoneUtcOffset: "-04:00",
              uid: "18714998"
            },
            highlightedFields: {},
            distance: 29718,
            distanceFromFilter: 184935
          }
        ],
        queryDurationMillis: 120,
        facets: [],
        source: "KNOWLEDGE_MANAGER"
      },
      {
        verticalConfigId: "financial_professionals",
        resultsCount: 1,
        encodedState: "",
        results: [
          {
            data: {
              id: "3723515499403010611",
              type: "financialProfessional",
              address: {
                line1: "1101 Wilson Boulevard",
                city: "Arlington",
                region: "VA",
                postalCode: "22209",
                countryCode: "US"
              },
              addressHidden: false,
              name: "Connor Anderson",
              cityCoordinate: {
                latitude: 38.881579,
                longitude: -77.103339
              },
              c_primaryCTA: {
                label: "Call",
                linkType: "Phone",
                link: "+18888888888"
              },
              featuredMessage: {
                description: "Ask Connor a financial question!"
              },
              geocodedCoordinate: {
                latitude: 38.895467,
                longitude: -77.069889
              },
              isoRegionCode: "VA",
              timezone: "America/New_York",
              yextDisplayCoordinate: {
                latitude: 38.895467,
                longitude: -77.069889
              },
              yextRoutableCoordinate: {
                latitude: 38.895032,
                longitude: -77.070102
              },
              timeZoneUtcOffset: "-04:00",
              uid: "24359942"
            },
            highlightedFields: {},
            distance: 42793,
            distanceFromFilter: 191371
          }
        ],
        appliedQueryFilters: [
          {
            displayKey: "Location",
            displayValue: "Virginia",
            filter: {
              "builtin.location": {
                $eq: "P-region.7919684583758790"
              }
            },
            type: "PLACE",
            details: {
              latitude: 37.677592044,
              longitude: -78.6190526172645,
              placeName: "Virginia, United States",
              featureTypes: [
                "region"
              ],
              boundingBox: {
                minLatitude: 36.540855,
                minLongitude: -83.6753959969438,
                maxLatitude: 39.4660129984577,
                maxLongitude: -75.165704098375
              }
            }
          }
        ],
        queryDurationMillis: 129,
        facets: [],
        source: "KNOWLEDGE_MANAGER"
      },
      {
        verticalConfigId: "healthcare_professionals",
        resultsCount: 1,
        encodedState: "",
        results: [
          {
            data: {
              id: "555601076612488113",
              type: "healthcareProfessional",
              landingPageUrl: "https://www.youtube.com/channel/UCiPW7OlzTfQjR_vLlkYPZCg",
              address: {
                line1: "1101 Wilson Boulevard",
                city: "Arlington",
                region: "VA",
                postalCode: "22209",
                countryCode: "US"
              },
              addressHidden: false,
              description: "An Interventional Radiologist and a Youtuber",
              name: "Bob Cellini",
              cityCoordinate: {
                latitude: 38.881579,
                longitude: -77.103339
              },
              firstName: "Bob",
              photoGallery: [
                {
                  image: {
                    url: "https://a.mktgcdn.com/p/rH7u6enn8thbrCVgI5a9ydxcGhcY3LIlu35nd1prLHs/310x310.jpg",
                    alternateText: "Photo of a doctor",
                    width: 310,
                    height: 310,
                    thumbnails: [
                      {
                        url: "https://a.mktgcdn.com/p/rH7u6enn8thbrCVgI5a9ydxcGhcY3LIlu35nd1prLHs/310x310.jpg",
                        width: 310,
                        height: 310
                      }
                    ]
                  }
                }
              ],
              geocodedCoordinate: {
                latitude: 38.895467,
                longitude: -77.069889
              },
              headshot: {
                url: "https://a.mktgcdn.com/p/rH7u6enn8thbrCVgI5a9ydxcGhcY3LIlu35nd1prLHs/310x310.jpg",
                alternateText: "Photo of a doctor",
                width: 310,
                height: 310,
                thumbnails: [
                  {
                    url: "https://a.mktgcdn.com/p/rH7u6enn8thbrCVgI5a9ydxcGhcY3LIlu35nd1prLHs/310x310.jpg",
                    width: 310,
                    height: 310
                  }
                ]
              },
              isoRegionCode: "VA",
              lastName: "Cellini",
              localPhone: "+17034567890",
              timezone: "America/New_York",
              yextDisplayCoordinate: {
                latitude: 38.895467,
                longitude: -77.069889
              },
              yextRoutableCoordinate: {
                latitude: 38.895032,
                longitude: -77.070102
              },
              categoryIds: [
                "1545906",
                "1120591"
              ],
              timeZoneUtcOffset: "-04:00",
              uid: "24360867"
            },
            highlightedFields: {},
            distance: 42793,
            distanceFromFilter: 191371
          }
        ],
        appliedQueryFilters: [
          {
            displayKey: "Location",
            displayValue: "Virginia",
            filter: {
              "builtin.location": {
                $eq: "P-region.7919684583758790"
              }
            },
            type: "PLACE",
            details: {
              latitude: 37.677592044,
              longitude: -78.6190526172645,
              placeName: "Virginia, United States",
              featureTypes: [
                "region"
              ],
              boundingBox: {
                minLatitude: 36.540855,
                minLongitude: -83.6753959969438,
                maxLatitude: 39.4660129984577,
                maxLongitude: -75.165704098375
              }
            }
          }
        ],
        queryDurationMillis: 111,
        facets: [],
        source: "KNOWLEDGE_MANAGER"
      }
    ],
    failedVerticals: [],
    queryId: "29e0c558-6dba-44e8-bde5-7b706919fc7e",
    searchIntents: [],
    locationBias: {
      latitude: 39.0437,
      longitude: -77.4875,
      locationDisplayName: "Ashburn, Virginia, United States",
      accuracy: "IP"
    }
  }
};

export const universalQueryResponse = {
  meta: {
    uuid: uuid(),
    errors: []
  },
  response: {
    businessId: 3350634,
    modules: [
      {
        verticalConfigId: "people",
        resultsCount: 6,
        encodedState: "",
        results: [
          {
            data: {
              id: "Employee-2143",
              type: "ce_person",
              address: {
                line1: "7900 Westpark Drive",
                city: "Mclean",
                region: "VA",
                postalCode: "22102",
                countryCode: "US"
              },
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tristique senectus et netus et malesuada fames ac turpis. Porttitor eget dolor morbi non arcu risus quis. Tempor orci dapibus ultrices in iaculis. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est. Eleifend donec pretium vulputate sapien nec. Ornare suspendisse sed nisi lacus sed viverra tellus in hac. Morbi tristique senectus et netus et malesuada. Vel pharetra vel turpis nunc eget lorem dolor sed viverra. Sapien nec sagittis aliquam malesuada.\n\nAt lectus urna duis convallis convallis tellus. Luctus venenatis lectus magna fringilla urna porttitor rhoncus. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Amet dictum sit amet justo donec enim diam vulputate ut. Ultrices in iaculis nunc sed augue lacus viverra. Feugiat sed lectus vestibulum mattis ullamcorper velit. Euismod quis viverra nibh cras pulvinar mattis nunc sed blandit. In hac habitasse platea dictumst quisque. In aliquam sem fringilla ut morbi tincidunt augue interdum velit. At erat pellentesque adipiscing commodo elit at.\n\nNunc aliquet bibendum enim facilisis gravida neque. Libero id faucibus nisl tincidunt eget nullam. Ullamcorper dignissim cras tincidunt lobortis. Condimentum id venenatis a condimentum. Sit amet dictum sit amet justo. Ac placerat vestibulum lectus mauris ultrices eros in. Cras sed felis eget velit aliquet sagittis id consectetur purus. Auctor urna nunc id cursus. Arcu non odio euismod lacinia at. Neque convallis a cras semper auctor neque vitae. Adipiscing elit pellentesque habitant morbi tristique. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Scelerisque eu ultrices vitae auctor eu augue ut lectus. In vitae turpis massa sed elementum. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum a. Vitae suscipit tellus mauris a diam maecenas sed enim. Volutpat blandit aliquam etiam erat velit scelerisque.",
              name: "Tom Meyer",
              cityCoordinate: {
                latitude: 38.936519622802734,
                longitude: -77.18428039550781
              },
              c_allstateLadyCTA: {
                label: "Learn More",
                linkType: "URL",
                link: "http://yext.com"
              },
              c_employeeCity: "Tysons Corner",
              c_employeeCountry: "United States",
              c_employeeDepartment: "Technology",
              c_employeeRegion: "Virginia",
              c_employeeTitle: "Software Engineer",
              c_myRichTextField: "++Underlined stuff++  \n**Bold stuff**\n\n1. One\n2. Two\n3. *Three*",
              c_popularity: "1.0",
              c_startDate: "2017-09-05",
              displayCoordinate: {
                latitude: 38.924648,
                longitude: -77.216859
              },
              emails: [
                "tmeyer@yext.com"
              ],
              firstName: "Tom",
              geocodedCoordinate: {
                latitude: 38.924654,
                longitude: -77.216891
              },
              headshot: {
                url: "https://a.mktgcdn.com/p/cb9jR0A19ADuKc7ExlWmHaDchPW_61IR5TZ5G7NApjY/139x140.jpg",
                width: 139,
                height: 140,
                sourceUrl: "https://a.mktgcdn.com/p/cb9jR0A19ADuKc7ExlWmHaDchPW_61IR5TZ5G7NApjY/139x140.jpg"
              },
              lastName: "Meyer",
              routableCoordinate: {
                latitude: 38.9242966,
                longitude: -77.2177549
              },
              yextDisplayCoordinate: {
                latitude: 38.924648,
                longitude: -77.216859
              },
              yextRoutableCoordinate: {
                latitude: 38.9242966,
                longitude: -77.2177549
              },
              uid: "18716864"
            },
            highlightedFields: {
              name: {
                value: "Tom Meyer",
                matchedSubstrings: [
                  {
                    offset: 0,
                    length: 3
                  }
                ]
              }
            },
            distance: 29722
          }
        ],
        appliedQueryFilters: [],
        queryDurationMillis: 145,
        facets: [],
        source: "KNOWLEDGE_MANAGER"
      },
      {
        verticalConfigId: "links",
        resultsCount: 89,
        encodedState: "tom",
        results: [
          {
            htmlTitle: "Men\\u0026#39;s Skechers \\u003cb\\u003eTom\\u003c/b\\u003e Cats Oxford | Shoes.com",
            link: "https://www.shoes.com/mens-skechers-tom-cats-oxford/P-3296.html",
            displayLink: "www.shoes.com",
            htmlSnippet: "Go on the prowl in the Skechers \\u003cb\\u003eTom\\u003c/b\\u003e Cats Oxford. This lace-up plain-toe shoe features a padded collar and tongue, memory foam, and shock-absorbing EVA ..."
          },
          {
            htmlTitle: "\\u003cb\\u003eToms\\u003c/b\\u003e | Shoes.com",
            link: "https://www.shoes.com/brands/toms/",
            displayLink: "www.shoes.com",
            htmlSnippet: "Shop \\u003cb\\u003eToms\\u003c/b\\u003e at Shoes.com Enjoy free US shipping on all orders."
          }
        ],
        appliedQueryFilters: [],
        queryDurationMillis: 327,
        facets: [],
        source: "GOOGLE_CSE"
      }
    ],
    failedVerticals: [],
    queryId: "42513949-b30b-4343-8642-d8e30aed3d82",
    searchIntents: [],
    locationBias: {
      latitude: 39.0437,
      longitude: -77.4875,
      locationDisplayName: "Ashburn, Virginia, United States",
      accuracy: "IP"
    }
  }
};
