/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <SnackbarProvider maxSnack={3}>

    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
    </SnackbarProvider>

  );
}
