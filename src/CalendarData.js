import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import fromPairs from 'lodash/fromPairs';

import withSheetData from './hoc/withSheetData';
import Calendar from './Calendar';

const id = '1iwEuePpqoK3rGHd4ml54Bji4ZUm2IpqLlefs6f3Uzac';

const withUserData = (SubComp) => {
  const WithUserData = ({ data, ...props }) => {
    data.shift();
    return <SubComp emailData={fromPairs(data)} {...props} />;
  };
  return withSheetData({ id, range: 'email!A:B' })(WithUserData);
}

const CalendarData = (props) => {
  return createElement(withSheetData({ id, range: 'timeline!A:H' })(Calendar), props);
};

CalendarData.propTypes = {
  range: PropTypes.string,
};

export default withUserData(CalendarData);
