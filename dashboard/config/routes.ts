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
    redirect: '/clusters',
  },
  {
    name: 'cluster',
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
