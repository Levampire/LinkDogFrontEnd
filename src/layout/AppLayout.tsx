import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, Layout, Menu, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  RightSquareFilled,
  LeftSquareFilled,
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import routers from '@/routes/routerConfig';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import {
  getBreadcrumbItems,
  getBreadcrumbRouterPath,
  getMenuItems,
  getRouterPath,
} from '@/utils/basicTools';

const cx = classNames.bind(styles);

const { Header, Content, Sider } = Layout;

export default function AppLayout() {
  const location = useLocation();
  const routerTo = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']);
  const [breadItems, setBreadItems] = useState<any>(routers[0]?.children);
  useEffect(() => {
    let curPathname = location.pathname;
    if (curPathname === '/') {
      routerTo('/home');
      curPathname = '//home';
    }
    setBreadItems(getBreadcrumbItems(routers, curPathname));
  }, [location.pathname]);
  const [collapsed, setCollapsed] = useState(false);
  const middleStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,.2)',
    backdropFilter: 'blur(10px)',
  };
  const upperStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
  };
  const items: MenuProps['items'] = [];
  routers[0].children?.forEach((item) => {
    items.push(getMenuItems(item));
  });

  const onClick: MenuProps['onClick'] = (e) => {
    routerTo(getRouterPath(e.keyPath));
    setSelectedKeys([e.key]);
  };
  return (
    <Layout style={middleStyle} className={'ctx'}>
      <div className={cx('round-leftTop')}></div>
      <div className={cx('round-rightEnd')}></div>
      <Header className={cx('header')} style={middleStyle}>
        <div className={cx('logo-vertical')} />
        <div className={'buttonGroup'}>
          <Button type={'ghost'} icon={<BellOutlined />}></Button>
          <Button type={'ghost'} icon={<QuestionCircleOutlined />}></Button>
          <Avatar style={{ backgroundColor: '#529bff' }}>令</Avatar>
        </div>
      </Header>
      <Layout hasSider style={middleStyle}>
        <Sider
          style={upperStyle}
          className={cx('leftSider')}
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={'18%'}
        >
          <Menu
            mode="inline"
            theme="light"
            onClick={onClick}
            className={cx('menu')}
            defaultSelectedKeys={['dateSetMananagement']}
            defaultOpenKeys={['home']}
            selectedKeys={selectedKeys}
            items={items}
            inlineCollapsed={false}
            style={upperStyle}
          />
          <Button
            type="text"
            icon={
              collapsed ? (
                <RightSquareFilled style={{ color: '#6c6c6c' }} />
              ) : (
                <LeftSquareFilled style={{ color: '#3087ff' }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              margin: '10px',
              fontSize: '14px',
              padding: '10px ',
              minWidth: '40px',
              height: '40px',
            }}
          />
        </Sider>
        <Layout style={upperStyle}>
          <div className={cx('breadcrumbCTX')}>
            <Breadcrumb>
              {breadItems?.map((breadItem: any) => (
                <Breadcrumb.Item key={breadItem.path}>
                  {breadItem.meta?.icon}
                  <Link
                    to={getBreadcrumbRouterPath(breadItems, breadItem.path)}
                  >
                    {breadItem.meta?.title}
                  </Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <Content className={cx('content')}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
