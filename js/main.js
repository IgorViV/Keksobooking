'use strict';

var TITLES_OFFER = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPES_OFFER = ["palace", "flat", "house", "bungalo"];
var CHECKIN_OFFER = ["12:00", "13:00", "14:00"];
var CHECKOUT_OFFER = ["12:00", "13:00", "14:00"];
var FEATURES_OFFER = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var PHOTOS_OFFER = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
var arrProposals = [];

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

// 1. Создаем массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку.
var rangeRandomElements = getRandomRange(1, 8);
var proposal = {};

for (var i = 0; i < 8; i++) {
  proposal = {
    author: {
      avatar: "img/avatars/user0" + rangeRandomElements[i] + ".png"
    },
    offer: {
      title: TITLES_OFFER[rangeRandomElements[i]],
      addres: "600, 350",
      price: getRandomNumber(1000, 1000000),
      type: TYPES_OFFER[getRandomNumber(0, TYPES_OFFER.length)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(1, 5),
      checkin: CHECKIN_OFFER[getRandomNumber(0, CHECKIN_OFFER.length)],
      checkout: CHECKOUT_OFFER[getRandomNumber(0, CHECKIN_OFFER.length)],
      features: FEATURES_OFFER.slice(0, getRandomNumber(0, FEATURES_OFFER.length - 1) + 1),
      description: " ",
      photos: getArrayRandomElement(PHOTOS_OFFER)
    },
    location: {
      x: getRandomNumber(130, 630),
      y: getRandomNumber(130, 630)
    }
  };
  arrProposals[i] = proposal;
};

console.log(arrProposals);


//   "location": {
//     «x»: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
//     «y»: случайное число, координата y метки на карте от 130 до 630.
//   }
// }


// 2. У блока .map уберите класс .map--faded.

// Это временное решение, этот класс переключает карту из неактивного состояния в активное. В последующих заданиях, в соответствии с ТЗ вы будете переключать режимы страницы: неактивный, в котором карта и обе формы заблокированы и активный режим, в котором производится ввод данных и просмотр похожих объявлений. Сейчас, для тестирования функции генерации похожих объявлений мы временно сымитируем активный режим, а в последующих разделах запрограммируем его полностью.

// 3. На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона #pin.

// У метки должны быть следующие данные:
// Координаты:style="left: {{location.x}}px; top: {{location.y}}px;"
// src="{{author.avatar}}"
// alt="{{заголовок объявления}}"
// Обратите внимание

// Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки, а координаты, на которые указывает метка своим острым концом. Чтобы найти эту координату нужно учесть размеры элемента с меткой.

// 4. Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.

// 5. На основе первого по порядку элемента из сгенерированного массива и шаблона #card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container:

// Выведите заголовок объявления offer.title в заголовок .popup__title.
// Выведите адрес offer.address в блок .popup__text--address.
// Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
// В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
// Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей.
// Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
// В список .popup__features выведите все доступные удобства в объявлении.
// В блок .popup__description выведите описание объекта недвижимости offer.description.
// В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
// Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.


// Стоит отдельно объявить функцию генерации случайных данных, функцию создания DOM-элемента на основе JS-объекта, функцию заполнения блока DOM-элементами на основе массива JS-объектов. Пункты задания примерно соответствуют функциям, которые вы должны создать.
