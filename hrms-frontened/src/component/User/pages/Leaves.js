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
import { Pagination } from "../../../hooks/usePaginationRange";
import { current } from "@reduxjs/toolkit";
// import Modal from "@material-ui/core/Modal";


const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  reason: Yup.string().required('Reason is required'),
  type: Yup.string().required('Type is required'),
  leave_day_type: Yup.string().required('Leave day type is required')
});

const Leaves = () => {
  const dispatch = useDispatch();
  const [leaveData, setLeaveData] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 1;
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  function myFunction() {
    let  startDate =  document.getElementById("startDate").value ;
    let  endDate = document.getElementById("endDate").value ;
    if (startDate && endDate){
        axiosInstance.get(`leave?start_date=${startDate}&end_date=${endDate}`).then((res)=>{
          setLeaveData(res.data["results"]);
        })
        console.log(startDate,endDate)
    }    
  }   
 const handlePageChange = (page)=>{
  setCurrentPage(page)
 }

  
  const handleInputChange=()=>{
      const myStatus = document.getElementById("statusDropDown")
      const status = myStatus.value
      console.log("i am calling",myStatus.value)
      axiosInstance.get(`leave?status=${status}`).then((res)=>{
      setLeaveData(res.data["results"]);
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
    })
      
  }
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { date, type, leave_day_type, reason } = values;
    try {
      const result = await axiosInstance.post('leave/', { date, type, leave_day_type, reason });
      const data = result.data;
      Swal.fire ('Success!', 'Leave Request is Applied SuccessFully!', 'success') 
      // const newLeave = result.data;
      // setLeaveData(prevLeaveData => [newLeave, ...prevLeaveData])
      handleClose()
    } catch (err) {
      console.error("this is error i got ", err);
      if (err.response && err.response.data && err.response.data.non_field_errors) {
        setErrors({ api: err.response.data.non_field_errors[0] });
      } else {
        setErrors({ api: 'An error occurred.' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  const leaveChoices = [
    { value: 'PL', label: 'PL' },
    { value: 'SL', label: 'SL' },
    { value: 'CL', label: 'CL' },
    { value: 'UL', label: 'UL' }
  ];

  const leaveDayTypes = [
    { value: 'Full_Day', label: 'Full Day' },
    { value: 'First_Half', label: 'First Half' },
    { value: 'Last_Half', label: 'Last Half' }
  ];

  const axiosInstance  =  useAxios();
  dispatch(navbarTitle({ navTitle: "Leaves" }));
 function fetchLeaveData(page){
  axiosInstance.get(`leave/`,{
    params :{
      page,
    }
  }).then((res)=>{
    console.log("these is my result",res.data)
    setLeaveData(res.data["results"]);
    setTotalPages(Math.ceil(res.data.count / rowsPerPage));
  })
 }
  
 
useEffect(()=>{
    fetchLeaveData(currentPage)
},[currentPage])
console.log("This is my all leave Data ",leaveData)
  return (
    <>
    <div style={{ marginLeft: "250px" }}>  
    {/* <div style={{display:`flex`,float:`right`,alignItems:`center`}}>
    Total Approved Leaves  : <button type="button" class="btn btn-info">{leaveData.length>0 ? leaveData[0].total_approved_leaves : '-'}</button>
    Remaining Leaves : CL<button type="button" class="btn btn-info">{leaveData.length>0 ? leaveData[0]["remaining_all_leaves"][0].remaining_casual_leave : '-'}</button> 
    PL<button type="button" class="btn btn-info">{leaveData.length>0 ? leaveData[0]["remaining_all_leaves"][0].remaining_paid_leave : '-'}</button>
     SL<button type="button" class="btn btn-info">{leaveData.length>0 ? leaveData[0]["remaining_all_leaves"][0].remaining_sick_leave : '-'}</button>
      UL<button type="button" class="btn btn-info">{leaveData.length>0 ? leaveData[0]["remaining_all_leaves"][0].remaining_unpaid_leave : '-'}</button> 
    </div>
    <br></br>
    <br></br>     */}
   
     <Button variant="primary" onClick={handleShow}>
        Request Leave
  </Button> 
  <Link to="/update-leave"> 
      <Button variant="primary">
        Update Requested Leave
      </Button>
    </Link>
    <div style={{float:`right`}}>
    <Button>
        <input type="date" id="startDate" onChange={myFunction}></input>
    </Button>
    <Button>
    <input type="date" id="endDate" onChange={myFunction}></input>
    </Button> 

    </div>    
      <select className="form-select form-select mb-3" aria-label=".form-select-lg example"
                 id="statusDropDown"  onChange={handleInputChange}>
                      <option selected value="">Select Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
      </select>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Apply Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ date: '', type: '', leave_day_type: '', reason: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
              <Form>
              
                {errors.api && <p className="text-danger">{errors.api}</p>}
                <InputField
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Date"
                  isInvalid={touched.date && !!errors.date}
                  error={errors.date}
                />
                <SelectField
                  label="Leave Type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={leaveChoices}
                  isInvalid={touched.type && !!errors.type}
                  error={errors.type}
                />
                <SelectField
                  label="Leave Day Type"
                  name="leave_day_type"
                  value={values.leave_day_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={leaveDayTypes}
                  isInvalid={touched.leave_day_type && !!errors.leave_day_type}
                  error={errors.leave_day_type}
                />
                <InputField
                  label="Reason"
                  type="text"
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Reason"
                  isInvalid={touched.reason && !!errors.reason}
                  error={errors.reason}
                />
                <Button variant="primary" type="submit" disabled={isSubmitting} >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
     
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Leave Day Type</th>
          </tr>
        </thead>
        <tbody>
          {leaveData.length > 0 ? (
            leaveData.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.date}</td>
                <td>{leave.type}</td>
                <td>{leave.status}</td>
                <td>{leave.reason}</td>
                <td>{leave.leave_day_type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No leave data available</td>
            </tr>
          )} 
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div> 
    </>
  );
};

export default Leaves;
