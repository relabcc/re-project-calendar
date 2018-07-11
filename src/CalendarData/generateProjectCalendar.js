// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create
import format from 'date-fns/format';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import set from 'lodash/set';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import setDay from 'date-fns/set_day';
import isWeekend from 'date-fns/is_weekend';

const handleResponse = (response) => {
  return response.result;
};

export default (spreadsheets, data, projectName) => {
  const createNewSpreadSheet = (title) => spreadsheets.create({
    properties: { title: `${title}-${format(new Date(), 'YYYYMMDDHHmm')}` },
  }).then(handleResponse);

  const beginDate = minBy(data, '開始時間')['開始時間'];
  const calanderBegin = setDay(beginDate, 1);
  const endDate = maxBy(data, '結束時間')['結束時間'];
  const calanderEnd = setDay(endDate, 5);

  // step 1
  const allDays = {};

  let key = 0;
  let toDay = calanderBegin;
  for (; toDay < calanderEnd; key += 1) {
    toDay = addDays(calanderBegin, key);
    allDays[toDay] = [];
  }

  // step 2
  data.forEach((event) => {
    allDays[subDays(event['結束時間'], 1)].push(event['任務名稱']);
  });

  console.log(allDays);

  // step 3
  const allDateds = [];

  let index = 0;
  let row;
  let col;
  let nowDate = calanderBegin;
  for (; nowDate < calanderEnd; index += 1) {
    nowDate = addDays(calanderBegin, index);
    if (!isWeekend(nowDate)) {
      row = Math.floor(index / 7);
      row = row + row;
      col = index % 7;
      set(allDateds, [row, col], format(nowDate, 'DD'));
      set(allDateds, [row + 1, col], allDays[nowDate].join('\n'));
    }
  }

  console.log(allDateds);

  const setSpreadSheetValue = (spreadsheetId, values) => spreadsheets.values.append({
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  }).then(handleResponse);

  return createNewSpreadSheet(projectName).then((result) => {
    const spreadsheetId = result.spreadsheetId;
    return setSpreadSheetValue(spreadsheetId, [
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      ...allDateds,
    ]);
  });
}
