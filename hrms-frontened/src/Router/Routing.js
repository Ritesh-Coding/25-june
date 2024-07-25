import { BrowserRouter, Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import LoginUser from '../component/Auth/login';
import Logout from '../component/Auth/logout';
import ProtectedRoute from '../utils/ProtectedRoute';
import Employee from '../component/Admin/pages/Employee';
import ChangePassword from '../component/Auth/ChangePassword';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Register from '../component/Auth/Register';
import NotFound from '../utils/PageNotFound';
import ForgetPassword from '../component/Auth/ForgetPassword';
import Dashboard from '../component/User/pages/Dashboard';
import EditProfile from '../component/User/pages/EditProfile';
import Attendance from '../component/User/pages/Attendance';
import Leaves from '../component/User/pages/Leaves';
import Claims from '../component/User/pages/Claims';
import Hotline from '../component/User/pages/Hotline';
import CompanyPolicy from '../component/User/pages/CompanyPolicy';
import Committee from '../component/User/pages/Committee';
import Sensation from '../component/User/pages/Sensation';
import Profile from '../component/User/pages/Profile';
import React from 'react'
import UpdateLeave from '../component/User/pages/UpdateLeave';
import RootLayout from '../layouts/RootLayout';
import AdminRootLayout from '../layouts/AdminRootLayout';
import UpdateEmployee from '../component/Admin/pages/UpdateEmployee';
import AllLeaves from '../component/Admin/pages/AllLeaves';
import LeaveRequest from '../component/Admin/pages/LeaveRequest';
const router  = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>    
        <Route path="/attendance" element={<Attendance />} /> 
        <Route index element={<Dashboard />} />        
        <Route path="/logout" element={<Logout />} /> 
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/companyPolicy" element={<CompanyPolicy />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/sensation" element={<Sensation />} />
        <Route path="/hotline" element={<Hotline />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={< EditProfile/>} />
        <Route path="/update-leave" element={< UpdateLeave/>} />  
        <Route path="*" element={<NotFound/>} />           
      </Route>
      <Route path="/register" element={<Register/> }/>
      <Route path="/forgetPassword" element={<ForgetPassword/> }/>
      <Route path="/login" element={<LoginUser />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/admin"  element={<AdminRootLayout />}>
          <Route path="/admin/employee" element={<Employee />}/>
          <Route path="/admin/sensation" element={<Sensation />} />
          <Route path="/admin/committee" element={<Committee />} />
          <Route path="/admin/companyPolicy" element={<CompanyPolicy />} />
          <Route path="/admin/claims" element={<Claims />} />
          <Route path="/admin/leaves" element={<LeaveRequest />} />
          <Route path="/admin/attendance" element={<Employee />}/>       
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/profile/edit" element={< EditProfile/>} />
          <Route path="/admin/change-password" element={<ChangePassword />} />     
          <Route path="/admin/employee/edit/:userId" element={<UpdateEmployee/>} />    
          <Route path="/admin/all-leave" element={<AllLeaves/>} />   
          <Route path="/admin/logout" element={<Logout />} /> 
      </Route> 
      </> 
  )
)

const Routing = () => {
  return (
    <Provider store={store}>
    <RouterProvider router={router}>           
      
    </RouterProvider>
</Provider>
  )
}

export default Routing