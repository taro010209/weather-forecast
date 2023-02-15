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

  areaSelectButton.addEventListener('input', (code) => {
    document.querySelectorAll('.weather_wrapper').forEach((wrapper) => {
      wrapper.parentNode.removeChild(wrapper);
    });
    getWeather(code.target.value);
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

const newDate = new Date();
const toDayYear = newDate.getFullYear();
const toDayMonth = newDate.getMonth() + 1;
const toDayDate = newDate.getDate();
const toDayHours = newDate.getHours();

// 日にち
const dayDateBuild = (targetArray) => {
  const DAY_EACH = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
  const templateWrapper = document.getElementById('js_weather_wrapper_template');

  targetArray.forEach((element) => {
    const thisDay = new Date(element).getDay();
    const templateClone = templateWrapper.content.cloneNode(true);
    const T_weatherWrapper = templateClone.querySelector('.weather_wrapper');
    const T_weatherWrapperDate = templateClone.querySelector('.weather_wrapper__date');
    T_weatherWrapper.dataset.day = element.split('T')[0];
    T_weatherWrapperDate.textContent = `今日 ${element.split('T')[0].replace(/-/g, '/').substring(8)}日${DAY_EACH[thisDay]}`;
    T_weatherWrapperDate.setAttribute('data-time', element);
    document.getElementById('js_weather').appendChild(templateClone);
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

    const URL = 'https://www.jma.go.jp/bosai/forecast/data/forecast/';
    const encodeParam = encodeURIComponent(prefectureCode);
    const response = await fetch(`${URL}${encodeParam}.json`);
    const data = await response.json();
    console.log(data);

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
