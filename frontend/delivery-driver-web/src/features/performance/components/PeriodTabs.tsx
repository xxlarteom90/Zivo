import { Tab, Tabs } from '@mui/material';
import type { PerformancePeriod } from '../../../entities/performance';
import { useTranslation } from '../../i18n/useTranslation';

interface Props {
  value: PerformancePeriod;
  onChange: (value: PerformancePeriod) => void;
}

/**
 * Pill-style segmented control for switching the performance time window.
 */
export function PeriodTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <Tabs
      value={value}
      onChange={(_, v: PerformancePeriod) => onChange(v)}
      variant="fullWidth"
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 999,
        border: 1,
        borderColor: 'divider',
        minHeight: 44,
        '& .MuiTab-root': { minHeight: 44, fontWeight: 700, textTransform: 'none' },
        '& .MuiTabs-indicator': { display: 'none' },
        '& .Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText !important',
          borderRadius: 999
        }
      }}
    >
      <Tab label={t('period.today')} value={'Today' satisfies PerformancePeriod} />
      <Tab label={t('period.week')} value={'Week' satisfies PerformancePeriod} />
      <Tab label={t('period.month')} value={'Month' satisfies PerformancePeriod} />
    </Tabs>
  );
}
