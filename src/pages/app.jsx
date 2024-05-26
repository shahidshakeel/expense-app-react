import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';
import { ExpenseView } from 'src/sections/expenses/view';


// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Expense App </title>
      </Helmet>

      <AppView />
      <ExpenseView />
    </>
  );
}
