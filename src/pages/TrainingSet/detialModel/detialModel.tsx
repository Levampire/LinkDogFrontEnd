import React, { useState } from 'react';
import { Button, Collapse, message, Modal, Typography } from 'antd';
import { DownloadOutlined, PoweroffOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from '@/layout/index.module.scss';
import { downLoadTrainingResult, startTraining } from '@/api/feature/app';

interface Props {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setDetialOpen: Function;
  projectDto: any;
  updateCards: any;
}

function DetialModel(props: Props) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [runStatus, setRunStatus] = useState(props.projectDto.status === '0');
  const { Title, Text, Link, Paragraph } = Typography;
  const [logList, setLogList] = useState([]);
  const [hasResultPath, sethasResultPath] = useState(
    !props.projectDto?.hasResultPath
  );
  let ws: WebSocket;
  const closeModel = () => {
    props.setDetialOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(props);

  async function runProject() {
    if (runStatus) {
      message.error('项目已在运行', 3);
    } else {
      const res = await startTraining({ name: props.projectDto.name });
      setLogList([]);
      if (res.success) {
        setRunStatus(true);
        handleGetServer();
      }
    }
  }

  const cx = classNames.bind(styles);
  const handleGetServer = () => {
    if ('WebSocket' in window) {
      if (ws !== undefined) {
        ws.send('客户端销毁socket');
        ws.close();
      }
      ws = new WebSocket(
        'ws://localhost:8080/linkDogWebsocket?projectName=' +
          props.projectDto?.name
      );

      ws.onopen = () => {
        console.log('连接服务器成功');
      };

      ws.onmessage = function (evt) {
        const received_msg = evt.data;
        if (evt.data === 'ScriptEndLinkDog') {
          setRunStatus(false);
          ws.close();
          sethasResultPath(true);
          props.updateCards();
        }
        if (evt.data !== '') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setLogList((current) => [...current, received_msg]);
        }
      };

      ws.onclose = function () {
        console.log('连接关闭...');
      };
    } else {
      alert('您的浏览器不支持WebScoket');
    }
  };
  let item;

  async function downLoadResult() {
    const res = await downLoadTrainingResult(props.projectDto);
    console.log(res);
    if (res.status === '500') {
      message.error(res.message, 3);
      return;
    }
    if (res) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a'); //创建a标签
      link.style.display = 'none';
      link.href = url; // 设置a标签路径
      //1-训练集 2- 测试集
      if (props.projectDto.type === '1') {
        link.download = props.projectDto?.name + '.joblib'; //设置文件名
      } else {
        link.download = props.projectDto?.name + '.txt'; //设置文件名
      }
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href); // 释放 URL对象
      document.body.removeChild(link);
    }
  }

  return (
    <>
      <Modal
        title={'项目名称：' + props.projectDto.name}
        open={props.open}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={closeModel}
        width={800}
      >
        <br />
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          //状态 0 执行中 1 执行成功 2- 执行失败 3- 未执行
          loading={runStatus}
          className={cx('startBtn')}
          onClick={() => runProject()}
        ></Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          className={cx('startBtn')}
          onClick={() => downLoadResult()}
          disabled={hasResultPath}
        >
          下载模型
        </Button>
        <Collapse
          size="small"
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: '项目详情',
              children: (
                <>
                  <Paragraph>
                    <ul>
                      <li>数据集：{props.projectDto?.filePath}</li>
                      <li>
                        运行时间：
                        {(props.projectDto?.runningTime
                          ? props.projectDto?.runningTime
                          : '--') + 'ms'}
                      </li>
                      <li>
                        运行结果：
                        {props.projectDto?.result
                          ? props.projectDto?.result
                          : '--'}
                      </li>
                    </ul>
                  </Paragraph>
                </>
              ),
            },
          ]}
        />
        <br />
        <Collapse
          size="small"
          items={[
            {
              key: '1',
              label: '运行日志',
              children: (
                <div className={cx('ctxLog')}>
                  {logList.map((item: any) => {
                    return (
                      <>
                        <label key={item}>{item}</label>
                        <br />
                      </>
                    );
                  })}
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
}

export default DetialModel;
