import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Table,
  Card,
  Row,
  Col,
  Form,
  Space,
  message,
  InputNumber,
} from 'antd';
import { PlusOutlined, SearchOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const TestPage = () => {
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [form] = Form.useForm();

  // --- 1. THE SAVE FUNCTION ---
  const handleSave = async (values: any) => {
    console.log('Sending data:', values);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    if (!token) {
      message.error('You are not logged in! Please log in first.');
      return;
    }

    // Prepare Payload
    const payload = {
      projectId: values.projectId,
      title: values.title,
      description: values.description,
      projectStatus: values.projectStatus,
      startYear: parseInt(values.startYear),
      endYear: parseInt(values.endYear),
      path: '1.1',
      programmeId: 1,
    };

    try {
      const baseUrl = process.env.REACT_APP_BACKEND || 'http://localhost:9000';
      const url = `${baseUrl}/api/projects/add`;

      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Project saved successfully!');
      setViewState('list');
      form.resetFields();
    } catch (error: any) {
      console.error('Error saving:', error);
      if (error.response) {
        message.error(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        message.error('Failed to connect to server.');
      }
    }
  };

  // --- 2. THE LIST VIEW ---
  const columns = [
    { title: 'Project ID', dataIndex: 'id', key: 'id' },
    { title: 'Title of Project', dataIndex: 'title', key: 'title' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const data = [{ key: '1', id: 'PROJ-001', title: 'Solar Energy Plant', status: 'Ongoing' }];

  const renderList = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#880e4f', fontWeight: 'bold' }}>Project List</h2>
      </div>

      <Card>
        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#880e4f', borderColor: '#880e4f' }}
              onClick={() => setViewState('form')}
            >
              ADD REAL PROJECT
            </Button>
          </Col>
          <Col>
            <Input
              placeholder="Search by Project ID"
              suffix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );

  // --- 3. THE FORM VIEW ---
  const renderForm = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <h2 style={{ color: '#555', marginBottom: 20 }}>Add New Project</h2>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Project ID"
                name="projectId"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="e.g. MNE-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Current Status"
                name="projectStatus"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select placeholder="Select Status">
                  <Option value="Planned">Planned</Option>
                  <Option value="Ongoing">Ongoing</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Project Title"
                name="title"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Enter the official title" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Start Year"
                name="startYear"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="2023" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Year"
                name="endYear"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="2030" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Describe the project..." />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 20 }}>
            <Space>
              <Button onClick={() => setViewState('list')}>CANCEL</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ background: '#880e4f', borderColor: '#880e4f' }}
              >
                SAVE PROJECT
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </div>
  );

  return <>{viewState === 'list' ? renderList() : renderForm()}</>;
};

export default TestPage;
