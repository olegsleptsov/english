import { NavLink } from 'react-router-dom';

import { lessons } from '@/entities/lesson';

export function AppNavigation() {
  return (
    <nav className="app-navigation" aria-label="Lessons">
      <ol className="app-navigation__list">
        {lessons.map((lesson) => (
          <li className="app-navigation__item" key={lesson.id}>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'app-navigation__link app-navigation__link--active'
                  : 'app-navigation__link'
              }
              to={lesson.routePath}
            >
              {lesson.title}
            </NavLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
