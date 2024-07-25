import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../utils/InputField';
import SelectField from '../../../utils/SelectField';
import Swal from 'sweetalert2';
import { TablePagination } from "@mui/material";
import { Link } from 'react-router-dom';
const Updateemployee = () => {
  const [employee, setEmployee] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedemployee, setSelectedemployee] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance.get(`api/employees/`).then((res) => {
      setEmployee(res.data);
    });
  }, []);

  const handleUpdate = (employee) => {
    setSelectedemployee(employee);    
  };

  const handleDelete = (employee) => { 
    setSelectedemployee(employee);
    setShowDeleteModal(true);
  };

 

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`api/employees/${selectedemployee.id}/`);
      setShowDeleteModal(false);
      setEmployee((prev) => prev.filter((employee) => employee.id !== selectedemployee.id));
    } catch (err) {
      console.error(err);
    }
  };

  

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ marginLeft: '260px' }}>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">UserName</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {employee.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
            <tr key={employee.id}>
              <th scope="row">{employee.id}</th>
              <td>{employee.username}</td>
              <td>{employee.first_name}</td>
              <td>{employee.email}</td>
              <td>
              {<Link to={`/admin/employee/edit/${employee.id}`}>
                <Button>Update Employee Details</Button>
              </Link>}
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(employee)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={employee.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />    
 <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this leave?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
      
   
  );
};

export default Updateemployee;
