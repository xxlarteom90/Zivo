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
import { PerformancePage } from '../pages/PerformancePage';
import { MessagesPage } from '../pages/MessagesPage';
import { SupportPage } from '../pages/SupportPage';
import { ProfileMenuPage } from '../pages/ProfileMenuPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NavigationSettingsPage } from '../pages/NavigationSettingsPage';
import { LanguageSettingsPage } from '../pages/LanguageSettingsPage';
import { AboutPage } from '../pages/AboutPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { FinancesPage } from '../pages/FinancesPage';
import { DeliveriesListPage } from '../pages/DeliveriesListPage';
import { ReferralsPage } from '../pages/ReferralsPage';
import { DeliverySettingsPage } from '../pages/DeliverySettingsPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { AppearanceSettingsPage } from '../pages/AppearanceSettingsPage';
import { VehicleSettingsPage } from '../pages/VehicleSettingsPage';
import { DispatcherOrdersPage } from '../pages/DispatcherOrdersPage';

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
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/profile" element={<ProfileMenuPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/navigation" element={<NavigationSettingsPage />} />
        <Route path="/settings/language" element={<LanguageSettingsPage />} />
        <Route path="/settings/appearance" element={<AppearanceSettingsPage />} />
        <Route path="/settings/vehicle" element={<VehicleSettingsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/finances" element={<FinancesPage />} />
        <Route path="/deliveries" element={<DeliveriesListPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/delivery-settings" element={<DeliverySettingsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/orders/manage" element={<DispatcherOrdersPage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
