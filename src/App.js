import React, { PureComponent } from 'react';
import { GoogleSheetsApi } from './vendor/react-google-sheet'

import Blob from './Blob';
import SheetData from './SheetData';
import Box from './components/Box';

const CLIENT_ID = '871831599839-67kmk9oreergrthq16b64qrdb41b4jcv.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA3SEKynUtt2EO2r_LnBTtlL4xkmNu6H-E';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <GoogleSheetsApi clientId={CLIENT_ID} apiKey={API_KEY}>
          {({ authorize, loading: apiLoading, signout, signedIn, error }) => (
            <div>
              {apiLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <Blob data={error} />
              ) : signedIn ? (
                <Box py="1em">
                  <button onClick={signout}>Sign Out</button>
                </Box>
              ) : (
                <Box py="1em">
                  <button onClick={authorize}>Authorize</button>
                </Box>
              )}
              {signedIn && <SheetData id="1iwEuePpqoK3rGHd4ml54Bji4ZUm2IpqLlefs6f3Uzac" range="A:F" />}
            </div>
          )}
        </GoogleSheetsApi>
      </div>
    );
  }
}

export default App;
