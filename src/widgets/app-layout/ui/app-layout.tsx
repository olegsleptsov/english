import { useEffect, useState } from 'react';
import { NavLink, Outlet, useMatch } from 'react-router-dom';

import { getLessonDetailById, type LessonDetail } from '@/entities/lesson';
import { routes } from '@/shared/config/routes';
import { useAppTheme } from '@/shared/lib/theme';
import { AnalyticsIcon, Button, Sheet } from '@/shared/ui';
import { AppNavigation } from '@/widgets/app-navigation';

import styles from './app-layout.module.css';

export function AppLayout() {
  const lessonMatch = useMatch('/lessons/:lessonId');
  const activeLessonId = Number(lessonMatch?.params.lessonId);
  const activeLessonDetail = Number.isInteger(activeLessonId)
    ? getLessonDetailById(activeLessonId)
    : undefined;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { theme, toggleTheme } = useAppTheme();

  useEffect(() => {
    setIsInfoOpen(false);
  }, [activeLessonDetail?.lessonId]);

  return (
    <div className="app-layout">
      <header className="app-header">
        {activeLessonDetail ? (
          <Button
            aria-label={`Открыть информацию об уроке ${activeLessonDetail.lessonId}`}
            className={styles.headerInfoButton}
            size="l"
            type="button"
            view="outlined"
            onClick={() => setIsInfoOpen(true)}
          >
            i
          </Button>
        ) : (
          <span className={styles.headerSpacer} aria-hidden="true" />
        )}
        <div className={styles.headerActions}>
          <NavLink
            aria-label="Открыть аналитику"
            className={({ isActive }) =>
              isActive
                ? `${styles.headerIconLink} ${styles.headerIconLinkActive}`
                : styles.headerIconLink
            }
            title="Аналитика"
            to={routes.analytics}
          >
            <AnalyticsIcon className={styles.headerIcon} />
          </NavLink>
          <Button
            aria-label={
              theme === 'light'
                ? 'Включить темную тему'
                : 'Включить светлую тему'
            }
            className={styles.themeToggle}
            data-theme={theme}
            selected={theme === 'dark'}
            size="l"
            type="button"
            view="flat"
            onClick={toggleTheme}
          >
            <span className={styles.themeToggleTrack} aria-hidden="true">
              <span className={styles.themeToggleThumb} />
            </span>
          </Button>
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
        </div>
      </header>
      <AppNavigation />
      <main className="app-main">
        <Outlet />
      </main>
      <LessonInfoSheet
        lessonDetail={activeLessonDetail}
        visible={Boolean(activeLessonDetail && isInfoOpen)}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}

type LessonInfoSheetProps = {
  lessonDetail: LessonDetail | undefined;
  visible: boolean;
  onClose: () => void;
};

function LessonInfoSheet({
  lessonDetail,
  visible,
  onClose,
}: LessonInfoSheetProps) {
  return (
    <Sheet
      className={styles.sheetRoot}
      contentClassName={styles.sheetContent}
      hideTopBar
      title={lessonDetail?.title ?? ''}
      visible={visible}
      onClose={onClose}
    >
      {lessonDetail ? (
        <>
          {lessonDetail.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <section
            className={styles.topicBlock}
            aria-labelledby={`lesson-${lessonDetail.lessonId}-topics`}
          >
            <h3
              className={styles.topicTitle}
              id={`lesson-${lessonDetail.lessonId}-topics`}
            >
              Что тренировать
            </h3>
            <ul className={styles.topicList}>
              {lessonDetail.topics.map((topic) => (
                <li className={styles.topicItem} key={topic}>
                  {topic}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </Sheet>
  );
}
