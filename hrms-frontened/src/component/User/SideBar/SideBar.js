import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { SidebarData } from './SideBarData';
import logo from "../../../assets/hrms.png"
import { IconContext } from 'react-icons/lib';
import SubMenu from './SubMenu';
import { useDispatch, useSelector } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
import "./SideBar.css";

const Nav = styled.div`
  background: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #112F4B;
  width: 250px; 
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const { firstName } = useSelector(state => state.auth);

  
  const {navTitle} = useSelector(state => state.auth);

  return (
    <>
      <IconContext.Provider value={{ color: '#FFFFFF' }}>
        <header>
          <Nav>
            <div className="navbar">
            <h1>{navTitle}</h1>
              <Link to="#home">News</Link>
              <Link to="#news">Calender</Link>
              <div className="dropdown">
                <button className="dropbtn">{firstName}
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/change-password">Change Password</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              </div>
            </div> 
          </Nav>
        </header>
       
        <SidebarNav>
          <SidebarWrap>
            <NavIcon to='#'>
              <img src={logo} alt="Logo" width={60}/>
              <h3 style={{color:"#FFFFFF"}}>eSparkBiz</h3>
            </NavIcon>
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
        </SidebarNav> 
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
