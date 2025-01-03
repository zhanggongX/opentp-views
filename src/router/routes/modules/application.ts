import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const APPLICATION: AppRouteRecordRaw = {
  path: '/application',
  name: 'Application',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.application',
    requiresAuth: true,
    icon: 'icon-list',
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'ApplicationList',
      component: () => import('@/views/application/list/index.vue'),
      meta: {
        locale: 'menu.application.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default APPLICATION;
