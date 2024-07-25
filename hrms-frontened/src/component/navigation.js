import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/authReducer';


export function Navigation() {
    const { isAuthenticated, role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear()
        navigate('/login');
    };
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand as={Link} to="/">JWT Authentication</Navbar.Brand>
                <Nav className="me-auto">
                    {isAuthenticated && (
                        <>                          
                            {role === 'admin' && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
                            {role === 'user' && <Nav.Link as={Link} to="/user">User</Nav.Link>}
                        </>
                    )}
                </Nav>
                <Nav>
                    {isAuthenticated ? (
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    ) : (
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    )}
                </Nav>
            </Navbar>
        </div>
    );
}
