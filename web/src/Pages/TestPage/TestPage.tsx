import React, { useState } from 'react';
import { Button, Input, Select, Table, Card, Row, Col, Form, Space, PageHeader } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const TestPage = () => {
  // STATE: This controls whether we see the LIST or the FORM
  const [viewState, setViewState] = useState<'list' | 'form'>('list');

  // --- PART 1: THE LIST VIEW (Like Screenshot 1) ---
  const columns = [
    { title: 'Project ID', dataIndex: 'id', key: 'id' },
    { title: 'Title of Project', dataIndex: 'title', key: 'title' },
    { title: 'Project Status', dataIndex: 'status', key: 'status' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
  ];

  // Fake data to populate the table
  const data = [
    { key: '1', id: 'PROJ-001', title: 'Solar Energy Plant', status: 'Ongoing', type: 'Mitigation' },
    { key: '2', id: 'PROJ-002', title: 'Electric Bus Fleet', status: 'Planned', type: 'Transport' },
  ];

  const renderList = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#880e4f', fontWeight: 'bold' }}>Project List</h2>
      </div>

      <Card>
        {/* Toolbar: Add Button and Search */}
        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              style={{ background: '#880e4f', borderColor: '#880e4f' }} // Matching the burgundy color
              onClick={() => setViewState('form')} // CLICKING THIS SWITCHES TO FORM
            >
              ADD PROJECT
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

        {/* The Table */}
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );

  // --- PART 2: THE FORM VIEW (Like Screenshot 2) ---
  const renderForm = () => (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <h2 style={{ color: '#555', marginBottom: 20 }}>General Project Information</h2>
      
      <Card>
        <Form layout="vertical">
          {/* ROW 1: Programme and Type */}
          <Row gutter={24}> {/* Gutter is the space between columns */}
            
            <Col span={12}> {/* Left Side (50%) */}
              <Form.Item label="Select Programme" name="programme">
                <Select placeholder="Select...">
                  <Option value="prog1">Programme A</Option>
                  <Option value="prog2">Programme B</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}> {/* Right Side (50%) */}
              <Form.Item label="Type" name="type">
                <Select placeholder="Select...">
                  <Option value="mitigation">Mitigation</Option>
                  <Option value="adaptation">Adaptation</Option>
                </Select>
              </Form.Item>
            </Col>

          </Row>

          {/* ROW 2: Title and Description */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Title of Project" name="title" required tooltip="This is a required field">
                <Input placeholder="Enter title" />
              </Form.Item>
              
              <Form.Item label="Additional Project Number" name="projNum">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Short Description of Project" name="description" required>
                <TextArea rows={5} />
              </Form.Item>
            </Col>
          </Row>

          {/* ROW 3: Strategy */}
           <Row gutter={24}>
            <Col span={12}>
               <Form.Item label="Anchored in a National Strategy" name="strategy">
                <Select mode="multiple" placeholder="Select...">
                  <Option value="planned">Planned</Option>
                  <Option value="ongoing">Ongoing</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
           </Row>

          {/* FORM FOOTER BUTTONS */}
          <Row justify="end" style={{ marginTop: 20 }}>
            <Space>
              <Button onClick={() => setViewState('list')}>CANCEL</Button>
              <Button type="primary" style={{ background: '#880e4f', borderColor: '#880e4f' }}>
                ADD
              </Button>
            </Space>
          </Row>

        </Form>
      </Card>
    </div>
  );

  // --- MAIN RENDER LOGIC ---
  return (
    <>
      {viewState === 'list' ? renderList() : renderForm()}
    </>
  );
};

export default TestPage;