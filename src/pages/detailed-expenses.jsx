import axios from 'axios';
import JsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import { getDaysInMonth } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import TablePagination from '@mui/material/TablePagination';
import {
  Box,
  Table,
  Paper,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { formatMonth } from 'src/utils/format-month';

const dayTypeSymbols = {
  'Working Day': 'WD',
  'Full Day Sickness': 'FDI',
  'Half Day Sickness': 'HDI',
  'Full Day Vacation': 'FDV',
  'Half Day Vacation': 'HDV',
};

const symbolDescriptions = Object.entries(dayTypeSymbols)
  .map(([key, value]) => `${value}: ${key}`)
  .join(`\n`); // Using newline character to separate entries

const DetailedExpenses = () => {
  const { userId, month } = useParams();
  const [data, setData] = useState({ expenses: [], isApproved: false });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { enqueueSnackbar } = useSnackbar();

  const handleApproveReject = async () => {
    const newStatus = !data.isApproved;
    // console.log(`Approve/Reject expenses for user ${userId} in month ${month}:`, newStatus);
    const endpoint = `http://localhost:3000/user/${userId}/${
      newStatus ? 'approve' : 'reject'
    }/${month}`;

    try {
      await axios.post(endpoint);
      setData({ ...data, isApproved: newStatus });
      enqueueSnackbar(`Expenses ${newStatus ? 'approved' : 'rejected'}.`, { variant: 'success' });
    } catch (error) {
      console.error('Error updating expense approval status:', error);
      enqueueSnackbar(`Failed to ${newStatus ? 'approve' : 'reject'} expenses.`, {
        variant: 'error',
      });
    }
  };
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i += 1) {
      // Explicitly disabling ESLint for the next line if necessary:
      // eslint-disable-next-line no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  const handleExport = () => {
    try {
      const userDetails = [
        ['Username', data.userName],
        ['Month', formatMonth(month)],
        ['Approved Status', data.isApproved ? 'Approved' : 'Not Approved'],
      ];

      const headers = [
        'Day',
        'Type',
        ...categoryTypes.map((type) => [
          type
            .split(' ')
            .map((t) => dayTypeSymbols[t] || t)
            .join(' '),
        ]),
        'Total',
      ];

      const dataToExport = rows.map((row) => [
        row.day,
        Object.keys(dayTypeSymbols).find((key) => dayTypeSymbols[key] === row.dayType) ||
          row.dayType, // Replace keys with full descriptions
        ...row.totals,
        row.grandTotal,
      ]);

      // Add column totals to the end of the data
      const columnTotalsRow = ['Totals', '', ...columnTotals, totalGrand];

      // Combining everything into one array of arrays
      const finalData = [...userDetails, [], headers, ...dataToExport, columnTotalsRow];

      const summaryDetails = [
        [],
        ['Summary'],
        ['Flat Rate:', flatRateTotal],
        ['General Expenses:', generalExpensesTotal],
        ['Vehicle Expenses:', vehicleTotal],
        ['Grand Total:', flatRateTotal + generalExpensesTotal + vehicleTotal],
      ];

      finalData.push(...summaryDetails);

      // Ensure that every element of finalData is an array
      if (finalData.some((item) => !Array.isArray(item))) {
        console.error(
          'Non-array item found in data to be exported:',
          finalData.find((item) => !Array.isArray(item))
        );
        enqueueSnackbar('Export Failed: Data format error', { variant: 'error' });
        return;
      }

      const ws = XLSX.utils.aoa_to_sheet(finalData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Detailed Expenses');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      saveAs(
        new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
        'detailed_expenses.xlsx'
      );

      enqueueSnackbar('Export Success', { variant: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      enqueueSnackbar('Export Failed', { variant: 'error' });
    }
  };

  const fetchImageAsBase64 = async (receiptId) => {
    if (!receiptId) return null;
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/dba2-25dbc.appspot.com/o/receipts%2F${encodeURIComponent(
      receiptId
    )}.jpg?alt=media&token=de489e2a-ceec-42d6-bffd-ab4db6dd5b7d`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleExportPDF = async () => {
    const { expenses, isApproved, userName } = data;
    const doc = new JsPDF();
    let y = 50;

    doc.text(`Username: ${userName}`, 10, y);
    y += 10;
    doc.text(`Month: ${formatMonth(month)}`, 10, y);
    y += 10;
    doc.text(`Approved Status: ${isApproved ? 'Approved' : 'Not Approved'}`, 10, y);
    y += 20;
    doc.text(`Flat Rate Total: ${flatRateTotal} $`, 10, y);
    y += 10;
    doc.text(`General Expenses Total: ${generalExpensesTotal} $`, 10, y);
    y += 10;
    doc.text(`Vehicle Expenses Total: ${vehicleTotal} $`, 10, y);
    y += 20;
    doc.text(`Grand Total: ${flatRateTotal + generalExpensesTotal + vehicleTotal} $`, 10, y);
    y += 20;
    doc.addPage();
    y = 10;

    const dayEntries = expenses.map(async (day) => {
      const lines = [`Day: ${day.id} - ${day.dayType || 'No specific type'}`];
      if (day.expenses && day.expenses.length > 0) {
        const expenseEntries = await Promise.all(
          day.expenses.map(async (expense) => {
            const text = `Expense: ${expense.category} ${expense.type} - $${expense.amount}`;
            let imageBase64 = null;
            if (expense.receipt) {
              imageBase64 = await fetchImageAsBase64(expense.receipt);
            }
            return { text, imageBase64 };
          })
        );

        expenseEntries.forEach(({ text, imageBase64 }) => {
          lines.push(text);
          if (imageBase64) {
            lines.push({ image: imageBase64, options: { width: 50, height: 50 } });
          }
        });
      } else {
        lines.push('No expenses this day');
      }

      return lines;
    });

    const pages = await Promise.all(dayEntries);
    pages.flat().forEach((line) => {
      if (typeof line === 'string') {
        doc.text(line, 10, y);
        y += 10;
      } else if (line.image) {
        const scaleFactor = 2;
        const scaleFactorHeight = 3;
        const newHeight = line.options.height * scaleFactorHeight;
        const newWidth = line.options.width * scaleFactor;
        doc.addImage(line.image, 'JPEG', 10, y, newWidth, newHeight);
        y += newHeight + 10; // Adjust vertical space after the image
        doc.addPage();
        y = 10; // Reset y position at the top of the new page
      }
    });

    doc.save('detailed_expenses.pdf');
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/${userId}/month/${month}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching detailed expenses:', error);
        setLoading(false);
      });
  }, [userId, month]);

  if (loading) return <div>Loading...</div>;

  const { expenses, isApproved } = data;
  const year = 20 + month.substring(2);
  const monthIndex = parseInt(month.substring(0, 2), 10) - 1;
  const daysCount = getDaysInMonth(new Date(year, monthIndex));

  // Creating a combined category and type map
  const categoryTypeSet = new Set();

  // Additional check before using forEach
  if (expenses && Array.isArray(expenses)) {
    expenses.forEach((day) => {
      // Check if 'day.expenses' is defined and is an array before iterating
      if (day.expenses && Array.isArray(day.expenses)) {
        day.expenses.forEach((expense) => {
          categoryTypeSet.add(`${expense.category} ${expense.type}`);
        });
      }
    });
  } else {
    console.log('Expenses data is not available or not in expected format');
  }
  const categoryTypes = Array.from(categoryTypeSet);

  const rows = Array.from({ length: daysCount }, (_, i) => ({
    day: i + 1,
    dayType: '',
    totals: Array(categoryTypes.length).fill(null),
    grandTotal: 0,
  }));

  // Ensure 'expenses' is an array before proceeding
  if (Array.isArray(expenses)) {
    expenses.forEach((day) => {
      // Safely access 'rows' with a valid index check
      const rowIndex = parseInt(day.id, 10) - 1;
      if (rowIndex >= 0 && rowIndex < rows.length) {
        const row = rows[rowIndex];

        if (row) {
          row.dayType = dayTypeSymbols[day.dayType] || day.dayType;

          // Ensure 'day.expenses' is an array before iterating
          if (Array.isArray(day.expenses)) {
            day.expenses.forEach((expense) => {
              const index = categoryTypes.indexOf(`${expense.category} ${expense.type}`);
              if (index !== -1) {
                row.totals[index] = (row.totals[index] || 0) + expense.amount;
                row.grandTotal += expense.amount;
              }
            });
          }
        }
      }
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  // Calculate specific category sums
  let flatRateTotal = 0;
  let generalExpensesTotal = 0;
  let vehicleTotal = 0;

  if (Array.isArray(expenses)) {
    expenses.forEach((day) => {
      if (Array.isArray(day.expenses)) {
        day.expenses.forEach((expense) => {
          if (expense.category === 'Flat Rate') {
            flatRateTotal += expense.amount;
          } else if (expense.category === 'Variable Expense' && expense.type !== 'Vehicle') {
            generalExpensesTotal += expense.amount;
          } else if (expense.category === 'Variable Expense' && expense.type === 'Vehicle') {
            vehicleTotal += expense.amount;
          }
        });
      }
    });
  } else {
    console.error('Expenses is not an array:', expenses);
  }

  // Calculate column totals
  const columnTotals = Array(categoryTypes.length).fill(0);
  const totalGrand = rows.reduce((sum, row) => {
    row.totals.forEach((total, index) => {
      if (total) {
        columnTotals[index] += total;
        sum += total;
      }
    });
    return sum;
  }, 0);

  return (
    <>
      <Helmet>
        <title>Expense Details - Expense App</title> {/* Set the page title */}
      </Helmet>
      <div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '16px',
            marginBottom: '26px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5">
              Detailed Expenses of {data.userName} for {formatMonth(month)}
            </Typography>
            <Tooltip
              title={
                <div>
                  {symbolDescriptions.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              }
              arrow
            >
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Button
              variant="text"
              onClick={handleApproveReject}
              sx={{
                color: 'white',
                backgroundColor: isApproved ? 'rgba(255, 69, 0, 0.8)' : 'rgba(0, 128, 0, 0.8)', // Adjusted colors for better visual appearance
                marginRight: '8px',
                padding: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                '&:hover': {
                  backgroundColor: isApproved ? 'rgba(255, 69, 0, 1.0)' : 'rgba(0, 128, 0, 1.0)', // Darker on hover
                },
              }}
            >
              {isApproved ? 'Reject' : 'Approve'}
            </Button>
            <Button
              variant="text"
              onClick={handleExport}
              sx={{
                color: 'white',
                padding: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                marginRight: '8px',
                backgroundColor: 'rgba(30, 144, 255, 0.9)', // Soft blue for export button
                '&:hover': {
                  backgroundColor: 'rgba(30, 144, 255, 1.2)', // Darker blue on hover
                },
              }}
            >
              Export Excel
            </Button>
            <Button
              variant="text"
              onClick={handleExportPDF}
              sx={{
                color: 'white',
                padding: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                backgroundColor: 'rgba(0, 128, 128, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 128, 128, 1.2)',
                },
              }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Type</TableCell>
                {categoryTypes.map((categoryType, index) => (
                  <TableCell key={index} align="right">
                    {categoryType}
                  </TableCell>
                ))}
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.dayType}</TableCell>
                  {row.totals.map((total, idx) => (
                    <TableCell key={idx} align="right">
                      {total !== null ? total : '-'}
                    </TableCell>
                  ))}
                  <TableCell align="right">{row.grandTotal}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={2} align="right">
                  Column Totals
                </TableCell>
                {columnTotals.map((total, idx) => (
                  <TableCell key={idx} align="right">
                    {total}
                  </TableCell>
                ))}
                <TableCell align="right">{totalGrand}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        <Box
          sx={{
            mt: 4,
            p: 2,
            border: '1px solid gray',
            borderRadius: '4px',
            align: 'right',
            position: 'absolute',
            right: 16,
            backgroundColor: 'rgba(173, 216, 230, 0.3)',
          }}
        >
          <Typography variant="h6">Summary</Typography>
          <Typography>Flat Rate: ${flatRateTotal}</Typography>
          <Typography>General Expenses: ${generalExpensesTotal}</Typography>
          <Typography>Vehicle Expenses: ${vehicleTotal}</Typography>
          <Typography>Total: ${flatRateTotal + generalExpensesTotal + vehicleTotal}</Typography>
        </Box>
      </div>
    </>
  );
};

export default DetailedExpenses;
