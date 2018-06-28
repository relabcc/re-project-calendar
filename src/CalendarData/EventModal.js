import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ArrowTo from 'react-icons/lib/fa/long-arrow-right';
// import Config from 'react-icons/lib/fa/cog';
import format from 'date-fns/format';

import Flex from '../components/Flex';
import Box from '../components/Box';

Modal.setAppElement('#root');

const dateString = (date) => format(date, 'YYYY-MM-DD');

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    zIndex: 99,
    background: 'rgba(0, 0, 0, 0.7)',
  },
};

const keys = [
  '專案名稱',
  '任務名稱',
  '任務類型',
  '任務負責人',
];

class EventModal extends PureComponent {
  state = {
    editing: false,
  }

  render() {
    const { data, onRequestClose } = this.props;
    // console.log(data);
    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Event Modal"
      >
        <Box p="1em">
          <Flex justify="center" align="center" mb="1em">
            <Box>
              {dateString(data['開始時間'])}
            </Box>
            <Box is={ArrowTo} mx="1em" />
            <Box>
              {dateString(data['結束時間'])}
            </Box>
          </Flex>
          {keys.map((key) => (
            <Flex key={key} my="0.5em">
              <Box align="right" w="6em" mr="0.5em">
                {key}：
              </Box>
              <Box maxWidth="14em">
                {data[key] || '未填寫'}
              </Box>
            </Flex>
          ))}
        </Box>
      </Modal>
    );
  }
}

EventModal.propTypes = {
  data: PropTypes.object,
  onRequestClose: PropTypes.func,
};

export default EventModal;
