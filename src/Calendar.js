import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import colors from 'open-color/open-color.json';

import Box from './components/Box';

BigCalendar.momentLocalizer(moment);

const availableColors = [
  'red',
  'violet',
  'blue',
  'green',
  'yellow',
];

class Calender extends PureComponent {
  state = {
    projectList: uniq(map(this.props.events, '專案名稱')),
    personList: uniq(map(this.props.events, '任務負責人')),
  }

  projects = {
    byName: {},
    count: 0
  }

  persons = {
    byName: {},
    count: 0
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

  parseProjectColor = (projectName) => this.parseColor('projects', projectName)

  handleProjectChange = (evt) => {
    this.setState({ selectedProject: evt.target.value })
  }

  handlePersonChange = (evt) => {
    this.setState({ selectedPerson: evt.target.value })
  }

  projectFilter = (event) => {
    const { selectedProject } = this.state;
    if (!selectedProject || selectedProject === 'none') return true;
    return event['專案名稱'] === selectedProject;
  }

  personFilter = (event) => {
    const { selectedPerson } = this.state;
    if (!selectedPerson || selectedPerson === 'none') return true;
    return event['任務負責人'] === selectedPerson;
  }

  render() {
    const { events } = this.props;
    const {
      projectList,
      personList,
    } = this.state;
    return (
      <div>
        <select onChange={this.handleProjectChange}>
          <option value="none">--篩選專案--</option>
          {projectList.map((project) => (
            <option key={project}>{project}</option>
          ))}
        </select>
        <select onChange={this.handlePersonChange}>
          <option value="none">--篩選人員--</option>
          {personList.map((person) => (
            <option key={person}>{person}</option>
          ))}
        </select>
        <Box pt="66%" position="relative">
          <Box position="absolute" top="0" right="0" bottom="0" left="0">
            <BigCalendar
              events={events.filter(this.projectFilter).filter(this.personFilter)}
              defaultDate={new Date()}
              titleAccessor={(event) => `${event['專案名稱']} | ${event['任務名稱']} by ${event['任務負責人']}`}
              startAccessor="開始時間"
              endAccessor="結束時間"
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: this.parseProjectColor(event['專案名稱']),
                  opacity: event['任務完成日'] ? 0.2 : 1,
                }
              })}
            />
          </Box>
        </Box>
      </div>
    );
  }
}

Calender.propTypes = {
  events: PropTypes.array,
};

export default Calender;
