// global variables
let sunriseElement,
  sunsetElement,
  minuteLeftElement,
  locationElement,
  timeLeft,
  timeLeftPercent,
  sunElement,
  timeLeftTextElement,
  htmlElement;

//get Domelements
let getDomElements = function () {
  console.log('loading in dom elements');
  sunriseElement = document.querySelector('.js-sunrise');
  sunsetElement = document.querySelector('.js-sunset');
  minuteLeftElement = document.querySelector('.js-time-left');
  locationElement = document.querySelector('.js-location');
  sunElement = document.querySelector('.js-sun');
  timeLeftTextElement = document.querySelector('.js-text-left');
  htmlElement = document.querySelector('.js-html');
};

const setTimeReadable = function (timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

let showResult = (queryResponse) => {
  console.log(queryResponse);
  //calc values for percentage
  const now = new Date();
  const end = new Date(queryResponse.city.sunset * 1000);
  const start = new Date(queryResponse.city.sunrise * 1000);
  const timePast = Math.abs(start - now);
  const totalTime = Math.abs(end - start);

  //calculate percentage
  timePastPercent = (timePast / totalTime) * 100;
  const timeHoek = timePastPercent * 3.6;
  console.log('hoek' + timeHoek);

  // calc right values using pi with sin as y and cos as x
  var left = Math.abs(Math.cos(((100 - timePastPercent) * Math.PI) / 180)) * 100;
  var bottom = 100 - timePastPercent;

  console.log('left' + left);
  console.log('bottom' + bottom);
  //calc time left
  timeLeft = new Date(new Date(queryResponse.city.sunset * 1000) - now);
  timeLeft.setHours(timeLeft.getHours() - 1); // include time zone diffrence

  //set time in bar
  sunriseElement.innerText = setTimeReadable(queryResponse.city.sunrise);
  sunsetElement.innerText = setTimeReadable(queryResponse.city.sunset);

  //set lecotion name
  locationElement.innerText = `${queryResponse['city'].name} - ${queryResponse['city'].country}`;

  //set current time on sun
  sunElement.setAttribute(
    'data-time',
    now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  );

  if (timePastPercent >= 100) {
    // make it night
    htmlElement.classList.add('is-night');
    htmlElement.classList.remove('is-day');

    //time left
    minuteLeftElement.innerText = '';
    timeLeftTextElement.innerText = 'Sunlight is over. Go get some sleep'; //set cunstom messege

    //set sun posion
    sunElement.style.left = `$100%`;
    sunElement.style.bottom = `0%`;
  } else {
    // make it day
    htmlElement.classList.add('is-day');
    htmlElement.classList.remove('is-night');

    //time left
    minuteLeftElement.innerText = `${timeLeft.getHours()}h${timeLeft.getMinutes()}`;
    timeLeftTextElement.innerText = 'sunlight left today. Make the most of it!'; //set cunstom messege

    //set sun posion
    sunElement.style.left = `${left}%`;
    sunElement.style.bottom = `${bottom}%`;
  }
};

const updateSun = function () {
  setInterval(async function () {
    const data = await getData();
    showResult(data);
  }, 3000);
};

const getData = function () {
  const lat = 50.8027841;
  const lon = 3.2097454;
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=4de6037357126d4d4520357f69ed3654&units=metric&lang=nl&cnt=1`;
  return fetch(url).then((response) => response.json().catch((error) => console.log(error)));
};

const init = async function () {
  console.log('dom loaded');
  getDomElements();
  const data = await getData();
  showResult(data);
  updateSun();
};

document.addEventListener('DOMContentLoaded', init);
