import React from 'react'
import { useDispatch } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
const Sensation = () => {
  const dispatch = useDispatch();
  dispatch( navbarTitle({navTitle: "Sensation"}));
  return (
    <div>Sensation</div>
  )
}

export default Sensation