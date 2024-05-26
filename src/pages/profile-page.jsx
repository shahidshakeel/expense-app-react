import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Button, Divider, Typography } from '@mui/material';

import accountData from 'src/_mock/account';

const ProfileWrapper = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff', // White background
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  width: '90%',
  margin: '20px auto',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  color: '#fff',
}));

export default function ProfilePage() {
  const account = accountData;

  return (
    <>
      <Helmet>
        <title>Profile - Expense App</title> {/* Set the page title */}
      </Helmet>
      <ProfileWrapper>
        <StyledAvatar src={account.photoURL} alt={account.displayName} />
        <Typography variant="h4" gutterBottom>
          Hello, {account.displayName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {account.email}
        </Typography>
        <Divider sx={{ width: '70%', my: 2 }} />
        <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 600, paddingBottom: 2 }}>
          To modify the user details displayed on the profile page, update the corresponding
          properties in the account object within the account.js file.
        </Typography>
        <Divider sx={{ width: '70%', my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <ActionButton
            component={Link}
            to="/"
            variant="contained"
            sx={{ backgroundColor: '#2A9D8F' }}
          >
            Expenses
          </ActionButton>
          <ActionButton
            component={Link}
            to="/employees"
            variant="contained"
            sx={{ backgroundColor: '#F4A261' }}
          >
            Employees
          </ActionButton>
          <ActionButton
            component={Link}
            to="/logout"
            variant="contained"
            sx={{ backgroundColor: '#E76F51' }}
          >
            Logout
          </ActionButton>
        </Box>
      </ProfileWrapper>
    </>
  );
}