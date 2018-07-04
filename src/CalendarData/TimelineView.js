import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Timeline from 'react-calendar-timeline/lib';
import 'react-calendar-timeline/lib/Timeline.css';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import moment from 'moment';

import Box from '../components/Box';
import Flex from '../components/Flex';
import Button from '../components/Button';

class TimelineView extends PureComponent {
  static getDerivedStateFromProps({ events }) {
    return {
      eventsById: events.reduce((all, evt) => ({ ...all, [evt.id]: evt }), {}),
    }
  }
  state = {
    groupBy: 0,
  }

  render() {
    const { groups, events, onSelectEvent, summaryMode } = this.props;
    const { groupBy, eventsById } = this.state;
    const currentGroup = groups[summaryMode ? 1 : groupBy];

    const currentGroups = currentGroup.options.map((id) => ({ id, title: id }));

    return (
      <Flex flexDirection="column" height="100%">
        <Box mb="1em">
          {!summaryMode && groups.map(({ name, key }, index) => (
            <Button key={name} onClick={() => this.setState({ groupBy: index })} active={index === groupBy}>
              {key}
            </Button>
          ))}
        </Box>
        <Box flex="1">
          <Timeline
            groups={currentGroups}
            items={events.map((evt) => ({
              ...evt,
              group: evt[currentGroup.key],
              start_time: moment(evt['開始時間']),
              end_time: moment(evt['結束時間']),
            }))}
            defaultTimeStart={subDays(new Date(), 15)}
            defaultTimeEnd={addDays(new Date(), 15)}
            canMove={false}
            canChangeGroup={false}
            canResize={false}
            stackItems
            minZoom={7 * 24 * 60 * 60 * 1000}
            maxZoom={365.24 * 86400 * 1000}
            onItemSelect={(itemId) => onSelectEvent(eventsById[itemId])}
          />
        </Box>
      </Flex>
    );
  }
}

TimelineView.propTypes = {
  groups: PropTypes.array,
  events: PropTypes.array,
  onSelectEvent: PropTypes.func,
  summaryMode: PropTypes.bool,
};

export default TimelineView;
