import React, { PureComponent } from 'react';
import { GoogleSheetsApi } from './vendor/react-google-sheet'

import Blob from './Blob';
import CalendarData from './CalendarData';
import Box from './components/Box';
import Flex from './components/Flex';
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
            <Flex height="100%" flexDirection="column">
              {apiLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <Blob data={error} />
              ) : signedIn ? (
                <Box p="1em">
                  <Button onClick={signout}>登出</Button>
                </Box>
              ) : (
                <Box p="1em">
                  <Button onClick={authorize}>登入</Button>
                </Box>
              )}
              {signedIn && (
                <Box flex="1">
                  <CalendarData />
                </Box>
              )}
            </Flex>
          )}
        </GoogleSheetsApi>
      </ThemeProvider>
    );
  }
}

export default App;
