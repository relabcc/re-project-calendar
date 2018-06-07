import React from 'react';
import styled from 'styled-components';
import Box from './Box';

const WithoutIsOpen = ({ isOpen, ...props }) => <Box {...props} />;

export default styled(WithoutIsOpen)`
  position: relative;
  cursor: pointer;
  &::after {
    content: "${({ isOpen }) => isOpen ? '▲' : '▼'}";
    display: block;
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
  }
`;
