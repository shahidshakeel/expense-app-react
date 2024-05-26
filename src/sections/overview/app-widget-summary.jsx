import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, icon, color = 'primary', backgroundColor, sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Avatar sx={{ backgroundColor: {backgroundColor}, height: '84px', width: '84px' }}>{icon}</Avatar>}

      <Stack spacing={0.5}>
      
        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
        <Typography fontSize='1.78rem'>${total}</Typography>
      </Stack>
    </Card>
  );
}


AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  backgroundColor: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  
};
