import React from 'react';
import styled from 'styled-components';
import Box from './Box';

const WithoutIsOpen = ({ isOpen, ...props }) => (
  <Box
    p="0.5em"
    borderBottom="2px solid"
    {...props}
  />
);

export default styled(WithoutIsOpen)`
  position: relative;
  cursor: pointer;
  &::after {
    content: "${({ isOpen }) => isOpen ? '▲' : '▼'}";
    font-size: 0.75em;
    display: block;
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
  }
`;
