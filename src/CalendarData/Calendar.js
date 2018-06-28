import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import set from 'lodash/set';
import get from 'lodash/get';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import isDate from 'date-fns/is_date';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import { withContentRect } from 'react-measure';
import { Scrollbars } from 'react-custom-scrollbars';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Collapsible from 'react-collapsible';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import colors from 'open-color/open-color.json';

import generateProjectCalendar from './generateProjectCalendar';
import EventModal from './EventModal';
import Box from '../components/Box';
import SmartArrow from '../components/SmartArrow';
import Flex from '../components/Flex';
import Button from '../components/Button';
import Text from '../components/Text';
import { chain } from '../utils';

BigCalendar.momentLocalizer(moment);

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
  static getDerivedStateFromProps({ events }) {
    return {
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
    events: this.props.events, // 把events複製進來
  }

  componentDidMount() {
    this.props.measure();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 在props或state更新之前檢查projectSummary是否有更新
    if (this.state.projectSummary !== prevState.projectSummary) {
      // 如果為true，更動events
      if (this.state.projectSummary) return this.getProjectSummaries();
      // 如果為false，返回全部的events
      return this.props.events;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // getSnapshotBeforeUpdate的return結果會傳到snapshot，此時的snapshot即是events
    if (snapshot !== null) {
      this.setState({ events: snapshot });
    }
  }

  buttonRefs = {}

  getProjectSummaries = () => {
    const { events } = this.props;
    const validateEvents = events.filter((event) => isDate(event['開始時間']) && isDate(event['結束時間']) && event['專案名稱']); // 只留下有日期且有專案名稱的events
    const groupedByProject = groupBy(validateEvents, '專案名稱');
    // groupedByProject是一個大物件，以各專案名稱為key，其value為該專案名的的event陣列
    console.log(groupedByProject);
    const summariesdProjects = mapValues(groupedByProject, (projectEvents, projectName) => (
      {
        title: projectName,
        專案名稱: projectName,
        開始時間: minBy(projectEvents, '開始時間')['開始時間'],
        結束時間: maxBy(projectEvents, '結束時間')['結束時間'],
      }
    ));
    // minBy或maxBy會取得的是陣列中最小的或最大的那個值，此時我們的陣列是events的陣列，所以minBy或maxBy找到的結果會是一個event
    // 所以才需要event['開始時間']或event['結束時間']
    console.log(summariesdProjects);
    return map(summariesdProjects); // 返回陣列
  }

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
    const { sheetApi, events } = this.props;
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

  setModal = (event) => this.setState({ modalData: event })

  clearModal = () => this.setState({ modalData: null })

  handleSummaryChange = () => this.setState({ projectSummary: !this.state.projectSummary }) // 切換projectSummary的是否

  render() {
    const {
      // exporting,
      // events,
      isOpen,
      optionsList,
      selected,
      modalData,
      projectSummary,
    } = this.state;
    const {
      measureRef,
      contentRect,
    } = this.props;
    return (
      <Flex height="100%" innerRef={measureRef}>
        <Box w="25%" mr="0.5em">
          <Scrollbars style={{ height: contentRect.bounds.height }}>
            <Box pb="1em">
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
            <Flex p="0.5em" align="center" is="label">
              <Toggle
                defaultChecked={projectSummary}
                onChange={this.handleSummaryChange}
              />
              <Text pl="0.5em">僅顯示專案起訖</Text>
            </Flex>
          </Scrollbars>
        </Box>
        <Box w="75%" height="100%" position="relative">
          <BigCalendar
            events={this.getFilteredEvents()}
            defaultDate={new Date()}
            startAccessor="開始時間"
            endAccessor="結束時間"
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: colors.gray[2],
                color: 'black',
              }
            })}
            popup
            onSelectEvent={(event) => this.setModal(event)}
            selectable="ignoreEvents"
            views={['month']}
          />
        </Box>
        {modalData && (
          <EventModal
            data={modalData}
            onRequestClose={this.clearModal}
          />
        )}
      </Flex>
    );
  }
}

Calender.propTypes = {
  events: PropTypes.array,
};

export default withContentRect('bounds')(Calender);