'use strict';

var TITLES_OFFER = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPES_OFFER = ["palace", "flat", "house", "bungalo"];
var TYPES_OFFER_TRANSLATE = {palace : "Дворец", flat : "Квартира", house : "Дом", bungalo : "Бунгало"};
var CHECKIN_OFFER = ["12:00", "13:00", "14:00"];
var CHECKOUT_OFFER = ["12:00", "13:00", "14:00"];
var FEATURES_OFFER = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var FEATURES_OFFER_TRANSLATE = {wifi : "wifi", dishwasher : "посудомойка", parking : "паркинг", washer : "стиральная машина", elevator : "лифт", conditioner : "кондиционер"};
var PHOTOS_OFFER = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
var arrProposals = [];
var MAP_PIN_WITH = 50;
var MAP_PIN_HEIGHT = 70;

// функция выборки случайного числа из заданного диапазона
function getRandomNumber (minNumber, maxNumber) {

  return minNumber + Math.floor(Math.random() * (maxNumber + 1 - minNumber));
};

// функция формирования случайного ряда чисел, указанной длины из заданного диапазона
function getRandomRange (firstNumber, sizeRange) {
  var arrTempNumbers = [];
  var temp = firstNumber;
  var arrNumbers = [];

    for (var i = 0; i < sizeRange; i++) {
      arrTempNumbers[i] = temp;
      ++temp;
    }

    for (var j = 0; j < sizeRange; j++) {
      var indexArr = getRandomNumber(0, arrTempNumbers.length - 1);

      arrNumbers[j] = arrTempNumbers[indexArr];
      arrTempNumbers.splice(indexArr, 1);
    }

  return arrNumbers;
}

// функция формирования массива из другого массива с произвольным порядком элементов
function getArrayRandomElement(arrFirsts) {
  var arrLasts = [];
  var arrTemps = [];

  arrTemps = getRandomRange (0, arrFirsts.length);

  for (var i = 0; i < arrFirsts.length; i++) {
    arrLasts[i] = arrFirsts[arrTemps[i]];
  }

  return arrLasts;
}

// Вычисляем случайную координату Х метки на карте
var userMap = document.querySelector('.map');
var mapOverlay = userMap.querySelector('.map__overlay');
var startX = Math.floor((document.documentElement.clientWidth - mapOverlay.offsetWidth) / 2);

var endX = startX + mapOverlay.offsetWidth;

// function beginX() {
//   var userMap = document.querySelector('.map');
//   var mapOverlay = userMap.querySelector('.map__overlay');
//   return Math.floor((document.documentElement.clientWidth - mapOverlay.offsetWidth) / 2);
// }

// function stopX() {
//   var userMap = document.querySelector('.map');
//   var mapOverlay = userMap.querySelector('.map__overlay');
//   return (Math.floor((document.documentElement.clientWidth - mapOverlay.offsetWidth) / 2) + mapOverlay.offsetWidth);
// }

// 1. Создаем массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.
var rangeRandomElements = getRandomRange(0, 8);
var proposal = {};

for (var i = 0; i < 8; i++) {
  var locationX = getRandomNumber(MAP_PIN_WITH / 2, (endX - startX - MAP_PIN_WITH / 2));
  var locationY = getRandomNumber((130 + MAP_PIN_HEIGHT), (630 - MAP_PIN_HEIGHT));

  proposal = {
    author: {
      avatar: "img/avatars/user0" + (rangeRandomElements[i] + 1) + ".png"
    },
    offer: {
      title: TITLES_OFFER[rangeRandomElements[i]],
      address: locationX + ", " + locationY,
      price: getRandomNumber(1000, 1000000),
      type: TYPES_OFFER[getRandomNumber(0, TYPES_OFFER.length - 1)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 5),
      checkin: CHECKIN_OFFER[getRandomNumber(0, CHECKIN_OFFER.length - 1)],
      checkout: CHECKOUT_OFFER[getRandomNumber(0, CHECKOUT_OFFER.length - 1)],
      features: FEATURES_OFFER.slice(0, getRandomNumber(0, FEATURES_OFFER.length - 1) + 1),
      description: " ",
      photos: getArrayRandomElement(PHOTOS_OFFER)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  arrProposals[i] = proposal;
}

//   "location": {
//     «x»: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
//     «y»: случайное число, координата y метки на карте от 130 до 630.
//   }
// }

// 2. У блока .map уберите класс .map--faded.

userMap.classList.remove('map--faded');

// 3. На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона #pin.

// У метки должны быть следующие данные:
// Координаты:style="left: {{location.x}}px; top: {{location.y}}px;"
// src="{{author.avatar}}"
// alt="{{заголовок объявления}}"
// Обратите внимание

// Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки, а координаты, на которые указывает метка своим острым концом. Чтобы найти эту координату нужно учесть размеры элемента с меткой.

var renderPin = function(proposal) {
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var newPin = templatePin.cloneNode(true);
  var pinImg = newPin.querySelector('img');

  newPin.style.left = proposal.location.x + 'px';
  newPin.style.top = proposal.location.y + 'px';
  pinImg.src = proposal.author.avatar;
  pinImg.alt = proposal.offer.title;

  return newPin;
};

// 4. Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.

var mapPinsBlock = document.querySelector('.map__pins');

var greateFragmentElements = function(arrProposals) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrProposals.length; i++) {
    fragment.appendChild(renderPin(arrProposals[i]));
  }

  return fragment;
};


mapPinsBlock.appendChild(greateFragmentElements(arrProposals));

// 5. На основе первого по порядку элемента из сгенерированного массива и шаблона #card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container:

var textRooms = function(elementRooms) {
  var text;

  switch (elementRooms) {
    case 1 :
      text = " комната";
      break;
    case 5 :
      text = " комнат";
      break;
    default :
      text = " комнаты";
      break;
  }

  return elementRooms + text;
};

var textGuests = function(elementGuests) {
  var text;

  switch (elementGuests) {
    case 1 :
      text = " гостя.";
      break;
    default :
      text = " гостей.";
      break;
  }

  return elementGuests + text;
};

var checkFeature = function(listFeatures, element) {
  var arrIndexDeleteElement = [];
  for (var i = 0; i < listFeatures.length; i++) {
    var check = false;

    for (var j = 0; j < element.offer.features.length; j++) {
      if (listFeatures[i].classList.contains('popup__feature--' + element.offer.features[j])) {
        check = true;
        continue;
      }
    }

    if (!check) {
      arrIndexDeleteElement.push(i);
    }
  }

  if (arrIndexDeleteElement.length) {

    return arrIndexDeleteElement;
  }
};

var removeElement = function (block, arrElements, arrNumbersElements) {

  arrNumbersElements.forEach( function(elem) {
    block.removeChild(arrElements[elem]);
  });

};

var addMissingElement = function(block, element) {
  block.appendChild(element.cloneNode());
};

var addSrc = function (imgElement, imgSrc) {
  imgElement.src = imgSrc;
};

var renderCard = function(element) {
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var newCard = templateCard.cloneNode(true);
  var popupFeatures = newCard.querySelector('.popup__features');
  var listFeatures = popupFeatures.querySelectorAll('.popup__feature');
  var popupPhotos = newCard.querySelector('.popup__photos');
  var arrImgPhotos = popupPhotos.querySelectorAll('.popup__photo');
  var sumSrcPhotos = element.offer.photos.length;

  newCard.querySelector('.popup__title').textContent = element.offer.title;
  newCard.querySelector('.popup__text--address').textContent = element.offer.address;
  newCard.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
  newCard.querySelector('.popup__type').textContent = TYPES_OFFER_TRANSLATE[element.offer.type];
  newCard.querySelector('.popup__text--capacity').textContent = textRooms(element.offer.rooms) + " для " + textGuests(element.offer.guests);
  newCard.querySelector('.popup__text--time').textContent = "заезд после " + element.offer.checkin + ", выезд до " + element.offer.checkout + ".";
  newCard.querySelector('.popup__description').textContent = element.offer.description;
  newCard.querySelector('.popup__avatar').src = element.author.avatar;

  // В список .popup__features выведите все доступные удобства в объявлении.
  removeElement(popupFeatures, listFeatures, checkFeature(listFeatures, element));


  // В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
  if (arrImgPhotos.length < sumSrcPhotos && arrImgPhotos.length == 1) {

    for (var i = 0; i < sumSrcPhotos - arrImgPhotos.length; i++) {
      addMissingElement(popupPhotos, arrImgPhotos[0]);
    }

    arrImgPhotos = popupPhotos.querySelectorAll('.popup__photo');

    for (var j = 0; j < arrImgPhotos.length; j++) {
      addSrc(arrImgPhotos[j], element.offer.photos[j]);
    }
  }

  return newCard;
};

userMap.insertBefore(renderCard(arrProposals[0]), userMap.querySelector('.map__filters-container'));


