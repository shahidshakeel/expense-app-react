import { Helmet } from 'react-helmet-async';

import { ExpenseView } from 'src/sections/expenses/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Expenses | Expense App </title>
      </Helmet>

      <ExpenseView />
    </>
  );
}
