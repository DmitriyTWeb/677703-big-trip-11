const pointTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const activityCategory = [`Check-in`, `Sightseeing`, `Restaurant`];
const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
const options = [
  {
    name: `luggage`,
    title: `Add luggage`,
    price: 30,
    type: `Taxi`,
  },
  {
    name: `luggage`,
    title: `Add luggage`,
    price: 30,
    type: `Bus`,
  },
  {
    name: `luggage`,
    title: `Add luggage`,
    price: 30,
    type: `Train`,
  },
  {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
    type: `Flight`,
  },
  {
    name: `meal`,
    title: `Add meal`,
    price: 15,
    type: `Check-in`,
  },
  {
    name: `seats`,
    title: `Choose seats`,
    price: 5,
    type: `Flight`,
  },
  {
    name: `seats`,
    title: `Choose seats`,
    price: 5,
    type: `Ship`,
  },
  {
    name: `train`,
    title: `Travel by train`,
    price: 40,
    type: `Transport`,
  }
];

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
  targetDate.setTime(targetDate.getTime() + getRandomIntegerNumber(0, 1000 * 60 * 60));
  return targetDate;
};

const getRandomImages = () => {
  const imgCount = getRandomIntegerNumber(0, 4);
  const images = [];

  for (let i = 0; i < imgCount; i++) {
    images.push(`http://picsum.photos/248/152?r=${Math.random()};`);
  }

  return images;
};

const getRandomDescription = () => {
  const sentCount = getRandomIntegerNumber(1, 5);
  let randomSents = [];

  for (let i = 1; i <= sentCount; i++) {
    randomSents.push(descriptions[getRandomIntegerNumber(0, descriptions.length)]);
  }
  return randomSents.join(` `);
};

const generatePoint = () => {
  const type = getRandomArrayItem(pointTypes);
  const category = activityCategory.some((it) => it === type) ? `Activity` : `Transfer`;
  const startDate = getRandomDate();
  const endDate = new Date(startDate.getTime() + getRandomIntegerNumber(1000 * 60 * 20, 1000 * 60 * 60 * 24 * 3));
  const pointOptions = options.filter((it) => it.type === type);
  const pointDescription = getRandomDescription(descriptions);
  const destination = destinations[getRandomIntegerNumber(0, destinations.length)];
  const isFavorite = Math.random() > 0.7 ? true : false;
  const inputPrice = getRandomIntegerNumber(2, 60);
  const totalPointPrice = inputPrice + pointOptions.reduce((acc, current) => {
    return acc + current.price;
  }, 0);
  const images = getRandomImages();

  return {
    category,
    type,
    destination,
    startDate,
    endDate,
    inputPrice,
    totalPointPrice,
    isFavorite,
    options: pointOptions,
    description: pointDescription,
    images,
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};

export {generatePoint, generatePoints, pointTypes, activityCategory, destinations};
