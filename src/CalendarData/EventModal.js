import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import Text from '../components/Text';
import Box from '../components/Box';

Modal.setAppElement('#root');

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

class EventModal extends PureComponent {
  state = {}

  render() {
    const { data, onRequestClose } = this.props;
    console.log(data);
    return (
      <Modal
        isOpen
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Event Modal"
      >
        <Box p="1em">
          <Text>
            {data.title}
          </Text>
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
