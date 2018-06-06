import React from 'react';
import styled from 'styled-components';
import Box from './Box';

const WithoutIsOpen = ({ isOpen, ...props }) => <Box {...props} />;

export default styled(WithoutIsOpen)`
  position: relative;
  &::after {
    content: "${(props) => props.isOpen ? '▲' : '▼'}";
    display: block;
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
  }
`;
