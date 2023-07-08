import React, { useRef, useState } from 'react';
import { Button, Form, Input, message, Modal, Tag, Upload } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib';
import useTextFileReader from '@/utils/diyHook/fileReaderHook';
import { addProject, editProject, getProject } from '@/api/feature/app';

interface Props {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setEditOpen: Function;
  projectDto?: any;
  /*1-edit 0-add */
  operType: string;
  dataType: string;
  updateCards: any;
}
const TYPE_EDIT = '1';
const TYPE_ADD = '0';
const objectItem = {
  name: '',
  type: '',
  filePath: ``,
  status: '',
  logList: [],
  result: null,
  runningTime: null,
  newName: '',
};
function EditFormModel(props: Props) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const [filePath, setfilePath] = useState(props.projectDto?.filePath);
  const [projectName, setProjectName] = useState(props.projectDto?.fileName);

  const closeModel = () => {
    props.setEditOpen(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const layout = {
    labelCol: { flex: '110px' },
    wrapperCol: { flex: 1 },
  };
  const [form] = Form.useForm();
  const handleFile = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    uploadFileInputRef.current.click();
  };
  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.value.replace('fakepath', '');
    objectItem.filePath = file.replace(`\\\\`, `\\`);
    setfilePath(file);
  };
  const uploadFileInputRef = useRef(null);

  function updateProjectCards() {
    props.updateCards();
  }

  async function subMitData() {
    objectItem.name = props.projectDto.name;
    objectItem.newName = projectName;
    objectItem.filePath = filePath.replace(`\\\\`, `\\`);
    objectItem.type = props.dataType === '0' ? '1' : '2';
    objectItem.status = '';
    let res;
    if (props.operType === '0') {
      res = await addProject(objectItem);
    } else {
      res = await editProject(objectItem);
    }
    closeModel();
    updateProjectCards();
  }

  return (
    <>
      <Modal
        title={props.operType === TYPE_ADD ? '新增项目' : '修改项目:'}
        open={props.open}
        confirmLoading={confirmLoading}
        onOk={subMitData}
        onCancel={closeModel}
        width={600}
      >
        <br />
        <br />
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          labelWrap
          style={{ maxWidth: 800 }}
        >
          <Form.Item label="项目名称" rules={[{ required: true }]}>
            <Input
              placeholder={
                props.operType == '0'
                  ? '命名您的新项目'
                  : props.projectDto?.name
              }
              id="name"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
          </Form.Item>
          <Form.Item label="名称路径" rules={[{ required: true }]}>
            <Input
              placeholder="选择的项目本地路径"
              id="filePath"
              disabled
              value={filePath}
            />
          </Form.Item>
          <Form.Item label="上传数据集" rules={[{ required: true }]}>
            <Button onClick={handleFile} icon={<UploadOutlined />}>
              选择文件
            </Button>
            <input
              style={{ visibility: 'hidden' }}
              type={'file'}
              onChange={(e) => chooseFile(e)}
              ref={uploadFileInputRef}
            ></input>
          </Form.Item>
          <Form.Item label="温馨提示" rules={[{ required: true }]}>
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              由于浏览器安全策略，请将您的数据集文件放置于磁盘根目录再上传。
            </Tag>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditFormModel;
