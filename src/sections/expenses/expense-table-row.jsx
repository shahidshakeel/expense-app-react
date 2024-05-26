import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { red, blue, green } from '@mui/material/colors';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { formatMonth } from 'src/utils/format-month';

// ----------------------------------------------------------------------

export default function ExpenseTableRow({
  selected,
  month,
  isApproved,
  username,
  handleViewDetails,
  handleClick,
}) {
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" align="left">
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
        </TableCell>

        <TableCell>{formatMonth(month)}</TableCell>

        <TableCell>
          {isApproved ? (
            <CheckCircleOutlineIcon style={{ color: green[500] }} />
          ) : (
            <HighlightOffIcon style={{ color: red[500] }} />
          )}
        </TableCell>
        <TableCell>
          <Button
            onClick={() => handleViewDetails(username, month)}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: `${blue[500]}B3`, // Approximately 70% opacity
              color: '#fff',
              '&:hover': {
                backgroundColor: `${blue[700]}CC`, // Darker on hover with the 80% opacity
              },
            }}
          >
            View
          </Button>
        </TableCell>
      </TableRow>

      {}
    </>
  );
}

ExpenseTableRow.propTypes = {
  username: PropTypes.string,
  month: PropTypes.string,
  isApproved: PropTypes.bool,
  selected: PropTypes.bool,
  handleViewDetails: PropTypes.func,
  handleClick: PropTypes.func,
};
