import { areasArray } from './areas.js';

// 表示地域名
const areaNameOutput = (targetCode) => {
  // targetCode = areasArray.code
  const areaName = areasArray.filter((element) => {
    return element.code == targetCode;
  });
  document.getElementById('js_weather_area').textContent = areaName[0].name;
};

// 発表時刻
const reportDatetimeOutput = (targetArray) => {
  // targetArray = yyyy-mm-ddT00:00:00+09:00
  const targetSplit = targetArray.split('+')[0]; // +以前を切り出し(yyyy-mm-ddT00:00:00)
  const targetReplace = targetSplit.replace(/-/g, '/'); // -を/に変更(yyyy/mm/ddT00:00:00)
  const reportDatetime = targetReplace.replace('T', ' '); // Tを半角スペースに変更(yyyy/mm/dd 00:00:00)
  const weatherReportDatetime = document.getElementById('js_weather_reportDatetime');
  weatherReportDatetime.textContent = reportDatetime;
  weatherReportDatetime.setAttribute('datetime', targetArray);
};

// 発表者
const publishingOfficeOutput = (targetArray) => {
  // targetArray = 発表者(String)
  document.getElementById('js_weather_publishingOffice').textContent = targetArray;
};

// 日にち
const dayDateBuild = (targetArray) => {
  // targetArray =  ['yyyy-mm-ddT00:00:00+09:00', ..]
  const EACH_DAYS_STRING = ['今日', '明日', '明後日'];
  const DAY_EACH = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
  const templateWrapper = document.getElementById('js_weather_wrapper_template');

  targetArray.forEach((element, index) => {
    const thisDay = new Date(element).getDay();
    const templateClone = templateWrapper.content.cloneNode(true);
    const templateWeatherWrapper = templateClone.querySelector('.weather_wrapper');
    const templateWeatherWrapperDate = templateClone.querySelector('.weather_wrapper__date');
    const elementSplit = element.split('T')[0]; // T以前を切り出し(yyyy-mm-dd)
    const elementSubstring = elementSplit.substring(8, 10); // 日付を抜き出し(dd)
    const eachDaysNumber = Number(elementSubstring); // ゼロサプレス
    templateWeatherWrapper.dataset.day = elementSplit;
    templateWeatherWrapperDate.dataset.time = element;
    templateWeatherWrapperDate.textContent = `${EACH_DAYS_STRING[index]}${eachDaysNumber}日${DAY_EACH[thisDay]}`;
    document.getElementById('js_weather').appendChild(templateClone);
  });
};

// 各日の天気テキスト
const weatherTextBuild = (targetArray) => {
  // targetArray = ['天気(String)', ..]
  targetArray.forEach((element, index) => {
    document.getElementsByClassName('weather_wrapper__weather_text')[index].textContent = element;
  });
};

// 気温
const temperatureEachBuild = (targetArray, targetArrayValue) => {
  // targetArray = ['yyyy-mm-ddT00:00:00+09:00', 'yyyy-mm-ddT09:00:00+09:00']
  // targetArrayValue =  ['最低気温(Number)', '最高気温(Number)']
  const newDate = new Date();
  const toDayHours = newDate.getHours();
  const temperatureArray = []; // [['yyyy-mm-dd', '時(Number)', '最低気温(Number)'], ['yyyy-mm-dd', '時(Number)', '最高気温(Number)']]

  targetArray.forEach((element, index) => {
    temperatureArray[index] = [];
    temperatureArray[index][0] = element.split('T')[0]; // yyyy-mm-dd
    temperatureArray[index][1] = element.split('T')[1].substring(0, 2); // hh
    temperatureArray[index][2] = targetArrayValue[index]; // 気温(Number)
  });

  targetArrayValue.forEach((element, index) => {
    if (index % 2 === 0) {
      document.querySelector(`.weather_wrapper[data-day="${temperatureArray[index][0]}"] .temperature_wrapper__each:first-of-type .temperature_wrapper__value`).textContent = `${temperatureArray[index][2]}°`;
    } else {
      document.querySelector(`.weather_wrapper[data-day="${temperatureArray[index][0]}"] .temperature_wrapper__each:last-of-type .temperature_wrapper__value`).textContent = `${temperatureArray[index][2]}°`;
    }

    // 5時になったら当日の最低気温を-に（データが不正になるため）
    if (5 <= toDayHours) {
      document.querySelector('.weather_wrapper .temperature_wrapper__each:first-of-type .temperature_wrapper__value').textContent = '-';
    }
    // 17時になったら当日の気温関連要素を非表示にする（データが不正になるため）
    if (17 <= toDayHours) {
      document.getElementsByClassName('weather_wrapper__inner')[0].classList.add('js_night_shift');
    }
  });
};

// 降水確率
const rainyPercentEachBuild = (targetArray, targetArrayValue) => {
  // targetArray= ['yyyy-mm-ddT00:00:00+09:00', ..]
  // targetArrayValue = ['n日n時の降水確率(Number)', ..]
  const rainyPercentArray = [];
  targetArray.forEach((element, index) => {
    rainyPercentArray[index] = [];
    rainyPercentArray[index][0] = element.split('T')[0]; // yyyy-mm-dd
    rainyPercentArray[index][1] = element.split('T')[1].substring(0, 2); // hh
    rainyPercentArray[index][2] = targetArrayValue[index]; // 降水確率(Number)
  });
  rainyPercentArray.forEach((element) => {
    // ラッパー各個
    const rainyPercentWrapperEach = document.createElement('p');
    rainyPercentWrapperEach.classList.add('rainy_percent_wrapper__each');

    // 時間
    const rainyPercentWrapperTime = document.createElement('span');
    rainyPercentWrapperTime.classList.add('rainy_percent_wrapper__time');
    rainyPercentWrapperTime.textContent = `${Number(element[1])}時〜`;

    // 降水確率数値
    const rainyPercentWrapperValue = document.createElement('span');
    rainyPercentWrapperValue.classList.add('rainy_percent_wrapper__value');
    rainyPercentWrapperValue.textContent = `${element[2]}%`;

    rainyPercentWrapperEach.appendChild(rainyPercentWrapperTime); // p.rainy_percent_wrapper__each > span.rainy_percent_wrapper__time
    rainyPercentWrapperEach.appendChild(rainyPercentWrapperValue); // p.rainy_percent_wrapper__each > span.rainy_percent_wrapper__value
    document.querySelector(`.weather_wrapper[data-day="${element[0]}"] .rainy_percent_wrapper`).appendChild(rainyPercentWrapperEach);
  });
};

const getWeather = async (prefectureCode) => {
  // prefectureCode = areasArray.code
  const loading = document.getElementById('js_loading');
  loading.classList.remove('js_cancel');

  try {
    const URL = 'https://www.jma.go.jp/bosai/forecast/data/forecast/';
    const encodeParam = encodeURIComponent(prefectureCode);
    const response = await fetch(`${URL}${encodeParam}.json`);
    const data = await response.json();

    // 表示地域名
    areaNameOutput(prefectureCode);

    // 発表時刻
    reportDatetimeOutput(data[0].reportDatetime);

    // 発表者
    publishingOfficeOutput(data[0].publishingOffice);

    // 日にち
    dayDateBuild(data[0].timeSeries[0].timeDefines);

    // 各日の天気テキスト
    weatherTextBuild(data[0].timeSeries[0].areas[0].weathers);

    // 気温
    temperatureEachBuild(data[0].timeSeries[2].timeDefines, data[0].timeSeries[2].areas[0].temps);

    // 降水確率
    rainyPercentEachBuild(data[0].timeSeries[1].timeDefines, data[0].timeSeries[1].areas[0].pops);
  } catch (error) {
    console.error(error);
    alert('エラーが発生しました。');
  } finally {
    loading.classList.add('js_cancel');
  }
};

// 地域選択プルダウン
(() => {
  const areaSelectButton = document.getElementById('js_area_select');
  areasArray.forEach((element) => {
    const option = document.createElement('option');
    option.setAttribute('value', element.code);
    option.textContent = element.name;
    areaSelectButton.appendChild(option);
  });
  document.querySelector('#js_area_select option[value="130000"]').setAttribute('selected', '');

  getWeather(130000);

  areaSelectButton.addEventListener('input', (code) => {
    document.querySelectorAll('.weather_wrapper').forEach((wrapper) => {
      wrapper.parentNode.removeChild(wrapper);
    });
    getWeather(code.target.value);
  });
})();
