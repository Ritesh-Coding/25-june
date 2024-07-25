import React from "react";
import { useDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import { useEffect , useState } from "react";
import useAxios from "../../../hooks/useAxios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";

const AllLeaves = () => {
 
  const [leaveData,setLeaveData] = useState([])
  

  function myFunction() {
    let  startDate =  document.getElementById("startDate").value ;
    let  endDate = document.getElementById("endDate").value ;
    if (startDate && endDate){
        axiosInstance.get(`all-leaves?start_date=${startDate}&end_date=${endDate}`).then((res)=>{
        setLeaveData(res.data)})
        console.log(startDate,endDate)
    }    
  }
  const handleInputChange=()=>{
      const myStatus = document.getElementById("statusDropDown")
      const status = myStatus.value
      console.log("i am calling",myStatus.value)
      axiosInstance.get(`all-leaves?status=${status}`).then((res)=>{
      setLeaveData(res.data)})
  }
 
  const axiosInstance  =  useAxios();

 
  useEffect(()=>{
    axiosInstance.get(`all-leaves/`).then((res)=>{
      setLeaveData(res.data)
    })
},[])
  return (
    <>
    <div style={{ marginLeft: "250px" }}>  
    <div style={{float:`right`}}>
        <Button>
        <input type="date" id="startDate" onChange={myFunction}></input>
        </Button>
        <Button>
            <input type="date" id="endDate" onChange={myFunction}></input>
        </Button>
        
    </div>
    
    
      <select class="form-select form-select mb-3" aria-label=".form-select-lg example"
                 id="statusDropDown"  onChange={handleInputChange}>
                      <option selected value="">Select Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
      </select>      
     
      <table class="table">
        <thead>
          <tr>
          <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Leave Type</th>
            <th scope="col">Date</th>
            <th scope="col">Leave Day Type</th>
            <th scope="col">Status</th>            
          </tr>
        </thead>
        <tbody>
          
        {leaveData.map((leave,index)=>((
        <tr key = {index}>
          <th scope="row">{leave.employeeDetails[0]["first_name"]}</th>   
          <th scope="row">{leave.employeeDetails[0]["last_name"]}</th>    
          <th scope="row">{leave.type}</th>
          
          <td>{leave.date}</td>
          <td>{leave.leave_day_type}</td>
          <td>{leave.status}</td>    
      </tr>)))}          
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AllLeaves;
