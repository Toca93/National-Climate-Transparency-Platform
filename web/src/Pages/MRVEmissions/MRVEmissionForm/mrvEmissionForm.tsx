import { Row, Col, Input, Button, Form, Select, Spin, InputNumber, message } from 'antd';
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

const sectorOptions = [
  { value: 'Energy', label: 'Energy' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Industry', label: 'Industry (IPPU)' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'LULUCF', label: 'LULUCF' },
  { value: 'Waste', label: 'Waste' },
  { value: 'Other', label: 'Other' },
];

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Published', label: 'Published' },
];

const MRVEmissionForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const isView: boolean = method === 'view';
  const formTitle =
    method === 'create'
      ? 'Add MRV Emission'
      : method === 'update'
      ? 'Edit MRV Emission'
      : 'View MRV Emission';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();
  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/mrv-emissions/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching MRV emission data:', error);
      message.error(error.message || 'Failed to load MRV emission data');
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
        const response = await post('national/mrv-emissions/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'MRV Emission record created successfully');
          navigate('/mrv-emissions');
        }
      } else if (method === 'update') {
        const response = await put('national/mrv-emissions/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'MRV Emission record updated successfully');
          navigate('/mrv-emissions');
        }
      }
    } catch (error: any) {
      console.error('Error saving MRV emission:', error);
      message.error(error.message || 'Failed to save MRV emission record');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/mrv-emissions');
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
              <div className="form-section-header">MRV Emission Details</div>

              <Row gutter={gutterSize}>
                <Col span={24}>
                  <Form.Item label="Emission Source" name="source" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter emission source"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={12}>
                  <Form.Item label="Sector" name="sector" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select sector"
                      disabled={isView}
                    >
                      {sectorOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Amount (tCO2e)" name="amount">
                    <InputNumber
                      size="large"
                      style={{ fontSize: inputFontSize, width: '100%' }}
                      placeholder="Enter emission amount"
                      disabled={isView}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
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
                  <Form.Item label="Description" name="description">
                    <TextArea
                      rows={4}
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter description"
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

export default MRVEmissionForm;
