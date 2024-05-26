import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function AppView() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [approvedExpenses, setApprovedExpenses] = useState(0);
  const [rejectedExpenses, setRejectedExpenses] = useState(0);

  const fetchExpenseSummary = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch expense data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching expense summary:', error);
      return { totalExpenses: 0, approvedExpenses: 0, rejectedExpenses: 0 }; // Default values on error
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          totalExpenses: fetchedTotalExpenses,
          approvedExpenses: fetchedApprovedExpenses,
          rejectedExpenses: fetchedRejectedExpenses,
        } = await fetchExpenseSummary();

        setTotalExpenses(fetchedTotalExpenses);
        setApprovedExpenses(fetchedApprovedExpenses);
        setRejectedExpenses(fetchedRejectedExpenses);
      } catch (error) {
        console.log('Error setting expense data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="All Expense"
            total={totalExpenses}
            color="success"
            backgroundColor="#fffbd9"
            icon={<img src="/assets/requested.png" alt="Requested" height="56px" width="56px" />}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="Approved"
            total={approvedExpenses}
            color="info"
            backgroundColor="#e6fce6"
            icon={<img src="/assets/approved.png" alt="Approved" height="56px" width="56px" />}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="Pending"
            total={rejectedExpenses}
            color="warning"
            backgroundColor="#ffd3d9"
            icon={<img src="/assets/rejected.png" alt="Rejected" height="56px" width="56px" />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
