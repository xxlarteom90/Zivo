import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface StatCardProps {
  value: ReactNode;
  title: string;
  subtitle?: string;
  loading?: boolean;
  icon?: ReactNode;
}

/**
 * Reusable statistic card used across performance, finances and statistics pages.
 */
export function StatCard({ value, title, subtitle, loading, icon }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          {icon}
          <Stack flex={1} spacing={0.5}>
            {loading ? (
              <Skeleton variant="text" width={120} height={48} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {value}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            {subtitle && (
              <Typography color="text.secondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
