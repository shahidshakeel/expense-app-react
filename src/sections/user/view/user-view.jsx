import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { applyFilter, getComparator } from 'src/utils/sortingUtils';

import {
  fetchEmployees,
  addEmployeeToDatabase,
  updateEmployeeInDatabase,
  deleteEmployeeFromDatabase,
  deleteMultipleEmployeesFromDatabase,
} from 'src/services/firebaseServices';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------

export default function UserPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [employees, setEmployees] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID of the employee being edited

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
  });

  const handleAddEmployee = () => {
    setEditingId(null);
    setFormData({ username: '', name: '', password: '' }); // Reset form
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModalSubmit = async () => {
    if (formData.username && formData.name && formData.password) {
      try {
        if (editingId) {
          await updateEmployeeInDatabase(editingId, {
            username: formData.username,
            name: formData.name,
            password: formData.password,
          });
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === editingId ? { ...emp, ...formData } : emp))
          );
          enqueueSnackbar('Employee updated successfully', { variant: 'success' });
        } else {
          const newEmployee = await addEmployeeToDatabase(formData);
          setEmployees((prev) => [...prev, { ...formData, id: newEmployee.id }]);
          enqueueSnackbar('Employee added successfully', { variant: 'success' });
        }
        handleCloseModal();
      } catch (error) {
        enqueueSnackbar('Failed to submit employee data', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please fill all the fields', { variant: 'warning' });
    }
  };

  const handleDelete = async (id) => {
    console.log('delete', id);
    try {
      await deleteEmployeeFromDatabase(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete employee', { variant: 'error' });
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length > 0) {
      try {
        await deleteMultipleEmployeesFromDatabase(selected);
        setEmployees((prev) => prev.filter((emp) => !selected.includes(emp.id)));
        setSelected([]);
        enqueueSnackbar('Selected employees deleted successfully', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Error deleting employees', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('No employees selected', { variant: 'warning' });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEmployees()
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employees.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, username) => {
    const selectedIndex = selected.indexOf(username);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, username);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: [...employees].sort(getComparator(order, orderBy)),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const filteredEmployees = applyFilter({ inputData: employees, filterName });

  const sortedEmployees = [...filteredEmployees].sort(getComparator(order, orderBy));

  const handleEdit = (id) => {
    const employee = sortedEmployees.find((emp) => emp.id === id);
    if (employee) {
      setFormData({
        username: employee.username,
        name: employee.name,
        password: employee.password,
      });
      setEditingId(id);
      setOpenModal(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(sortedEmployees)) {
    console.error('sortedEmployees is not an array:', sortedEmployees);
    return <div>Error: Data is corrupted.</div>;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">All Employees</Typography>

        <Button
          variant="contained"
          onClick={handleAddEmployee}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Add Employee
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={selected.length}
                numSelected={sortedEmployees.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'name', label: 'Name' },
                  { id: 'password', label: 'Password' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {sortedEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <UserTableRow
                      id={employee.id}
                      username={employee.username}
                      name={employee.name}
                      password={employee.password}
                      selected={selected.indexOf(employee.id) !== -1}
                      handleClick={(event) => handleClick(event, employee.id)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, employees.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{editingId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            name="password"
            label="Password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <Button onClick={handleModalSubmit} variant="contained" color="primary">
            {editingId ? 'Update' : 'Add'} Employee
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
