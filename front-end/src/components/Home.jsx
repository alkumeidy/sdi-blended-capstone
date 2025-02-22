/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */

import { useSome } from '../utilities/MainContextProvider';

import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import { BsBarChartLine, BsFillArrowRightCircleFill } from 'react-icons/bs';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useFetch from '../utilities/useFetch';
import Metrics from './Metrics';
// eslint-disable-next-line import/order
import '../style/home.css';

// eslint-disable-next-line import/order

export default function Sidebar() {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const yearList = [2022, 2023, 2024];

  const [show, setShow] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    monthNames[new Date().getMonth()],
  );
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { currentUser } = useSome();
  // const {
  //   data: users,
  //   isLoading: isLoadingUsers,
  //   isError: isErrorUsers,
  // } = useFetch('users');

  // this is grabbing the currently logged in users tasks assigned to them.
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isErrorTasks,
  } = useFetch(`user_tasks/${currentUser.id}`);

  const filteredTasks = tasks?.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getMonth() === monthNames.indexOf(currentMonth) &&
      taskDate.getFullYear() === currentYear
    );
  });

  const completedTasks = filteredTasks
    ? filteredTasks.filter(
        (task) =>
          filteredTasks.completed === true &&
          new Date(task.dueDate) > new Date(task.updatedAt),
      )
    : 0;
  const completedLateTasks = filteredTasks
    ? filteredTasks.filter(
        (task) =>
          task.completed === true &&
          new Date(task.dueDate) < new Date(task.updatedAt),
      )
    : 0;
  const overdueTasks = filteredTasks
    ? filteredTasks.filter(
        (task) =>
          task.completed === false &&
          new Date(task.dueDate) < new Date(task.updatedAt),
      )
    : 0;

  const pendingTasks = filteredTasks
    ? filteredTasks.filter(
        (task) =>
          task.completed === false &&
          new Date(task.dueDate) > new Date(task.updatedAt),
      )
    : 0;

  function renderTasks(subTasks) {
    return (
      <div className='tab-pane active' id='total' role='tabpanel'>
        <div className='divide-y divide-slate-700 tw-h-[912px] tw-overflow-auto tw-rounded-xl tw-border tw-p-2'>
          {subTasks.map((task) => (
            <>
              <div className='card text-center tw-bg-gray-200 tw-text-black '>
                <div className='card-header'>{task.title}</div>
                <div className='card-body'>
                  <p className='card-text'>{task.description}</p>
                </div>
                <div className='card-footer tw-text-black'>
                  Due: {task.dueDate.split('T')[0]}
                </div>
              </div>
              <br />
            </>
          ))}
        </div>
      </div>
    );
  }

  if (isLoadingTasks) return 'Loading...';
  if (isErrorTasks) return `An error has occurred: ${isErrorTasks.message}`;

  const metricsContainer = (
    <div className='col-3 tw-ml-[10vw] tw-w-fit'>
      <Card className='card-box m-3 tw-rounded-2xl'>
        <div className='divide-y divide-slate-700 tw-h-[77vh] tw-w-[25vw]'>
          <Card.Body>
            <Metrics />
          </Card.Body>
        </div>
      </Card>
    </div>
  );

  return (
    <div className='tw-flex tw-h-[100vh] tw-grow tw-overflow-auto'>
      <div className='tw-flex tw-w-screen'>
        <div className='tw-ml-[10vw] tw-h-[77vh]'>
          <Card className='card-box m-3 tw-rounded-2xl'>
            <Card.Body>
              <Tabs>
                <TabList>
                  <Tab>All Tasks</Tab>
                  <Tab>Completed</Tab>
                  <Tab>Completed Late</Tab>
                  <Tab>Overdue</Tab>
                  <Tab>Pending</Tab>
                  <Tab disabled='true'>
                    <SplitButton
                      key='primary'
                      id='dropdown-split-variants-Primary'
                      variant='primary'
                      title={currentMonth}
                    >
                      {monthNames.map((month, index) => (
                        <Dropdown.Item
                          eventKey={index + 1}
                          onClick={(e) => setCurrentMonth(e.target.innerText)}
                        >
                          {month}
                        </Dropdown.Item>
                      ))}
                    </SplitButton>
                  </Tab>
                  <Tab pullRight='true' disabled='true'>
                    <SplitButton
                      key='primary'
                      id='dropdown-split-variants-Primary'
                      variant='primary'
                      title={currentYear}
                    >
                      {yearList.map((year, index) => (
                        <Dropdown.Item
                          eventKey={index + 1}
                          onClick={(e) => setCurrentYear(e.target.innerText)}
                        >
                          {year}
                        </Dropdown.Item>
                      ))}
                    </SplitButton>
                  </Tab>
                  <Tab disabled='true'>
                    <Button
                      variant='primary'
                      onClick={() => setShow((currentShow) => !currentShow)}
                      style={{ display: 'flex' }}
                    >
                      <BsBarChartLine style={{ marginRight: '5px' }} />
                      Metrics
                      <BsFillArrowRightCircleFill
                        style={{ marginLeft: '5px' }}
                      />
                    </Button>
                  </Tab>
                </TabList>

                <TabPanel>{renderTasks(filteredTasks)};</TabPanel>
                <TabPanel>{renderTasks(completedTasks)};</TabPanel>
                <TabPanel>{renderTasks(completedLateTasks)};</TabPanel>
                <TabPanel>{renderTasks(overdueTasks)};</TabPanel>
                <TabPanel>{renderTasks(pendingTasks)};</TabPanel>
              </Tabs>
            </Card.Body>
          </Card>
        </div>

        {show ? metricsContainer : null}
      </div>
    </div>
  );
}
