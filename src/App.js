import React, { PureComponent } from 'react';
import { GoogleSheetsApi } from './vendor/react-google-sheet'

import Blob from './Blob';
import SheetData from './SheetData';
import Box from './components/Box';
import Button from './components/Button';
import ThemeProvider from './components/ThemeProvider';

const CLIENT_ID = '871831599839-67kmk9oreergrthq16b64qrdb41b4jcv.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA3SEKynUtt2EO2r_LnBTtlL4xkmNu6H-E';

class App extends PureComponent {
  render() {
    return (
      <ThemeProvider>
        <GoogleSheetsApi clientId={CLIENT_ID} apiKey={API_KEY}>
          {({ authorize, loading: apiLoading, signout, signedIn, error }) => (
            <div>
              {apiLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <Blob data={error} />
              ) : signedIn ? (
                <Box m="1em">
                  <Button onClick={signout}>登出</Button>
                </Box>
              ) : (
                <Box m="1em">
                  <Button onClick={authorize}>登入</Button>
                </Box>
              )}
              {signedIn && <SheetData id="1iwEuePpqoK3rGHd4ml54Bji4ZUm2IpqLlefs6f3Uzac" range="A:G" />}
            </div>
          )}
        </GoogleSheetsApi>
      </ThemeProvider>
    );
  }
}

export default App;
