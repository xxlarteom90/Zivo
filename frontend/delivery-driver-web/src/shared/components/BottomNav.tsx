import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../features/i18n/useTranslation';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    { label: t('nav.home'), path: '/', icon: <HomeIcon /> },
    { label: t('nav.active'), path: '/orders/active', icon: <LocalShippingIcon /> },
    { label: t('nav.finances'), path: '/finances', icon: <AccountBalanceWalletOutlinedIcon /> },
    { label: t('nav.statistics'), path: '/statistics', icon: <ShowChartIcon /> },
    { label: t('nav.profile'), path: '/profile', icon: <PersonOutlineIcon /> },
    { label: t('nav.menu'), path: '/settings', icon: <MenuIcon /> }
  ];

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
