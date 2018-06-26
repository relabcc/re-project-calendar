import React from 'react';
import PropTypes from 'prop-types';
import fromPairs from 'lodash/fromPairs';
import addDays from 'date-fns/add_days';

import { GoogleSheet } from './vendor/react-google-sheet';

import Calendar from './Calendar';

const parseRow = (data) => {
  const header = data.shift();
  return data.map((row) => {
    const parsed = fromPairs(row.map((value, index) => [header[index], value]));
    return {
      ...parsed,
      開始時間: new Date(parsed['開始時間']),
      結束時間: addDays(new Date(parsed['結束時間']), 1),
    };
  }).filter((d) => !d['隱藏']);
};

const SheetData = props => {
  return (
    <GoogleSheet id={props.id} range={props.range}>
      {({ error, data, loading, sheetApi }) =>
        loading ? (
          'Getting data...'
        ) : error ? (
          JSON.stringify(error, null, 2)
        ) : data ? (
          <Calendar events={parseRow(data)} sheetApi={sheetApi} />
        ) : null
      }
    </GoogleSheet>
  );
};

SheetData.propTypes = {
  id: PropTypes.string,
  range: PropTypes.string,
};

export default SheetData;
