import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Card, Row, Col, Form, message, InputNumber, Space } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const TestPage = () => {
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [foodList, setFoodList] = useState([]);
  const [form] = Form.useForm();

  const baseUrl = process.env.REACT_APP_BACKEND || 'http://localhost:9100';

  // 1. FETCH DATA (GET)
  const fetchFood = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) return;

    try {
      // Call the FoodController @Get() endpoint
      const response = await axios.get(`${baseUrl}/food`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodList(response.data);
    } catch (error) {
      console.error('Could not fetch food', error);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [viewState]); // Refresh list when switching back to list view

  // 2. SAVE DATA (POST)
  const handleSave = async (values: any) => {
    console.log('Sending data:', values);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    if (!token) {
      message.error('You are not logged in! Please log in first.');
      return;
    }

    try {
      // Call the FoodController @Post('add') endpoint
      const url = `${baseUrl}/food/add`;

      await axios.post(url, values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Food saved successfully!');
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
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Food Name', dataIndex: 'name', key: 'name' },
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Calories', dataIndex: 'calories', key: 'calories' },
  ];

  const renderList = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#880e4f', fontWeight: 'bold' }}>Food Inventory</h2>
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
              ADD NEW FOOD
            </Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={foodList} rowKey="id" />
      </Card>
    </div>
  );

  // --- 3. THE FORM VIEW ---
  const renderForm = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <h2 style={{ color: '#555', marginBottom: 20 }}>Add New Food Item</h2>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Food Name"
                name="name"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="e.g. Pizza" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Origin" name="origin">
                <Input placeholder="e.g. Italy" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Calories"
                name="calories"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber style={{ width: '100%' }} />
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
                SAVE FOOD
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
