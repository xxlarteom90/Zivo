import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { selectCurrentUser, selectIsDispatcher } from '../../features/auth/authSelectors';
import { useTranslation } from '../../features/i18n/useTranslation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BottomNav } from './BottomNav';

const drawerWidth = 280;

function useNavItems() {
  const { t } = useTranslation();
  const isDispatcher = useAppSelector(selectIsDispatcher);
  const items = [
    { label: t('nav.dashboard'), path: '/', icon: <HomeIcon /> },
    { label: t('nav.available'), path: '/orders/available', icon: <AssignmentIcon /> },
    { label: t('nav.active'), path: '/orders/active', icon: <LocalShippingIcon /> },
    { label: t('nav.delivered'), path: '/orders/delivered', icon: <CheckCircleIcon /> },
    { label: t('nav.finances'), path: '/finances', icon: <AccountBalanceWalletOutlinedIcon /> },
    { label: t('nav.statistics'), path: '/statistics', icon: <ShowChartIcon /> },
    { label: t('nav.performance'), path: '/performance', icon: <ShowChartIcon /> },
    { label: t('nav.referrals'), path: '/referrals', icon: <EmojiEventsOutlinedIcon /> },
    { label: t('nav.messages'), path: '/messages', icon: <MailOutlineIcon /> },
    { label: t('nav.support'), path: '/support', icon: <HelpOutlineIcon /> },
    { label: t('nav.profile'), path: '/profile', icon: <PersonOutlineIcon /> },
    { label: t('nav.settings'), path: '/settings', icon: <SettingsIcon /> },
    { label: t('nav.about'), path: '/about', icon: <InfoOutlinedIcon /> }
  ];
  if (isDispatcher) {
    items.splice(1, 0, { label: t('nav.manage'), path: '/orders/manage', icon: <ListAltIcon /> });
  }
  return items;
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:900px)');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { t } = useTranslation();
  const navItems = useNavItems();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          DeliveryApp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.fullName ?? 'Driver'}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => {
          const selected = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
          {t('settings.logout')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {!isDesktop && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 900, flex: 1 }}>
            DeliveryApp
          </Typography>
          {isDesktop && (
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              {t('settings.logout')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        {isDesktop && (
          <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
            {drawer}
          </Drawer>
        )}
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 }, flex: 1 }}>
          <Outlet />
        </Container>
      </Box>
      {!isDesktop && <BottomNav />}
    </Box>
  );
}
