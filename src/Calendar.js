import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import set from 'lodash/set';
import get from 'lodash/get';
import compact from 'lodash/compact';

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

class Calender extends PureComponent {
  state = {
    projectList: chain(uniq, compact)(map(this.props.events, '專案名稱')),
    personList: chain(uniq, compact)(map(this.props.events, '任務負責人')),
    personIsOpen: true,
  }

  projects = {
    byName: {},
    count: 0
  }

  persons = {
    byName: {},
    count: 0
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

  parseProjectColor = (projectName) => this.parseColor('projects', projectName)

  handleExport = () => {
    const { events, sheetApi } = this.props;
    this.setState({ exporting: true });
    generateProjectCalendar(sheetApi, events.filter(this.projectFilter), this.state.selectedProject)
      .then((newSheet) => {
        this.setState({ exporting: false });
        console.log(newSheet);
      });
  }

  handleTriggerClick = (key) => () => this.setState({ [key]: !this.state[key] })

  handleButtonRef = (type, key) => (ref) => {
    set(this.buttonRefs, [type, key], ref);
  }

  cancleFocus = (type, key) => {
    const buttonRef = get(this.buttonRefs, [type, key]);
    buttonRef.blur();
  }

  setPerson = (person, active) => () => {
    this.setState({
      selectedPerson: active ? '' : person,
    });
    if (active) this.cancleFocus('person', person);
   }

  setProject = (project, active) => () => {
    this.setState({
      selectedProject: active? '' : project,
    });
    if (active) this.cancleFocus('project', project);
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
      selectedProject,
      selectedPerson,
      exporting,
      personIsOpen,
      projectIsOpen
    } = this.state;
    return (
      <Flex>
        <Box w="25%" mr="0.5em">
          <Collapsible
            open={personIsOpen}
            trigger={<SmartArrow isOpen={personIsOpen}>--找誰?--</SmartArrow>}
            handleTriggerClick={this.handleTriggerClick('personIsOpen')}
          >
            <Box>
              {personList.map((person) => {
                const active = selectedPerson === person;
                return (
                  <ToggleButton
                    w={1}
                    key={person}
                    onClick={this.setPerson(person, active)}
                    active={active}
                    innerRef={this.handleButtonRef('person', person)}
                  >
                    {person}
                  </ToggleButton>
                )
              })}
            </Box>
          </Collapsible>
          <Collapsible
            open={projectIsOpen}
            trigger={<SmartArrow isOpen={projectIsOpen}>--找專案?--</SmartArrow>}
            handleTriggerClick={this.handleTriggerClick('projectIsOpen')}
          >
            <Box>
              {projectList.map((project) => {
                const active = selectedProject === project;
                return (
                <ToggleButton
                  w={1}
                  key={project}
                  onClick={this.setProject(project, active)}
                  active={active}
                  innerRef={this.handleButtonRef('project', project)}
                >
                  {project}
                </ToggleButton>
                )
              })}
            </Box>
          </Collapsible>
        </Box>
        {/* <Box my="2em">
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
        </Box> */}
        {!process.env.NODE_ENV === 'production' && selectedProject && selectedProject !== 'none' && (
          <Box my="2em">
            <Button disabled={exporting} onClick={this.handleExport}>匯出專案</Button>
          </Box>
        )}
        <Box w="75%" pt="66%" position="relative">
          <Box position="absolute" top="0" right="0" bottom="0" left="0">
            <BigCalendar
              events={events.filter(this.projectFilter).filter(this.personFilter)}
              defaultDate={new Date()}
              titleAccessor={(event) => `${event['專案名稱']} | ${event['任務名稱']} by ${event['任務負責人']}`}
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
        </Box>
      </Flex>
    );
  }
}

Calender.propTypes = {
  events: PropTypes.array,
};

export default Calender;
