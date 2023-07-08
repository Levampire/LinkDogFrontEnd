import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCount,
  decremented,
  incremented,
} from '@/store/feature/appSlice';
import { deleteUser, getUserData, selectUser } from '@/store/feature/userSlice';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Button, Card, Modal, Row, Space, Tag, Typography } from 'antd';
import {
  CaretRightFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  LoadingOutlined,
  LoginOutlined,
  PlusOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import { getProject } from '@/api/feature/app';
import DetialModel from '@/pages/TrainingSet/detialModel/detialModel';
import EditFormModel from '@/pages/TrainingSet/editFormModel/editFormModel';
import ProjectCard from '@/pages/TrainingSet/projectCard/projectCard';

const cx = classNames.bind(styles);

function TestSet() {
  const count = useAppSelector(selectCount);

  const users = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [loading, setLoadStatus] = useState<any>(true);
  const [projectList, setProjectList] = useState<any>([]);

  const [openAddModel, setOpenAddModel] = useState(false);
  function setOpenModel(e: React.MouseEvent, type: any) {
    e.stopPropagation();
    if (type === 'add') setOpenAddModel(true);
  }
  useEffect(() => {
    const fetchData = async () => {
      const res = await getProject({ type: '2' });
      setLoadStatus(false);
      setProjectList(res.data);
    };
    fetchData();
  }, []);
  async function loadProjectData() {
    const res = await getProject({ type: '2' });
    setProjectList(res.data);
  }
  if (loading) {
    return <LoadingOutlined />;
  } else {
    return (
      <>
        <Space direction="vertical">
          <Button
            size={'small'}
            icon={<PlusOutlined />}
            onClick={(e) => setOpenModel(e, 'add')}
            loading={false}
          />
        </Space>
        <br />
        <br />
        <EditFormModel
          open={openAddModel}
          setEditOpen={setOpenAddModel}
          operType={'0'}
          projectDto={null}
          dataType={'1'}
          updateCards={loadProjectData}
        />
        <div className={cx('CardCtx')}>
          {projectList.map((item: any) => {
            console.log(item);
            return (
              <ProjectCard
                key={item.name + 'projectCard'}
                item={item}
                updateCards={loadProjectData}
              ></ProjectCard>
            );
          })}
        </div>
      </>
    );
  }
}

export default TestSet;
