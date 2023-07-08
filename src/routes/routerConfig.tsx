import ErrorPage from '@/pages/ErrorPage';
import AppLayout from '@/layout/AppLayout';
import { lazy } from 'react';
import {
  HomeOutlined,
  DotChartOutlined,
  FileProtectOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';
import { MetaMenu, AuthRouteObject } from './interface';

// 快速导入工具函数
const lazyLoad = (moduleName: string) =>
  lazy(() => import(`@/pages/${moduleName}/index.tsx`));

const Home = lazyLoad('Home');
const TestSet = lazyLoad('TestSet');
const TrainingSet = lazyLoad('TrainingSet');

const routers: AuthRouteObject<MetaMenu>[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    meta: {
      title: '',
    },
    children: [
      {
        path: 'home',
        element: <Home />,
        meta: {
          title: '主页',
          icon: <HomeOutlined />,
        },
      },
      {
        path: 'dateSetMananagement',
        meta: {
          title: '数据集管理',
          icon: <DotChartOutlined />,
        },
        children: [
          {
            path: 'onlineTraining',
            element: <TrainingSet />,
            meta: {
              title: '在线训练',
              icon: <HeatMapOutlined />,
            },
          },
          {
            path: 'testSet',
            element: <TestSet />,
            meta: {
              title: '测试验证',
              icon: <FileProtectOutlined />,
            },
          },
        ],
      },
    ],
  },
];

export default routers;
