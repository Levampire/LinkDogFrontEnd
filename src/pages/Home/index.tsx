import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Typography, theme, Card, Space, Button } from 'antd';
import axios from 'axios';
import {
  CaretRightFilled,
  LoadingOutlined,
  LoginOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';

dayjs.extend(dayLocaleData);
const Home = () => {
  const { token } = theme.useToken();
  const [phrase, setPhrase] = useState<any>();
  const [loading, setLoadStatus] = useState<any>(true);
  // 路由跳转
  const routerTo = useNavigate();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  useEffect(() => {
    const fetchData = async () => {
      const tokenRes = await axios(
        'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0'
      );
      window.localStorage.setItem(
        'jinrishici-token',
        tokenRes.data?.token || ''
      );
      const res = await axios(
        'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=' +
          encodeURIComponent(
            window.localStorage.getItem('jinrishici-token') || ''
          )
      );
      if (phrase == undefined) {
        setPhrase(res.data.data.content);
      }
      setLoadStatus(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return <LoadingOutlined />;
  } else {
    return (
      <>
        <Typography.Title level={4}>{phrase}</Typography.Title>
        <span>*本次训练和测试所用的算法为随机森林。</span>
        <br />
        <br />
        <Space direction="horizontal" size={16}>
          <Card
            hoverable
            title="在线训练"
            extra={
              <Button
                type={'ghost'}
                shape={'circle'}
                icon={
                  <LoginOutlined
                    style={{ fontSize: '16px', color: '#3087ff' }}
                  />
                }
                onClick={() => {
                  routerTo('/dateSetMananagement/onlineTraining');
                }}
              ></Button>
            }
            style={{ width: 300 }}
          >
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              上传训练集
            </h2>
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              在线训练
            </h2>
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              模型下载
            </h2>
          </Card>
          <Card
            hoverable
            title="测试验证"
            extra={
              <Button
                type={'ghost'}
                shape={'circle'}
                icon={
                  <LoginOutlined
                    style={{ fontSize: '16px', color: '#3087ff' }}
                  />
                }
                onClick={() => {
                  routerTo('/dateSetMananagement/testSet');
                }}
              ></Button>
            }
            style={{ width: 300 }}
          >
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              上传测试集
            </h2>
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              测试验证
            </h2>
            <h2>
              <CaretRightFilled
                style={{ fontSize: '16px', color: '#3087ff' }}
              />
              验证结果
            </h2>
          </Card>
        </Space>
      </>
    );
  }
};

export default Home;
