import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin, message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;

const gutterSize = 30;
const inputFontSize = '15px';

// Interface for projects from Basic Information (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTFundingForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';

  // Planned Financial Instruments
  const financialInstruments = [
    { value: 'grant', label: t('cbtForm:grant') },
    { value: 'concessional-loan', label: t('cbtForm:concessionalLoan') },
    { value: 'non-concessional-loan', label: t('cbtForm:nonConcessionalLoan') },
    { value: 'equity', label: t('cbtForm:equity') },
    { value: 'guarantee', label: t('cbtForm:guarantee') },
    { value: 'insurance', label: t('cbtForm:insurance') },
    { value: 'other', label: t('cbtForm:other') },
  ];

  // Status options
  const statusOptions = [
    { value: 'Committed', label: t('cbtForm:committed') },
    { value: 'Received', label: t('cbtForm:received') },
  ];

  // Support Needed or Received options
  const supportNeededOrReceivedOptions = [
    { value: 'Needed', label: t('cbtForm:needed') },
    { value: 'Received', label: t('cbtForm:received') },
  ];

  // Funding Method
  const fundingMethodOptions = [
    { value: 'Multilateral', label: t('cbtForm:multilateral') },
    { value: 'Bilateral', label: t('cbtForm:bilateral') },
    { value: 'Regional', label: t('cbtForm:regional') },
    { value: 'Other', label: t('cbtForm:otherSpecify') },
  ];

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // State for showing "Other" field when Other is selected for Funding Method
  const [showOtherFundingMethod, setShowOtherFundingMethod] = useState<boolean>(false);

  // State for showing "Other" text field
  const [isSupportReceived, setIsSupportReceived] = useState<boolean>(false);

  // Fetch projects from Basic Information (CBT) - same as programmes in ProjectForm
  const fetchCBTProjects = async () => {
    setLoadingProjects(true);
    try {
      const payload = {
        sort: {
          key: 'id',
          order: 'ASC',
        },
      };
      const response: any = await post('national/cbt/query', payload);

      const tempCBTData: CBTProjectData[] = [];
      response.data.forEach((cbt: any) => {
        tempCBTData.push({
          id: cbt.id,
          projectName: cbt.projectName,
        });
      });
      setCbtProjectList(tempCBTData);
    } catch (error: any) {
      console.error('Error fetching CBT projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await get(`national/cbt-funding/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);

        // Show other funding method field if fundingMethod is Other
        if (response.data.fundingMethod === 'Other') {
          setShowOtherFundingMethod(true);
        }

        // Set other funding method visibility based on loaded data
        if (response.data.fundingMethod === 'Other') {
          setShowOtherFundingMethod(true);
        }
      }
    } catch (error: any) {
      console.error('Error fetching Funding data:', error);
      message.error(error.message || 'Failed to load CBT Funding data');
    } finally {
      setLoading(false);
    }
  }, [get, entId, form]);

  useEffect(() => {
    fetchCBTProjects();
  }, []);

  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchData();
    }
  }, [entId, method, fetchData]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        const response: any = await post('national/cbt-funding/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Funding record created successfully');
          navigate('/cbt-funding');
        }
      } else if (method === 'update') {
        const response: any = await put('national/cbt-funding/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Funding record updated successfully');
          navigate('/cbt-funding');
        }
      }
    } catch (error: any) {
      console.error('Error saving Funding:', error);
      message.error(error.message || 'Failed to save CBT Funding record');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt-funding');
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
              <div className="body-title">{t('cbtForm:fundingSources')}</div>
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
              <div className="form-section-header">{t('cbtForm:fundingSources')}</div>

              <Row gutter={gutterSize}>
                {/* Project Name / Measure - dropdown from Basic Information */}
                <Col span={24}>
                  <Form.Item
                    label={t('cbtForm:projectNameMeasure')}
                    name="projectId"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:projectNameMeasurePlaceholder') as string}
                      disabled={isView}
                      loading={loadingProjects}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: string, option: any) =>
                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {cbtProjectList.map((project: CBTProjectData) => {
                        const displayName = project.projectName
                          ? project.projectName.length > 40
                            ? project.projectName.substring(0, 40) + '...'
                            : project.projectName
                          : '';
                        return (
                          <Option key={project.id} value={project.id}>
                            {`${project.id} - ${displayName}`}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Planned Financial Instrument */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:plannedFinancialInstrument')}
                    name="financialInstrument"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:plannedFinancialInstrumentPlaceholder') as string}
                      disabled={isView}
                    >
                      {financialInstruments.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Status */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:status')}
                    name="status"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:statusPlaceholder') as string}
                      disabled={isView}
                    >
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Support Needed or Received */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:supportNeededOrReceived')}
                    name="supportNeededOrReceived"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:supportStatusPlaceholder') as string}
                      disabled={isView}
                      onChange={(value) => {
                        setIsSupportReceived(value === 'Received');
                      }}
                    >
                      {supportNeededOrReceivedOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Funding Method */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:fundingMethod')}
                    name="fundingMethod"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:fundingMethodPlaceholder') as string}
                      disabled={isView}
                      onChange={(value) => {
                        setShowOtherFundingMethod(value === 'Other');
                        if (value !== 'Other') {
                          form.setFieldsValue({ otherFundingMethodText: undefined });
                        }
                      }}
                    >
                      {fundingMethodOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Expected Use, Impact and Estimated Results */}
                <Col span={12}>
                  <Form.Item label={t('cbtForm:expectedImpact')} name="expectedImpact">
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:expectedImpactPlaceholder') as string}
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Other - text field (shown only when Other is selected) */}
              {showOtherFundingMethod && (
                <Row gutter={gutterSize}>
                  <Col span={24}>
                    <Form.Item
                      label={t('cbtForm:specifyOtherFundingMethod')}
                      name="otherFundingMethodText"
                      rules={[validation.required]}
                    >
                      <Input
                        size="large"
                        style={{ fontSize: inputFontSize }}
                        placeholder={t('cbtForm:specifyOtherFundingMethodPlaceholder') as string}
                        disabled={isView}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </div>
          </Form>
        </div>

        {/* Form Actions - outside content-card */}
        {!isView && (
          <Row
            justify="end"
            gutter={16}
            style={{ marginTop: 15, paddingRight: 30, paddingBottom: 30 }}
          >
            <Col>
              <Button size="large" onClick={onCancel}>
                {t('cbtForm:cancel')}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                disabled={isSaveButtonDisabled}
              >
                {method === 'create' ? t('cbtForm:create') : t('cbtForm:update')}
              </Button>
            </Col>
          </Row>
        )}

        {isView && (
          <Row justify="end" style={{ marginTop: 15, paddingRight: 30, paddingBottom: 30 }}>
            <Col>
              <Button size="large" onClick={onCancel}>
                {t('cbtForm:back')}
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default CBTFundingForm;
