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

// Predviđeni finansijski instrumenti (Planned Financial Instruments)
const financialInstruments = [
  { value: 'grant', label: 'Grant' },
  { value: 'concessional-loan', label: 'Concessional Loan' },
  { value: 'non-concessional-loan', label: 'Non-concessional Loan' },
  { value: 'equity', label: 'Equity' },
  { value: 'guarantee', label: 'Guarantee' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
];

// Status opcije
const statusOptions = [
  { value: 'Committed', label: 'Committed' },
  { value: 'Received', label: 'Received' },
];

// Support Needed or Received opcije
const supportNeededOrReceivedOptions = [
  { value: 'Needed', label: 'Needed' },
  { value: 'Received', label: 'Received' },
];

// Način finansiranja (Funding Method)
const fundingMethodOptions = [
  { value: 'Multilateral', label: 'Multilateral' },
  { value: 'Bilateral', label: 'Bilateral' },
  { value: 'Regional', label: 'Regional' },
  { value: 'Other', label: 'Other (please specify)' },
];

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTFundingForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Funding Sources';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // State za prikaz polja "Other" kada je izabran Ostalo za Način finansiranja
  const [showOtherFundingMethod, setShowOtherFundingMethod] = useState<boolean>(false);

  // State za prikaz polja "Other" teksta
  const [isSupportReceived, setIsSupportReceived] = useState<boolean>(false);

  // Dohvati projekte iz Osnovnih informacija (CBT) - isto kao programmes u ProjectForm
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
              <div className="form-section-header">Funding Sources</div>

              <Row gutter={gutterSize}>
                {/* Naziv projekta / mjere - dropdown iz Osnovnih informacija */}
                <Col span={24}>
                  <Form.Item
                    label="Project Name / Measure"
                    name="projectId"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select project from Basic Information"
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
                {/* Predviđeni finansijski instrument */}
                <Col span={12}>
                  <Form.Item
                    label="Planned Financial Instrument"
                    name="financialInstrument"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select financial instrument"
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
                  <Form.Item label="Status" name="status" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select status"
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
                    label="Support Needed or Received"
                    name="supportNeededOrReceived"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select support status"
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

                {/* Način finansiranja */}
                <Col span={12}>
                  <Form.Item
                    label="Funding Method"
                    name="fundingMethod"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select funding method"
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

                {/* Očekivana upotreba, uticaj i procijenjeni rezultati */}
                <Col span={12}>
                  <Form.Item
                    label="Expected Use, Impact and Estimated Results"
                    name="expectedImpact"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter expected results"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Ostalo - tekstualno polje (prikazuje se samo ako je izabran Ostalo) */}
              {showOtherFundingMethod && (
                <Row gutter={gutterSize}>
                  <Col span={24}>
                    <Form.Item
                      label="Specify Other Funding Method"
                      name="otherFundingMethodText"
                      rules={[validation.required]}
                    >
                      <Input
                        size="large"
                        style={{ fontSize: inputFontSize }}
                        placeholder="Enter funding method"
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

export default CBTFundingForm;
