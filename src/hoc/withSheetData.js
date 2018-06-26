import React from 'react';
import { GoogleSheet } from '../vendor/react-google-sheet';

export default ({ id, range }) => (SubComp) => {
  const SheetData = (props) => {
    return (
      <GoogleSheet id={id} range={range}>
        {({ error, data, loading, sheetApi, currentUser }) =>
          loading ? (
            'Getting data...'
          ) : error ? (
            JSON.stringify(error, null, 2)
          ) : data ? (
            <SubComp data={data} sheetApi={sheetApi} currentUser={currentUser} {...props} />
          ) : null
        }
      </GoogleSheet>
    );
  };

  return SheetData;
};
