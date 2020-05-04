const MONTHS = [
  `jan`,
  `feb`,
  `mar`,
  `apr`,
  `may`,
  `jun`,
  `jul`,
  `aug`,
  `sep`,
  `oct`,
  `nov`,
  `dec`
];

export const FilterType = {
  EVERYTHING: `everything`,
  PAST: `past`,
  FUTURE: `future`
};

export {MONTHS};

export const allTypesOptions = [
  {
    "type": `taxi`,
    "options": [
      {title: `Add luggage`, price: 30},
      {title: `Driver with Mask`, price: 5},
      {title: `Silent driver`, price: 20},
      {title: `Play DnB`, price: 10},
    ]
  },
  {
    "type": `bus`,
    "options": [
      {title: `Add luggage`, price: 30},
      {title: `No TV into`, price: 20},
      {title: `More space for legs`, price: 15},
    ]
  },
  {
    "type": `train`,
    "options": [
      {title: `Add luggage`, price: 27},
      {title: `No smells`, price: 10},
      {title: `Sober neighbors`, price: 17},
    ]
  },
  {
    "type": `flight`,
    "options": [
      {title: `Comfort class`, price: 100},
      {title: `Add water`, price: 3},
      {title: `Add meal`, price: 15},
      {title: `Choose seats`, price: 5},
      {title: `More space for legs`, price: 15},
    ]
  },
  {
    "type": `ship`,
    "options": [
      {title: `Choose seats`, price: 5},
      {title: `Add stabilization`, price: 5},
      {title: `Own plage`, price: 120},
    ]
  },
  {
    "type": `transport`,
    "options": [
      {title: `Travel by train`, price: 40},
    ]
  },
  {
    "type": `sightseeing`,
    "options": [
      {title: `Add sunshine`, price: 40}
    ]
  },
];

export const activityCategory = [`check-in`, `sightseeing`, `restaurant`];
export const destinationNames = [`amsterdam`, `geneva`, `chamonix`, `saint Petersburg`];
