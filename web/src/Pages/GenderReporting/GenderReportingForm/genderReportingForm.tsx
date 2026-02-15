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

const categoryOptions = [
  { value: 'GenderEquality', label: 'Gender Equality' },
  { value: 'WomenEmpowerment', label: 'Women Empowerment' },
  { value: 'GenderMainstreaming', label: 'Gender Mainstreaming' },
  { value: 'GenderResponsive', label: 'Gender Responsive' },
  { value: 'Other', label: 'Other' },
];

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Published', label: 'Published' },
];

const GenderReportingForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const isView: boolean = method === 'view';
  const formTitle =
    method === 'create'
      ? 'Add Gender Report'
      : method === 'update'
        ? 'Edit Gender Report'
        : 'View Gender Report';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();
  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/gender-reporting/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching gender report data:', error);
      message.error(error.message || 'Failed to load gender report data');
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
        const response = await post('national/gender-reporting/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Gender report created successfully');
          navigate('/gender-reporting');
        }
      } else if (method === 'update') {
        const response = await put('national/gender-reporting/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Gender report updated successfully');
          navigate('/gender-reporting');
        }
      }
    } catch (error: any) {
      console.error('Error saving gender report:', error);
      message.error(error.message || 'Failed to save gender report');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/gender-reporting');
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
              <div className="form-section-header">Gender Report Details</div>

              <Row gutter={gutterSize}>
                <Col span={24}>
                  <Form.Item label="Report Title" name="title" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter report title"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={12}>
                  <Form.Item label="Category" name="category" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select category"
                      disabled={isView}
                    >
                      {categoryOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
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
                      placeholder="Enter report description"
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

export default GenderReportingForm;
