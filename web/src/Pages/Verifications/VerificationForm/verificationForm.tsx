import { Row, Col, Input, Button, Form, Select, Spin, message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;
const { TextArea } = Input;

const gutterSize = 30;
const inputFontSize = '15px';

const typeOptions = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' },
  { value: 'ThirdParty', label: 'Third Party' },
];

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Rejected', label: 'Rejected' },
];

const VerificationForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const isView: boolean = method === 'view';
  const formTitle =
    method === 'create'
      ? 'Add Verification'
      : method === 'update'
        ? 'Edit Verification'
        : 'View Verification';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();
  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/verifications/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching verification data:', error);
      message.error(error.message || 'Failed to load verification data');
    } finally {
      setLoading(false);
    }
  }, [get, entId, form]);

  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchData();
    }
  }, [entId, method, fetchData]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        const response = await post('national/verifications/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Verification created successfully');
          navigate('/verifications');
        }
      } else if (method === 'update') {
        const response = await put('national/verifications/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Verification updated successfully');
          navigate('/verifications');
        }
      }
    } catch (error: any) {
      console.error('Error saving verification:', error);
      message.error(error.message || 'Failed to save verification');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/verifications');
  };

  const onFieldsChange = () => {
    setIsSaveButtonDisabled(false);
  };

  return (
    <div className="content-container">
      <Spin spinning={loading}>
        <div className="title-bar">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="body-title">{formTitle}</div>
            </Col>
          </Row>
        </div>

        <div className="content-card">
          <Form
            form={form}
            onFinish={onFinish}
            onFieldsChange={onFieldsChange}
            layout="vertical"
            disabled={isView}
          >
            <div className="form-section-card">
              <div className="form-section-header">Verification Details</div>

              <Row gutter={gutterSize}>
                <Col span={24}>
                  <Form.Item label="Entity" name="entity" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter entity name"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={12}>
                  <Form.Item label="Type" name="type" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select verification type"
                      disabled={isView}
                    >
                      {typeOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Verifier" name="verifier" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter verifier name"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={12}>
                  <Form.Item label="Date" name="date">
                    <Input
                      type="date"
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Status" name="status" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select status"
                      disabled={isView}
                    >
                      {statusOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={24}>
                  <Form.Item label="Notes" name="notes">
                    <TextArea
                      rows={4}
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter verification notes"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </div>

        {!isView && (
          <Row
            justify="end"
            gutter={16}
            style={{ marginTop: 15, paddingRight: 30, paddingBottom: 30 }}
          >
            <Col>
              <Button size="large" onClick={onCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                disabled={isSaveButtonDisabled}
              >
                {method === 'create' ? 'Create' : 'Update'}
              </Button>
            </Col>
          </Row>
        )}

        {isView && (
          <Row justify="end" style={{ marginTop: 15, paddingRight: 30, paddingBottom: 30 }}>
            <Col>
              <Button size="large" onClick={onCancel}>
                Back
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default VerificationForm;
