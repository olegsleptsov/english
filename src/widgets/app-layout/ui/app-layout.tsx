import { NavLink, Outlet } from 'react-router-dom';

import { routes } from '@/shared/config/routes';
import { AppNavigation } from '@/widgets/app-navigation';

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="app-header__brand" to={routes.lesson(1)}>
          English
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? 'app-header__action app-header__action--active'
              : 'app-header__action'
          }
          to={routes.dictionary}
        >
          Dictionary
        </NavLink>
      </header>
      <AppNavigation />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
