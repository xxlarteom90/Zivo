import MapIcon from '@mui/icons-material/Map';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Button, Stack } from '@mui/material';
import type { AddressDto } from '../../../entities/address';
import { getGoogleMapsUrl, getWazeUrl } from '../../../shared/utils/mapLinks';

interface MapButtonsProps {
  address: AddressDto;
  dense?: boolean;
}

export function MapButtons({ address, dense = false }: MapButtonsProps) {
  const size = dense ? 'small' : 'medium';
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button size={size} variant="outlined" startIcon={<MapIcon />} href={getGoogleMapsUrl(address)} target="_blank" rel="noreferrer">
        Google Maps
      </Button>
      <Button size={size} variant="outlined" startIcon={<NavigationIcon />} href={getWazeUrl(address)} target="_blank" rel="noreferrer">
        Waze
      </Button>
    </Stack>
  );
}
