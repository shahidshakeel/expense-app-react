import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    alias: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'all employees',
    path: '/employees',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'expenses',
  //   path: '/approval',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'logout',
    action: 'logout',  // This is a custom action identifier
    icon: icon('ic_lock'),
  },
];

export default navConfig;
