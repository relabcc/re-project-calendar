import { createElement } from 'react';
import PropTypes from 'prop-types';
import withSheetData from './hoc/withSheetData';
import Calendar from './Calendar';

const CalendarData = ({ id, range, ...props }) => createElement(withSheetData({ id, range })(Calendar), props);

CalendarData.propTypes = {
  id: PropTypes.string,
  range: PropTypes.string,
};

export default CalendarData;
