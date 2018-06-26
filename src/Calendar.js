import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import set from 'lodash/set';
import get from 'lodash/get';
import compact from 'lodash/compact';
import fromPairs from 'lodash/fromPairs';
import addDays from 'date-fns/add_days';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Collapsible from 'react-collapsible';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import colors from 'open-color/open-color.json';

import generateProjectCalendar from './generateProjectCalendar';
import Box from './components/Box';
import SmartArrow from './components/SmartArrow';
import Flex from './components/Flex';
import Button from './components/Button';
import { chain } from './utils';

BigCalendar.momentLocalizer(moment);

const parseRow = (data) => {
  const header = data.shift();
  return data.map((row) => {
    const parsed = fromPairs(row.map((value, index) => [header[index], value]));
    return {
      ...parsed,
      開始時間: new Date(parsed['開始時間']),
      結束時間: addDays(new Date(parsed['結束時間']), 1),
      title: `${parsed['專案名稱']} | ${parsed['任務名稱']} by ${parsed['任務負責人']}`
    };
  }).filter((d) => !d['隱藏']);
};

const availableColors = [
  'red',
  'violet',
  'blue',
  'green',
  'yellow',
];

const ToggleButton = (props) => (
  <Button
    bg="white"
    color="primary"
    hoverBg="primary"
    hoverColor="white"
    border="none"
    textAlign="left"
    {...props}
  />
);

const avaliableFilters = [
  {
    key: '任務負責人',
    name: 'person',
    panelText: '找誰',
  },
  {
    key: '專案名稱',
    name: 'project',
    panelText: '找專案',
  },
  {
    key: '任務類型',
    name: 'category',
    panelText: '找類型',
  },
];

class Calender extends PureComponent {
  static getDerivedStateFromProps({ data }) {
    const events = parseRow(data);
    return {
      events,
      optionsList: avaliableFilters.reduce((list, { key, name }) => ({
        ...list,
        [name]: chain(uniq, compact)(map(events, key)),
      }), {}),
    };
  }

  state = {
    isOpen: avaliableFilters.reduce((list, { name }, index) => ({
      ...list,
      [name]: index === 0,
    }), {}),
    selected: {
      // person: this.props.emailData[this.props.currentUser],
    },
  }

  buttonRefs = {}

  parseColor = (type, name) => {
    const items = this[type];
    let color = items.byName[name];
    if (color) return color; // 若有專案顏色，即返回

    const colorKey = availableColors[items.count % availableColors.length]; // 取得目前的號碼的顏色
    items.count += 1; // 設定為下一個號碼
    color = colors[colorKey][5]; // 已可用顏色的名字取得對應的opencolor
    items.byName[name] = color; // 設定專案顏色
    return color;
  }

  handleExport = () => {
    const { sheetApi } = this.props;
    const { events } = this.state;
    this.setState({ exporting: true });
    generateProjectCalendar(sheetApi, events.filter(this.projectFilter), this.state.selectedProject)
      .then((newSheet) => {
        this.setState({ exporting: false });
        console.log(newSheet);
      });
  }

  handleTriggerClick = (key) => () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: {
        ...isOpen,
        [key]: !isOpen[key],
      },
    })
  }

  handleButtonRef = (type, key) => (ref) => {
    set(this.buttonRefs, [type, key], ref);
  }

  cancleFocus = (type, key) => {
    const buttonRef = get(this.buttonRefs, [type, key]);
    buttonRef.blur();
  }

  setFilter = (type, value, active) => () => {
    const { selected } = this.state;
    this.setState({
      selected: {
        ...selected,
        [type]: active ? 'none' : value,
      },
    });
    if (active) this.cancleFocus(type, value);
  }

  getFilteredEvents = () => avaliableFilters.reduce((filtered, filter, index) => filtered.filter(this.applyFilter(index)), this.state.events)

  applyFilter = (index) => (event) => {
    const filter = avaliableFilters[index];
    const currentSelected = this.state.selected[filter.name];
    if (!currentSelected || currentSelected === 'none') return true;
    return event[filter.key] === currentSelected;
  }

  render() {
    const {
      // exporting,
      // events,
      isOpen,
      optionsList,
      selected,
    } = this.state;
    return (
      <Flex height="100%">
        <Box w="25%" mr="0.5em">
          {avaliableFilters.map((filter) => (
            <Collapsible
              key={filter.name}
              open={isOpen[filter.name]}
              trigger={<SmartArrow isOpen={isOpen[filter.name]}>--{filter.panelText}?--</SmartArrow>}
              handleTriggerClick={this.handleTriggerClick(filter.name)}
            >
              <Box>
                {optionsList[filter.name].map((item) => {
                  const active = selected[filter.name] === item;
                  return (
                    <ToggleButton
                      w={1}
                      key={item}
                      onClick={this.setFilter(filter.name, item, active)}
                      active={active}
                      innerRef={this.handleButtonRef(filter.name, item)}
                    >
                      {item}
                    </ToggleButton>
                  )
                })}
              </Box>
            </Collapsible>
          ))}
        </Box>
        <Box w="75%" height="100%" maxHeight="100vh" position="relative">
          <BigCalendar
            events={this.getFilteredEvents()}
            defaultDate={new Date()}
            startAccessor="開始時間"
            endAccessor="結束時間"
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: colors.gray[2],
                color: 'black',
                opacity: event['任務完成日'] ? 0.2 : 1,
              }
            })}
          />
        </Box>
      </Flex>
    );
  }
}

Calender.propTypes = {
  data: PropTypes.array,
};

export default Calender;
