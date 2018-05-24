import React from 'react';
import PropTypes from 'prop-types';
import fromPairs from 'lodash/fromPairs';

import { GoogleSheet } from './vendor/react-google-sheet';

import Calendar from './Calendar';

const parseRow = (data) => {
  const header = data.shift();
  return data.map((row) => fromPairs(row.map((value, index) => [header[index], value])));
};

const SheetData = props => {
  return (
    <div>
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
    </div>
  );
};

SheetData.propTypes = {
  id: PropTypes.string,
  range: PropTypes.string,
};

export default SheetData;
