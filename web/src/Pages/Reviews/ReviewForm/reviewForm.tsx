import { Row, Col, Input, Button, Form, Select, Spin, DatePicker, message } from 'antd';
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

const ratingOptions = [
  { value: '1', label: '1 - Poor' },
  { value: '2', label: '2 - Fair' },
  { value: '3', label: '3 - Good' },
  { value: '4', label: '4 - Very Good' },
  { value: '5', label: '5 - Excellent' },
];

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const ReviewForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const isView: boolean = method === 'view';
  const formTitle =
    method === 'create' ? 'Add Review' : method === 'update' ? 'Edit Review' : 'View Review';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();
  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/reviews/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching review data:', error);
      message.error(error.message || 'Failed to load review data');
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
        const response = await post('national/reviews/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Review created successfully');
          navigate('/reviews');
        }
      } else if (method === 'update') {
        const response = await put('national/reviews/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'Review updated successfully');
          navigate('/reviews');
        }
      }
    } catch (error: any) {
      console.error('Error saving review:', error);
      message.error(error.message || 'Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/reviews');
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
              <div className="form-section-header">Review Details</div>

              <Row gutter={gutterSize}>
                <Col span={24}>
                  <Form.Item label="Subject" name="subject" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter review subject"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                <Col span={12}>
                  <Form.Item label="Reviewer" name="reviewer" rules={[validation.required]}>
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter reviewer name"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Review Date" name="reviewDate">
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
                  <Form.Item label="Rating" name="rating">
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select rating"
                      disabled={isView}
                    >
                      {ratingOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
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
                  <Form.Item label="Comments" name="comments">
                    <TextArea
                      rows={4}
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter review comments"
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

export default ReviewForm;
