import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import fromPairs from 'lodash/fromPairs';
import addDays from 'date-fns/add_days';

import withSheetData from './hoc/withSheetData';
import Calendar from './Calendar';

const id = '1iwEuePpqoK3rGHd4ml54Bji4ZUm2IpqLlefs6f3Uzac';

const parseRow = (data) => {
  const header = data.shift();
  return data.map((row) => {
    const parsed = fromPairs(row.map((value, index) => [header[index], value]));
    return {
      ...parsed,
      開始時間: new Date(parsed['開始時間']),
      結束時間: addDays(new Date(parsed['結束時間']), 1),
      title: `${parsed['專案名稱']} | ${parsed['任務名稱']} by ${parsed['任務負責人']}`
    };
  }).filter((d) => !d['隱藏']);
};


const withUserData = (SubComp) => {
  const WithUserData = ({ data, ...props }) => {
    data.shift();
    return <SubComp emailData={fromPairs(data)} {...props} />;
  };
  return withSheetData({ id, range: 'email!A:B' })(WithUserData);
}

const CalendarData = (props) => {
  return createElement(withSheetData({ id, range: 'timeline!A:H' })((props) => <Calendar events={parseRow(props.data)} {...props} />));
};

CalendarData.propTypes = {
  range: PropTypes.string,
};

export default withUserData(CalendarData);
