import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../features/auth/RequireAuth';
import { AppShell } from '../shared/components/AppShell';
import { AvailableOrdersPage } from '../pages/AvailableOrdersPage';
import { DeliveredOrdersPage } from '../pages/DeliveredOrdersPage';
import { DriverDashboardPage } from '../pages/DriverDashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { MyActiveOrdersPage } from '../pages/MyActiveOrdersPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<DriverDashboardPage />} />
        <Route path="/orders/available" element={<AvailableOrdersPage />} />
        <Route path="/orders/active" element={<MyActiveOrdersPage />} />
        <Route path="/orders/delivered" element={<DeliveredOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
