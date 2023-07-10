import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCount } from '@/store/feature/appSlice';
import { selectUser } from '@/store/feature/userSlice';
import classNames from 'classnames/bind';
import styles from './index.module.scss';
import { Button, Space } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getProject } from '@/api/feature/app';
import EditFormModel from '@/pages/TrainingSet/editFormModel/editFormModel';
import ProjectCard from '@/pages/TrainingSet/projectCard/projectCard';

const cx = classNames.bind(styles);

function TrainingSet() {
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
      const res = await getProject({ type: '1' });
      setLoadStatus(false);
      setProjectList(res.data);
    };
    fetchData();
  }, []);

  async function loadProjectData() {
    const res = await getProject({ type: '1' });
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
          dataType={'0'}
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

export default TrainingSet;
