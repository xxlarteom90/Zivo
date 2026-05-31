import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Paper, TextField } from '@mui/material';
import { useTranslation } from '../../i18n/useTranslation';

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function OrderFilters({ search, onSearchChange, placeholder }: OrderFiltersProps) {
  const { t } = useTranslation();
  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 3 }}>
      <TextField
        fullWidth
        size="small"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder ?? t('order.search')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Paper>
  );
}
