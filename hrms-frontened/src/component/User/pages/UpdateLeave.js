import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../utils/InputField';
import SelectField from '../../../utils/SelectField';
import Swal from 'sweetalert2';
import { TablePagination } from "@mui/material";

const UpdateLeave = () => {
  const [requestedLeave, setRequestedLeave] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance.get(`/leave?status=Pending`).then((res) => {
      setRequestedLeave(res.data);
    });
  }, []);

  const handleUpdate = (leave) => {
    setSelectedLeave(leave);
    setShowUpdateModal(true);
  };

  const handleDelete = (leave) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const handleUpdateSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axiosInstance.put(`/leave/${selectedLeave.id}/`, values);
      setShowUpdateModal(false);
      setRequestedLeave((prev) =>
        prev.map((leave) => (leave.id === selectedLeave.id ? { ...leave, ...values } : leave))
      );
      Swal.fire('Success!', 'Leave Request is Updated Successfully!', 'success');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.non_field_errors) {
        setErrors({ api: err.response.data.non_field_errors[0] });
      } else {
        setErrors({ api: 'An error occurred' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`/leave/${selectedLeave.id}/`);
      setShowDeleteModal(false);
      setRequestedLeave((prev) => prev.filter((leave) => leave.id !== selectedLeave.id));
    } catch (err) {
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    type: Yup.string().required('Type is required'),
    leave_day_type: Yup.string().required('Leave day type is required'),
    reason: Yup.string().required('Reason is required'),
  });

  const leaveChoices = [
    { value: 'PL', label: 'PL' },
    { value: 'SL', label: 'SL' },
    { value: 'CL', label: 'CL' },
  ];

  const leaveDayTypes = [
    { value: 'Full_Day', label: 'Full Day' },
    { value: 'First_Half', label: 'First Half' },
    { value: 'Last_Half', label: 'Last Half' },
  ];

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
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Leave Day Type</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {requestedLeave.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave) => (
            <tr key={leave.id}>
              <th scope="row">{leave.date}</th>
              <td>{leave.type}</td>
              <td>{leave.leave_day_type}</td>
              <td>
                <Button variant="primary" onClick={() => handleUpdate(leave)}>
                  Update
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(leave)}>
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
        count={requestedLeave.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <Formik
              initialValues={{
                date: selectedLeave.date,
                type: selectedLeave.type,
                leave_day_type: selectedLeave.leave_day_type,
                reason: selectedLeave.reason,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateSubmit}
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
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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

export default UpdateLeave;
