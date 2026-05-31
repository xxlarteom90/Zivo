import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPreferences } from '../preferences/preferencesSlice';
import { selectIsAuthenticated } from './authSelectors';

interface RequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hydrated = useAppSelector((state) => state.preferences.hydrated);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !hydrated) {
      dispatch(fetchPreferences());
    }
  }, [isAuthenticated, hydrated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
