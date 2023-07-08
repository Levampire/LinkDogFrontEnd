import { MetaMenu, AuthRouteObject } from '@/routes/interface';
import type { MenuProps } from 'antd';
import { matchRoutes } from 'react-router-dom';

//根据路由生成菜单结构
function getMenuItems(router: any) {
  type MenuItem = Required<MenuProps>['items'][number];
  type router = Required<AuthRouteObject<MetaMenu>[]>;
  const children: Array<MenuItem> = [];
  let menuItem: MenuItem = {} as MenuItem;
  if (router.children && router.children.length > 0) {
    router.children.forEach((routerChild: router) => {
      children.push(getMenuItems(routerChild));
    });
    menuItem = {
      key: router.path,
      children: children,
      icon: router.meta.icon,
      label: router.meta.title,
    } as MenuItem;
  } else {
    menuItem = {
      key: router.path,
      icon: router.meta.icon,
      label: router.meta.title,
    } as MenuItem;
  }
  return menuItem;
}

//根据当前路由生成面包屑
function getBreadcrumbItems(
  routers: AuthRouteObject<MetaMenu>[],
  pathname: string
) {
  // 返回匹配到的路由数组对象，每一个对象都是一个路由对象˝
  const routes = matchRoutes(routers, pathname);
  const pathArr: any = [];
  if (routes !== null) {
    routes.forEach((item) => {
      const path = item.route.path;
      if (path) {
        pathArr.push(item.route);
      }
    });
  }
  return pathArr;
}

//根据当前面包屑及点击按钮生成地址
function getBreadcrumbRouterPath(breadItems: any, breadPath: string): string {
  let routerPath = '';
  breadItems.forEach((item: any) => {
    if (item.path !== '/') {
      routerPath = routerPath + '/' + item.path;
    }
    if (item.path == breadPath) {
      return;
    }
  });
  return routerPath;
}

//将ant菜单keyPath转换为routerPath
function getRouterPath(keyPath: string[]): string {
  let path = '';
  keyPath.forEach((key: string) => {
    path = '/' + key.concat(path);
  });
  return path;
}

export {
  getMenuItems,
  getBreadcrumbItems,
  getRouterPath,
  getBreadcrumbRouterPath,
};
