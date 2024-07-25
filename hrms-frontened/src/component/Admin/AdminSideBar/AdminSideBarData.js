import React from 'react';
import * as FaIcons from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { MdOutlinePolicy } from "react-icons/md";

export const AdminSidebarData = [
  
  {
    title: 'Employee',
    path: '/admin/employee',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,    
  },  
  {
    title: 'Attendance',
    path: '/admin/attendance',
    icon: <FaIcons.FaRegClock />
  },
  {
    title: 'Leaves',
    path: '/admin/leaves',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Expense Claims',
    path: '/admin/claims',
    icon: <FaIcons.FaCalculator />
  },
  {
    title: 'Company Policy',
    path: '/admin/companyPolicy',
    icon: <MdOutlinePolicy />,
  
  },
  {
    title: 'Committee',
    path: '/admin/committee',
    icon: <FaIcons.FaNoteSticky />
  },
  {
    title: 'Sensation',
    path: '/admin/sensation',
    icon: <FaIcons.FaNoteSticky />
  }
];