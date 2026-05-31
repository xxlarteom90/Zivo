import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Available', path: '/orders/available', icon: <AssignmentIcon /> },
  { label: 'Active', path: '/orders/active', icon: <LocalShippingIcon /> },
  { label: 'Done', path: '/orders/delivered', icon: <CheckCircleIcon /> }
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = items.find((item) => item.path !== '/' && location.pathname.startsWith(item.path))?.path ?? '/';

  return (
    <Paper sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1200 }} elevation={8}>
      <BottomNavigation value={current} onChange={(_, value: string) => navigate(value)} showLabels>
        {items.map((item) => (
          <BottomNavigationAction key={item.path} value={item.path} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
