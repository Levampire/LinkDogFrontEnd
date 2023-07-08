import { Button, Card, Col, Modal, Space, Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import DetialModel from '@/pages/TrainingSet/detialModel/detialModel';
import EditFormModel from '@/pages/TrainingSet/editFormModel/editFormModel';
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/pages/TrainingSet/index.module.scss';
import { abortControllerWithReason } from '@reduxjs/toolkit/dist/listenerMiddleware/utils';
import { deleteProject } from '@/api/feature/app';

const cx = classNames.bind(styles);
interface Props {
  item: object;
  key: string;
  updateCards: any;
}
function ProjectCard(props: any) {
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [detialOpen, setDetialOpen] = useState<any>(false);
  const statusTag: {
    [key: string]: JSX.Element;
  } = {
    '0': (
      <>
        <Tag icon={<SyncOutlined spin />} color="processing">
          执行中
        </Tag>
      </>
    ),
    '1': (
      <>
        <Tag icon={<CheckCircleOutlined />} color="success">
          执行成功
        </Tag>
      </>
    ),
    '2': (
      <>
        <Tag icon={<CloseCircleOutlined />} color="error">
          执行失败
        </Tag>
      </>
    ),
    '3': (
      <>
        <Tag icon={<CloseCircleOutlined />} color="orange">
          未执行
        </Tag>
      </>
    ),
  };
  async function delectProject(name: string) {
    const res = await deleteProject({ name: name });
    if (res.success) {
      setOpenDeleteModel(false);
    }
    props.updateCards();
  }

  function setOpenModel(e: React.MouseEvent, type: any) {
    e.stopPropagation();
    if (type === 'edit') setOpenEditModel(true);
    if (type === 'delete') setOpenDeleteModel(true);
  }
  const handleCancelModel = () => {
    setOpenDeleteModel(false);
  };
  return (
    <>
      <div className={cx('divItem')}>
        <DetialModel
          key={props.item.name + 'detialMedol'}
          open={detialOpen}
          setDetialOpen={setDetialOpen}
          projectDto={props.item}
          updateCards={() => props.updateCards()}
        />
        <EditFormModel
          key={props.item.name + 'editModel'}
          open={openEditModel}
          setEditOpen={setOpenEditModel}
          projectDto={props.item}
          operType={'1'}
          dataType={props.item.type === '1' ? '0' : '2'}
          updateCards={() => props.updateCards()}
        />
        <Modal
          key={props.item.name + 'deleteModel'}
          title="删除项目"
          open={openDeleteModel}
          onOk={() => delectProject(props.item.name)}
          onCancel={handleCancelModel}
        >
          <p>是否删除项目：{props.item.name}？</p>
        </Modal>
        <Card
          onClick={() => {
            setDetialOpen(true);
          }}
          bordered={false}
          key={props.item.name}
          hoverable
          title={props.item.name}
          extra={
            <Space direction="horizontal">
              <Button
                type="text"
                size={'small'}
                icon={<FormOutlined />}
                loading={false}
                onClick={(e) => setOpenModel(e, 'edit')}
              />
              <Button
                type="text"
                size={'small'}
                icon={<DeleteOutlined />}
                loading={false}
                onClick={(e) => setOpenModel(e, 'delete')}
                danger
              />
            </Space>
          }
          style={{ width: 300 }}
        >
          <Space direction="vertical">
            {statusTag[props.item?.status]}
            <Button
              size={'small'}
              style={{ fontSize: '12px' }}
              icon={
                <ClockCircleOutlined
                  style={{ fontSize: '12px', color: '#3087ff' }}
                />
              }
              type="text"
            >
              {props.item.runningTime ? props.item.runningTime + 'ms' : '----'}
            </Button>
          </Space>
        </Card>
      </div>
    </>
  );
}

export default ProjectCard;
