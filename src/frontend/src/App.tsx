import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import AdminSignInPage from './pages/admin/AdminSignInPage';
import AdminLayout from './pages/admin/AdminLayout';
import AddCustomerPage from './pages/admin/AddCustomerPage';
import CustomerSignInPage from './pages/customer/CustomerSignInPage';
import CustomerHomePage from './pages/customer/CustomerHomePage';
import CustomerRequestPage from './pages/customer/CustomerRequestPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage
});

const adminSignInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/signin',
  component: AdminSignInPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: () => (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-foreground">Nehitha Finance Management</h2>
    </div>
  )
});

const addCustomerRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/add-customer',
  component: AddCustomerPage
});

const customerSignInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/signin',
  component: CustomerSignInPage
});

const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: CustomerHomePage
});

const customerRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/request',
  component: CustomerRequestPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminSignInRoute,
  adminRoute.addChildren([adminDashboardRoute, addCustomerRoute]),
  customerSignInRoute,
  customerRoute,
  customerRequestRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

