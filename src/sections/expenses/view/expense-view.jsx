import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Card,
  Stack,
  Table,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { sortExpenses, getComparator, applyExpenseFilter } from 'src/utils/sortingUtils';

import { fetchExpenses } from 'src/services/firebaseServices';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ExpenseTableRow from '../expense-table-row';
import ExpenseTableHead from '../expense-table-head';
import ExpenseTableToolbar from '../expense-table-toolbar';

export default function ExpensePage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchExpenses()
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(`Failed to load expenses.`, { variant: 'error' });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = expenses.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleViewDetails = (username) => {
  
    navigate(`/expenses/${username}`);  // Redirect to the user's expense page
  };
  

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, expenses.length - page * rowsPerPage);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40vh', // This takes the full height of the viewport
        fontSize: '24px', 
        color: '#666'    
      }}>
        Loading...
      </div>
    );
  }
  

  const filteredEmployees = applyExpenseFilter({ inputData: expenses, filterName });

  const sortedExpenses = sortExpenses(filteredEmployees, getComparator(order, orderBy));

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        {/* <Typography variant="h4">All Expenses</Typography> */}
      </Stack>

      <Card>
        <ExpenseTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ExpenseTableHead
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={sortedExpenses.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'month', label: 'Month' },
                  { id: 'status', label: 'Status' },
                  { id: 'actions', label: 'Actions', alignRight: true },
                ]}
              />
              <TableBody>
                {sortedExpenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ExpenseTableRow
                      key={row.id}
                      username={row.username}
                      month={row.month}
                      isApproved={row.approved}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleViewDetails={() => handleViewDetails(row.id)}
                    />
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
                {expenses.length === 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
