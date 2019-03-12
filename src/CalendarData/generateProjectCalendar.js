// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create
import format from 'date-fns/format';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import set from 'lodash/set';
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import subDays from 'date-fns/sub_days';
import setDay from 'date-fns/set_day';
import isWeekend from 'date-fns/is_weekend';
import isFirstDayOfMonth from 'date-fns/is_first_day_of_month';

const handleResponse = (response) => {
  return response.result;
};

const getMonthHeader = (date) => [
  [format(date, 'YYYY MMM')],
  ['MON', 'TUE', 'WED', 'THU', 'FRI']
]

const parseHexColor = (hex) => {
  let m;
  try {
    m = hex.match(/^#([0-9a-f]{3})$/i)[1];
    if (m) {
      return [
        parseInt(m.charAt(0),16)*0x11,
        parseInt(m.charAt(1),16)*0x11,
        parseInt(m.charAt(2),16)*0x11
      ];
    }
  } catch(e) {
    m = hex.match(/^#([0-9a-f]{6})$/i)[1];
    if (m) {
      return [
        parseInt(m.substr(0,2),16),
        parseInt(m.substr(2,2),16),
        parseInt(m.substr(4,2),16)
      ];
    }
  }
  return [0,0,0];
}

const cssColorToRgbJson = (hex) => {
  const rgb = parseHexColor(hex).map(c => c / 255)
  return {
    red: rgb[0],
    green: rgb[1],
    blue: rgb[2],
  }
}

const blackBorder = {
  style: 'SOLID',
  color: cssColorToRgbJson('#000'),
};

const getWholeRowRange = (startRowIndex, endRowIndex) => ({
  startRowIndex,
  endRowIndex,
  startColumnIndex: 0,
  endColumnIndex: 5,
})

export default (spreadsheets, data, projectName) => {
  const createNewSpreadSheet = (title) => spreadsheets.create({
    properties: { title: `${title}-${format(new Date(), 'YYYYMMDDHHmm')}` },
  }).then(handleResponse);

  const setSpreadSheetValue = (spreadsheetId, values) => spreadsheets.values.append({
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    resource: { values },
  }).then(handleResponse);

  const formatSheet = (spreadsheetId, values, colorData) => {
    const {
      monthHeaders,
      weekdayLabels,
      weekdays,
      bluedays,
      yellowdays,
      totalRows,
    } = values.reduce((all, thisMonth, mIndex) => {
      const { totalRows } = all;
      all.monthHeaders.push(getWholeRowRange(totalRows, totalRows + 1))
      all.weekdayLabels.push(getWholeRowRange(totalRows + 1, totalRows + 2))
      thisMonth.forEach((r, i) => {
        if (i % 2 === 0) {
          const rowStart = totalRows + 2 + i
          const colorRowIndex = i / 2;
          colorData[mIndex][colorRowIndex].forEach((color, colIndex) => {
            if (typeof color !== 'undefined') {
              const coloredRange = {
                startRowIndex: rowStart,
                endRowIndex: rowStart + 2,
                startColumnIndex: colIndex,
                endColumnIndex: colIndex + 1,
              };
              if (color) {
                all.yellowdays.push(coloredRange)
              } else {
                all.bluedays.push(coloredRange)
              }
            }
          })
          all.weekdays.push(getWholeRowRange(rowStart, rowStart + 2));
        }
      });
      all.totalRows += thisMonth.length + 2;
      return all
    }, {
      monthHeaders: [],
      weekdayLabels: [],
      weekdays: [],
      bluedays: [],
      yellowdays: [],
      totalRows: 0,
    });
    return spreadsheets.batchUpdate({ spreadsheetId }, {
      requests: [
        {
          updateBorders: {
            range: getWholeRowRange(0, totalRows),
            top: blackBorder,
            left: blackBorder,
            bottom: blackBorder,
            right: blackBorder,
            innerHorizontal: blackBorder,
            innerVertical: blackBorder,
          }
        },
        ...weekdays.map(range => ({
          updateBorders: {
            range,
            innerHorizontal: { style: 'NONE' },
          }
        })),
        ...weekdays.map(range => ({
          repeatCell: {
            range,
            cell: {
              userEnteredFormat: {
                horizontalAlignment : 'LEFT',
                textFormat: {
                  fontSize: 8,
                },
                wrapStrategy: 'WRAP',
              }
            },
            fields: 'userEnteredFormat(textFormat,horizontalAlignment,wrapStrategy)'
          }
        })),
        ...bluedays.map(range => ({
          repeatCell: {
            range,
            cell: {
              userEnteredFormat: {
                backgroundColor: cssColorToRgbJson('#548dd4'),
              }
            },
            fields: 'userEnteredFormat(backgroundColor)'
          }
        })),
        ...yellowdays.map(range => ({
          repeatCell: {
            range,
            cell: {
              userEnteredFormat: {
                backgroundColor: cssColorToRgbJson('#ffc000'),
              }
            },
            fields: 'userEnteredFormat(backgroundColor)'
          }
        })),
        ...monthHeaders.map((range) => ({
          repeatCell: {
            range,
            cell: {
              userEnteredFormat: {
                backgroundColor: cssColorToRgbJson('#808080'),
                padding: {
                  top: 6,
                  bottom: 6,
                  left: 6,
                },
                textFormat: {
                  fontSize: 11,
                }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,padding)'
          }
        })),
        ...weekdayLabels.map((range) => ({
          repeatCell: {
            range,
            cell: {
              userEnteredFormat: {
                backgroundColor: cssColorToRgbJson('#d9d9d9'),
                horizontalAlignment : 'CENTER',
                padding: {
                  top: 6,
                  bottom: 6,
                },
                textFormat: {
                  fontSize: 11,
                }              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,padding)'
          }
        })),
        ...monthHeaders.map((range) => ({
          mergeCells: {
            range,
            mergeType: 'MERGE_ALL'
          }
        })),
      ]
    }).then(handleResponse);
  }

  const beginDate = minBy(data, '結束時間')['結束時間'];
  const calanderBegin = setDay(beginDate, 1);
  const endDate = maxBy(data, '結束時間')['結束時間'];
  const calanderEnd = setDay(endDate, 5);

  // step 1
  const allDays = {};

  let key = 0;
  let toDay = calanderBegin;
  for (; toDay <= calanderEnd; key += 1) {
    toDay = addDays(calanderBegin, key);
    allDays[toDay] = [];
  }

  // step 2
  data.forEach((event) => {
    allDays[subDays(event['結束時間'], 1)].push(event);
  });

  // step 3
  const cellData = [];
  const colorData = [];

  let row;
  let col;
  let m = 0
  let mOffset = 0
  let nowDate = calanderBegin;
  for (; nowDate <= calanderEnd; mOffset += 1) {
    if (isFirstDayOfMonth(nowDate)) {
      m += 1
      mOffset %= 7
    }
    if (!isWeekend(nowDate)) {
      row = Math.floor(mOffset / 7);
      row = row + row;
      col = mOffset % 7;
      set(cellData, [m, row, col], format(nowDate, 'DD'));
      const event = allDays[nowDate]
      if (event && event.length) {
        set(cellData, [m, row + 1, col], event.reduce((t, e, i) => `${t}${i > 0 ? '\n' : ''}${e['任務名稱']}`, ''));
        set(colorData, [m, row / 2, col], event[0]['任務負責人'] === '客戶');
      }
    }
    nowDate = addDays(nowDate, 1);
  }

  return createNewSpreadSheet(projectName).then((result) => {
    const spreadsheetId = result.spreadsheetId;
    return setSpreadSheetValue(spreadsheetId, cellData.reduce((all, cd, i) => [
      ...all,
      ...getMonthHeader(addMonths(calanderBegin, i)),
      ...cd,
    ], [])).then(() => formatSheet(spreadsheetId, cellData, colorData));
  });
}
