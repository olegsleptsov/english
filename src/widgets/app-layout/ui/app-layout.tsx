import { useEffect, useState } from 'react';
import { Sheet } from '@gravity-ui/uikit';
import { NavLink, Outlet, useMatch } from 'react-router-dom';

import { getLessonDetailById, type LessonDetail } from '@/entities/lesson';
import { routes } from '@/shared/config/routes';
import { AppNavigation } from '@/widgets/app-navigation';

import styles from './app-layout.module.css';

export function AppLayout() {
  const lessonMatch = useMatch('/lessons/:lessonId');
  const activeLessonId = Number(lessonMatch?.params.lessonId);
  const activeLessonDetail = Number.isInteger(activeLessonId)
    ? getLessonDetailById(activeLessonId)
    : undefined;
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    setIsInfoOpen(false);
  }, [activeLessonDetail?.lessonId]);

  return (
    <div className="app-layout">
      <header className="app-header">
        {activeLessonDetail ? (
          <button
            aria-label={`Открыть информацию об уроке ${activeLessonDetail.lessonId}`}
            className={styles.headerInfoButton}
            type="button"
            onClick={() => setIsInfoOpen(true)}
          >
            i
          </button>
        ) : (
          <span className={styles.headerSpacer} aria-hidden="true" />
        )}
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
