export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/applications',
  },
  {
    name: 'application',
    path: '/applications',
    flatMenu: true,
    routes: [
      {
        name: 'list',
        path: '/applications',
        icon: 'AppstoreOutlined',
        component: './Application/List',
      },
      {
        name: 'create',
        path: '/applications/create',
        component: './Application/Create',
        hideInMenu: true,
      },
      {
        name: 'edit',
        path: '/applications/:name',
        component: './Application/Edit',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'cluster',
    path: '/clusters',
    flatMenu: true,
    routes: [
      {
        name: 'list',
        path: '/clusters',
        icon: 'ClusterOutlined',
        component: './Cluster/List',
      },
    ],
  },
  {
    component: './404',
  },
];
