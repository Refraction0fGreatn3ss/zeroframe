import { Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { AppShell } from '../components/layout/app-shell/AppShell';
import { CapabilityGate } from '../components/ui/CapabilityGate';
import { ALL_NAV_ITEMS, type NavItem, ROUTE_REDIRECTS } from '../config/routes';
import { NotFoundPage } from '../pages/not-found/NotFoundPage';
import { appActions } from '../stores/app-store';
import { registerNavigator } from './navigation';
import { DETAIL_ROUTE_SUFFIXES, PAGE_COMPONENTS } from './route-table';

const RouteFallback = () => (
  <div role="status" className="p-6 text-xs text-[var(--zf-text-muted)]">
    Loading view…
  </div>
);

function pageElement(item: NavItem) {
  const Page = PAGE_COMPONENTS[item.id];
  return (
    <CapabilityGate capability={item.requiredCapability}>
      <Suspense fallback={<RouteFallback />}>
        <Page />
      </Suspense>
    </CapabilityGate>
  );
}

function toRoutes(item: NavItem): RouteObject[] {
  const routes: RouteObject[] = [{ path: item.path, element: pageElement(item) }];
  const detailSuffix = DETAIL_ROUTE_SUFFIXES[item.id];
  if (detailSuffix) routes.push({ path: `${item.path}/${detailSuffix}`, element: pageElement(item) });
  return routes;
}

export function buildRoutes(): RouteObject[] {
  return [
    {
      element: <AppShell />,
      children: [
        ...Object.entries(ROUTE_REDIRECTS).map(([from, to]) => ({ path: from, element: <Navigate to={to} replace /> })),
        ...ALL_NAV_ITEMS.flatMap(toRoutes),
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ];
}

export function createAppRouter() {
  const router = createBrowserRouter(buildRoutes());
  registerNavigator((path) => void router.navigate(path));
  appActions.syncCurrentPath(router.state.location.pathname);
  router.subscribe((state) => appActions.syncCurrentPath(state.location.pathname));
  return router;
}
