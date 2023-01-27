const areasArray = [
  { code: '013000', name: '北海道' },
  { code: '020000', name: '青森県' },
  { code: '030000', name: '岩手県' },
  { code: '040000', name: '宮城県' },
  { code: '050000', name: '秋田県' },
  { code: '060000', name: '山形県' },
  { code: '070000', name: '福島県' },
  { code: '080000', name: '茨城県' },
  { code: '090000', name: '栃木県' },
  { code: '100000', name: '群馬県' },
  { code: '110000', name: '埼玉県' },
  { code: '120000', name: '千葉県' },
  { code: '130000', name: '東京都' },
  { code: '140000', name: '神奈川県' },
  { code: '150000', name: '新潟県' },
  { code: '160000', name: '富山県' },
  { code: '170000', name: '石川県' },
  { code: '180000', name: '福井県' },
  { code: '190000', name: '山梨県' },
  { code: '200000', name: '長野県' },
  { code: '210000', name: '岐阜県' },
  { code: '220000', name: '静岡県' },
  { code: '230000', name: '愛知県' },
  { code: '240000', name: '三重県' },
  { code: '250000', name: '滋賀県' },
  { code: '260000', name: '京都府' },
  { code: '270000', name: '大阪府' },
  { code: '280000', name: '兵庫県' },
  { code: '290000', name: '奈良県' },
  { code: '300000', name: '和歌山県' },
  { code: '310000', name: '鳥取県' },
  { code: '320000', name: '島根県' },
  { code: '330000', name: '岡山県' },
  { code: '340000', name: '広島県' },
  { code: '350000', name: '山口県' },
  { code: '360000', name: '徳島県' },
  { code: '370000', name: '香川県' },
  { code: '380000', name: '愛媛県' },
  { code: '390000', name: '高知県' },
  { code: '400000', name: '福岡県' },
  { code: '410000', name: '佐賀県' },
  { code: '420000', name: '長崎県' },
  { code: '430000', name: '熊本県' },
  { code: '440000', name: '大分県' },
  { code: '450000', name: '宮崎県' },
  { code: '460100', name: '鹿児島県' },
  { code: '471000', name: '沖縄県' },
];

// 地域選択プルダウン
(() => {
  const areaSelectButton = document.getElementById('js_area_select');
  areasArray.forEach((element) => {
    const DOMoption = document.createElement('option');
    DOMoption.setAttribute('value', element.code);
    DOMoption.textContent = element.name;
    areaSelectButton.appendChild(DOMoption);
  });
  document.querySelector('#js_area_select option[value="130000"]').setAttribute('selected', '');

  areaSelectButton.addEventListener('input', (element) => {
    document.querySelectorAll('.weather_wrapper').forEach((wrapper) => {
      wrapper.parentNode.removeChild(wrapper);
    });
    getWeather(element.target.value);
  });
})();

// 表示地域名
const areaNameOutput = (targetCode) => {
  const areaName = areasArray.filter((element) => {
    return element.code == targetCode;
  });
  document.getElementById('js_weather_area').textContent = areaName[0].name;
};

// 発表時刻
const reportDatetimeOutput = (targetArray) => {
  const reportDatetime = targetArray.split('+')[0].replace(/-/g, '/').replace('T', ' ');
  const weatherReportDatetime = document.getElementById('js_weather_reportDatetime');
  weatherReportDatetime.textContent = reportDatetime;
  weatherReportDatetime.setAttribute('datetime', targetArray);
};

// 発表者
const publishingOfficeOutput = (targetArray) => {
  document.getElementById('js_weather_publishingOffice').textContent = targetArray;
};

// DOM生成
const DOMBuild = () => {
  const weatherContainer = document.getElementById('js_weather');

  // ラッパー
  const DOMWeatherWrapper = document.createElement('div');
  DOMWeatherWrapper.classList.add('weather_wrapper');

  // 日付
  const DOMWeatherWrapperDate = document.createElement('time');
  DOMWeatherWrapperDate.classList.add('weather_wrapper__date');
  DOMWeatherWrapper.appendChild(DOMWeatherWrapperDate); // div.weather_wrapper > time.weather_wrapper__date

  // 天気テキスト
  const DOMweatherWrapperWeatherText = document.createElement('p');
  DOMweatherWrapperWeatherText.classList.add('weather_wrapper__weather_text');
  DOMWeatherWrapper.appendChild(DOMweatherWrapperWeatherText); // div.weather_wrapper > p.weather_wrapper__weather_text

  // 気温と降水確率のインナーラッパー
  const DOMweatherWrapperInner = document.createElement('div');
  DOMweatherWrapperInner.classList.add('weather_wrapper__inner');
  DOMWeatherWrapper.appendChild(DOMweatherWrapperInner); // div.weather_wrapper > div.weather_wrapper__inner

  // 気温ラッパー
  const DOMtemperatureWrapper = document.createElement('div');
  DOMtemperatureWrapper.classList.add('temperature_wrapper');
  DOMweatherWrapperInner.appendChild(DOMtemperatureWrapper); // div.weather_wrapper__inner > div.temperature_wrapper

  // 気温各個（最低気温）
  const DOMtemperatureEachFirst = document.createElement('p');
  DOMtemperatureEachFirst.textContent = '朝の最低:';
  DOMtemperatureEachFirst.classList.add('temperature_wrapper__each');
  DOMtemperatureWrapper.appendChild(DOMtemperatureEachFirst); // div.temperature_wrapper > p.temperature_wrapper__each > span.temperature_wrapper__value

  // 気温数値（最低気温）
  const DOMtemperatureEachFirstValue = document.createElement('span');
  DOMtemperatureEachFirstValue.classList.add('temperature_wrapper__value');
  DOMtemperatureEachFirst.appendChild(DOMtemperatureEachFirstValue); // p.temperature_wrapper__each > span.temperature_wrapper__value

  // 気温各個（最高気温）
  const DOMtemperatureEachSecond = document.createElement('p');
  DOMtemperatureEachSecond.textContent = '日中の最高:';
  DOMtemperatureEachSecond.classList.add('temperature_wrapper__each');
  DOMtemperatureWrapper.appendChild(DOMtemperatureEachSecond); // div.temperature_wrapper > p.temperature_wrapper__each > span.temperature_wrapper__value

  // 気温数値（最高気温）
  const DOMtemperatureEachSecondValue = document.createElement('span');
  DOMtemperatureEachSecondValue.classList.add('temperature_wrapper__value');
  DOMtemperatureEachSecond.appendChild(DOMtemperatureEachSecondValue); // p.temperature_wrapper__each > span.temperature_wrapper__value

  // 降水確率ラッパー
  const DOMrainyPercentWrapper = document.createElement('div');
  DOMrainyPercentWrapper.classList.add('rainy_percent_wrapper');
  DOMweatherWrapperInner.appendChild(DOMrainyPercentWrapper); // div.weather_wrapper__inner > div.temperature_wrapper

  weatherContainer.appendChild(DOMWeatherWrapper);
};

const zeroPadding = (num) => ('00' + num).slice(-2);
const newDate = new Date();
const toDayYear = newDate.getFullYear();
const toDayMonth = newDate.getMonth() + 1;
const toDayDate = newDate.getDate();
const toDayHours = newDate.getHours();
const toDaysDate = `${toDayYear}-${zeroPadding(toDayMonth)}-${zeroPadding(toDayDate)}`;
const tomorrowsDate = `${toDayYear}-${zeroPadding(toDayMonth)}-${zeroPadding(toDayDate) + 1}`;
const daysEach = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];

// 日にち
const dayDateBuild = (targetArray) => {
  targetArray.forEach((element, index) => {
    DOMBuild(); // 3日分のDOMを生成
    const weatherWrapper = document.getElementsByClassName('weather_wrapper');
    const weatherWrapperDate = document.getElementsByClassName('weather_wrapper__date');
    const thisDate = new Date(element).getDate();
    const thisDay = new Date(element).getDay();
    if (toDayDate == thisDate) {
      weatherWrapperDate[index].textContent = `今日 ${element.split('T')[0].replace(/-/g, '/').substring(8)}日${daysEach[thisDay]}`;
    } else if (toDayDate + 1 == thisDate) {
      weatherWrapperDate[index].textContent = `明日 ${element.split('T')[0].replace(/-/g, '/').substring(8)}日${daysEach[thisDay]}`;
    } else if (toDayDate + 2 == thisDate) {
      weatherWrapperDate[index].textContent = `明後日 ${element.split('T')[0].replace(/-/g, '/').substring(8)}日${daysEach[thisDay]}`;
    }
    weatherWrapperDate[index].setAttribute('data-time', element);
    weatherWrapper[index].dataset.day = element.split('T')[0];
  });
};

// 各日の天気テキスト
const weatherTextBuild = (targetArray) => {
  targetArray.weathers.forEach((element, index) => {
    document.getElementsByClassName('weather_wrapper__weather_text')[index].textContent = element;
  });
};

// 気温
const temperatureEachBuild = (targetArray, targetArrayValue) => {
  const temperatureArray = [];
  targetArray.forEach((element, index) => {
    temperatureArray[index] = [];
    temperatureArray[index][0] = element.split('T')[0]; // yyyy-mm-dd
    temperatureArray[index][1] = element.split('T')[1].substring(0, 2); // hh
    temperatureArray[index][2] = targetArrayValue[index]; // 気温数値
  });
  targetArrayValue.forEach((element, index) => {
    if (index % 2 === 0) {
      document.querySelector(`.weather_wrapper[data-day="${temperatureArray[index][0]}"] .temperature_wrapper__each:first-of-type .temperature_wrapper__value`).textContent = `${temperatureArray[index][2]}°`;
    } else {
      document.querySelector(`.weather_wrapper[data-day="${temperatureArray[index][0]}"] .temperature_wrapper__each:last-of-type .temperature_wrapper__value`).textContent = `${temperatureArray[index][2]}°`;
    }
    if (5 <= toDayHours) {
      document.querySelector('.weather_wrapper .temperature_wrapper__each:first-of-type .temperature_wrapper__value').textContent = '-';
    }
    if (17 <= toDayHours) {
      document.getElementsByClassName('weather_wrapper__inner')[0].classList.add('js_night_shift');
    }
  });
  document.querySelectorAll('.weather_wrapper .temperature_wrapper__each .temperature_wrapper__value').forEach((element) => {
    if (element.textContent === '') {
      element.textContent = '-';
    }
  });
};

// 降水確率
const rainyPercentEachBuild = (targetArray, targetArrayValue) => {
  const rainyPercentArray = [];
  targetArray.forEach((element, index) => {
    rainyPercentArray[index] = [];
    rainyPercentArray[index][0] = element.split('T')[0]; // yyyy-mm-dd
    rainyPercentArray[index][1] = element.split('T')[1].substring(0, 2); // hh
    rainyPercentArray[index][2] = targetArrayValue[index]; // 降水確率数値
  });
  rainyPercentArray.forEach((element) => {
    // 降水確率各個
    const DOMrainyPercentWrapperEach = document.createElement('p');
    DOMrainyPercentWrapperEach.classList.add('rainy_percent_wrapper__each');

    // 時間
    const DOMrainyPercentWrapperTime = document.createElement('span');
    DOMrainyPercentWrapperTime.classList.add('rainy_percent_wrapper__time');
    DOMrainyPercentWrapperTime.textContent = `${element[1]}時〜`;

    // 数値
    const DOMrainyPercentWrapperValue = document.createElement('span');
    DOMrainyPercentWrapperValue.classList.add('rainy_percent_wrapper__value');
    DOMrainyPercentWrapperValue.textContent = `${element[2]}%`;

    DOMrainyPercentWrapperEach.appendChild(DOMrainyPercentWrapperTime); // p.rainy_percent_wrapper__each > span.rainy_percent_wrapper__time
    DOMrainyPercentWrapperEach.appendChild(DOMrainyPercentWrapperValue); // p.rainy_percent_wrapper__each > span.rainy_percent_wrapper__value
    document.querySelector(`.weather_wrapper[data-day="${element[0]}"] .rainy_percent_wrapper`).appendChild(DOMrainyPercentWrapperEach);
  });
};

const getWeather = async (prefectureCode) => {
  try {
    const loading = document.getElementById('js_loading');
    loading.classList.remove('js_cancel');

    const url = 'https://www.jma.go.jp/bosai/forecast/data/forecast/';
    const encodeParam = encodeURIComponent(prefectureCode);
    const response = await fetch(`${url}${encodeParam}.json`);
    const data = await response.json();

    if (response.ok) {
      loading.classList.add('js_cancel');
    }

    // 表示地域名
    areaNameOutput(prefectureCode);

    // 発表時刻
    reportDatetimeOutput(data[0].reportDatetime);

    // 発表者
    publishingOfficeOutput(data[0].publishingOffice);

    // 日にち
    dayDateBuild(data[0].timeSeries[0].timeDefines);

    // 各日の天気テキスト
    weatherTextBuild(data[0].timeSeries[0].areas[0]);

    // 気温
    temperatureEachBuild(data[0].timeSeries[2].timeDefines, data[0].timeSeries[2].areas[0].temps);

    // 降水確率
    rainyPercentEachBuild(data[0].timeSeries[1].timeDefines, data[0].timeSeries[1].areas[0].pops);
  } catch (error) {
    console.error(error);
    alert('エラーが発生しました。');
  }
};
getWeather(130000);
