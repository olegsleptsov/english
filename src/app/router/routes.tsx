import { Navigate, type RouteObject } from 'react-router-dom';

import { routes } from '@/shared/config/routes';
import { AppLayout } from '@/widgets/app-layout';
import { DictionaryPage } from '@/pages/dictionary';
import { Lesson01Page } from '@/pages/lesson-01';
import { Lesson02Page } from '@/pages/lesson-02';
import { Lesson03Page } from '@/pages/lesson-03';
import { Lesson04Page } from '@/pages/lesson-04';
import { Lesson05Page } from '@/pages/lesson-05';
import { Lesson06Page } from '@/pages/lesson-06';
import { Lesson07Page } from '@/pages/lesson-07';
import { Lesson08Page } from '@/pages/lesson-08';
import { Lesson09Page } from '@/pages/lesson-09';
import { Lesson10Page } from '@/pages/lesson-10';
import { Lesson11Page } from '@/pages/lesson-11';
import { Lesson12Page } from '@/pages/lesson-12';
import { Lesson13Page } from '@/pages/lesson-13';
import { Lesson14Page } from '@/pages/lesson-14';
import { Lesson15Page } from '@/pages/lesson-15';
import { Lesson16Page } from '@/pages/lesson-16';

export const appRoutes: RouteObject[] = [
  {
    path: routes.home,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to={routes.lesson(1)} />,
      },
      {
        path: 'lessons/1',
        element: <Lesson01Page />,
      },
      {
        path: 'lessons/2',
        element: <Lesson02Page />,
      },
      {
        path: 'lessons/3',
        element: <Lesson03Page />,
      },
      {
        path: 'lessons/4',
        element: <Lesson04Page />,
      },
      {
        path: 'lessons/5',
        element: <Lesson05Page />,
      },
      {
        path: 'lessons/6',
        element: <Lesson06Page />,
      },
      {
        path: 'lessons/7',
        element: <Lesson07Page />,
      },
      {
        path: 'lessons/8',
        element: <Lesson08Page />,
      },
      {
        path: 'lessons/9',
        element: <Lesson09Page />,
      },
      {
        path: 'lessons/10',
        element: <Lesson10Page />,
      },
      {
        path: 'lessons/11',
        element: <Lesson11Page />,
      },
      {
        path: 'lessons/12',
        element: <Lesson12Page />,
      },
      {
        path: 'lessons/13',
        element: <Lesson13Page />,
      },
      {
        path: 'lessons/14',
        element: <Lesson14Page />,
      },
      {
        path: 'lessons/15',
        element: <Lesson15Page />,
      },
      {
        path: 'lessons/16',
        element: <Lesson16Page />,
      },
      {
        path: 'dictionary',
        element: <DictionaryPage />,
      },
      {
        path: '*',
        element: <Navigate replace to={routes.lesson(1)} />,
      },
    ],
  },
];
