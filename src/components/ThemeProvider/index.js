import React from 'react';
import { ThemeProvider, injectGlobal } from 'styled-components';
import 'sanitize.css';

import theme from './theme';
import Box from '../Box';

injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    margin: 0;
    font-family: ${theme.font};
  }
`;

export default (props) => (
  <ThemeProvider theme={theme}>
    <Box color="text" f={[14, null, 16]} {...props} />
  </ThemeProvider>
);
