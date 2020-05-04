import {capitalizeFirstLetter, getPointCategory} from "../utils/common.js";
import {destinationNames} from "../const.js";
import {allTypesOptions} from "../const.js";

const pointTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];


const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 3);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate.getTime();
};

const getRandomPictures = (number) => {
  const quantity = getRandomIntegerNumber(0, number);
  const pictures = [];

  for (let i = 0; i < quantity; i++) {
    pictures.push({
      "src": `http://picsum.photos/248/152?r=${Math.random()};`,
      "description": getRandomDescription(descriptions)[0],
    });
  }

  return pictures;
};

const getRandomDescription = () => {
  const sentCount = getRandomIntegerNumber(1, 5);
  let randomSents = [];

  for (let i = 1; i <= sentCount; i++) {
    randomSents.push(descriptions[getRandomIntegerNumber(0, descriptions.length)]);
  }
  return randomSents.join(` `);
};

const getRandomOptions = (pointType) => {
  const index = allTypesOptions.findIndex((option) => option.type === pointType);

  if (index === -1) {
    return [];
  }

  return allTypesOptions[index].options.filter(() => Math.random() > 0.5);
};

const generateDestination = (name) => {
  return {
    "description": getRandomDescription(descriptions),
    "name": capitalizeFirstLetter(name),
    "pictures": getRandomPictures(5),
  };
};

const destinations = destinationNames.map((name) => generateDestination(name));

const generatePoint = () => {
  const type = getRandomArrayItem(pointTypes);
  const startDate = getRandomDate();
  const endDate = (new Date(startDate).getTime() + getRandomIntegerNumber(1000 * 60 * 20, 1000 * 60 * 60 * 24 * 3));
  const pointOptions = getRandomOptions(type);
  const destination = destinations[getRandomIntegerNumber(0, destinations.length)];
  const isFavorite = Math.random() > 0.7 ? true : false;
  const inputPrice = getRandomIntegerNumber(2, 60);

  return {
    id: String(new Date().getTime() + Math.random()),
    type,
    destination,
    startDate,
    endDate,
    inputPrice,
    isFavorite,
    options: pointOptions,
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};

export {
  generatePoint,
  generatePoints,
  getRandomDescription,
  getPointCategory,
  pointTypes,
  destinations,
};
