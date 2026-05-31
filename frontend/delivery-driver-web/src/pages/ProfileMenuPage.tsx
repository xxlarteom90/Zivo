import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MessageIcon from '@mui/icons-material/Message';
import RedeemIcon from '@mui/icons-material/Redeem';
import SettingsIcon from '@mui/icons-material/Settings';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import { Avatar, Box, Card, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSelectors';
import { useTranslation } from '../features/i18n/useTranslation';
import { PageHeader } from '../shared/components/PageHeader';
import { useAppSelector } from '../store/hooks';

interface MenuItem { icon: React.ReactNode; labelKey: string; to: string }

export function ProfileMenuPage() {
  const user = useAppSelector(selectCurrentUser);
  const { t } = useTranslation();

  const items: MenuItem[] = [
    { icon: <TwoWheelerIcon />, labelKey: 'profile.deliverySettings', to: '/settings/delivery' },
    { icon: <BarChartIcon />, labelKey: 'profile.statistics', to: '/statistics' },
    { icon: <LocalAtmIcon />, labelKey: 'profile.finances', to: '/finances' },
    { icon: <RedeemIcon />, labelKey: 'profile.bonus', to: '/bonus' },
    { icon: <GroupAddIcon />, labelKey: 'profile.referrals', to: '/referrals' },
    { icon: <ArticleIcon />, labelKey: 'profile.documents', to: '/documents' },
    { icon: <MessageIcon />, labelKey: 'profile.messages', to: '/messages' },
    { icon: <HelpOutlineIcon />, labelKey: 'profile.support', to: '/support' },
    { icon: <SettingsIcon />, labelKey: 'profile.settings', to: '/settings' }
  ];

  return (
    <Stack spacing={3}>
      <PageHeader title={t('profile.title')} />

      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 56, height: 56 }}><AccountCircleIcon fontSize="large" /></Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{user?.fullName ?? 'Driver'}</Typography>
          <Typography variant="body2" color="text.secondary">{t('profile.offline')}</Typography>
        </Box>
      </Stack>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {items.map((it, idx) => (
            <Box key={it.labelKey}>
              <ListItemButton component={RouterLink} to={it.to}>
                <ListItemIcon>{it.icon}</ListItemIcon>
                <ListItemText primary={t(it.labelKey)} primaryTypographyProps={{ fontWeight: 600 }} />
                <ChevronRightIcon color="action" />
              </ListItemButton>
              {idx < items.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        {t('profile.version', { version: '1.0.0' })}
      </Typography>
    </Stack>
  );
}
