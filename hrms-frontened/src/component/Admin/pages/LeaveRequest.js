import React from "react";
import { useDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import { useEffect , useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Button } from "react-bootstrap";
  import Modal from 'react-bootstrap/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from "../../../utils/InputField";
import Swal from 'sweetalert2';
import SelectField from '../../../utils/SelectField';
import { Link } from 'react-router-dom';
// import Modal from "@material-ui/core/Modal";


const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  reason: Yup.string().required('Reason is required'),
  type: Yup.string().required('Type is required'),
  leave_day_type: Yup.string().required('Leave day type is required')
});

const LeaveRequest = () => {
  const dispatch = useDispatch();
  const [leaveData,setLeaveData] = useState([])
  const [update,setUpdate]=useState(false)
  
 
 
 
  

  const axiosInstance  =  useAxios();
  dispatch(navbarTitle({ navTitle: "Leaves" }));
 
  useEffect(()=>{
    axiosInstance.get(`all-leaves/?status=Pending`).then((res)=>{
      setLeaveData(res.data)
    })
},[update])
  const approveRequest = (id)=>{
    console.log("Leave Request is approved")
    Swal.fire({title: 'Confirm Approve',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.put(`update-leave-status/${id}/`,{"status":"Approved"}).then((res)=>{
            setUpdate(true)
            console.log("Leave request is applied successfuly...")  
           })} })  
  }
  const deleteRequest = (id)=>{
    console.log("Leave Request is deleted")
    Swal.fire({title: 'Confirm Delete',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
}).then((result) => {
  if (result.isConfirmed) {
    axiosInstance.put(`update-leave-status/${id}/`,{"status":"Rejected"}).then((res)=>{
    setUpdate(true)
      console.log("Leave request is applied successfuly...")  
     })} })  
    
  }
  return (
    <>
    <div style={{ marginLeft: "250px" }}>  
    <Link to="/admin/all-leave">
    <Button variant="primary">
          All Leaves
    </Button>
    </Link>  
    
      <table class="table">
        <thead>
          <tr>
            <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Leave Day Type</th>   
            <th scope="col">Reason</th>  
            <th scope="col">Action</th>      
          </tr>
        </thead>
        <tbody>
          
        {leaveData.map((leave,index)=>((
        <tr key = {index}>
        
          <th scope="row">{leave.employeeDetails[0]["first_name"]}</th>   
          <th scope="row">{leave.employeeDetails[0]["last_name"]}</th>    
          <td>{leave.status}</td>    
          <td>{leave.date}</td>
          <td>{leave.type}</td>
          <td>{leave.leave_day_type}</td>
          <td>{leave.reason}</td>
          <td><Button onClick={()=>{approveRequest(leave.id)}}>Accept</Button ><Button  onClick={()=>{deleteRequest(leave.id)}}>Rejected</Button></td>     
      </tr>
  )))}  
         
        </tbody>
      </table>
    </div>
    </>
  );
};

export default LeaveRequest;
