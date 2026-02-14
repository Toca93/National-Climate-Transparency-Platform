import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Form, Select, Spin, Input, message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;

const gutterSize = 30;
const inputFontSize = '15px';

// Generate years
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2010; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
};

// Interface for projects from Basic Information (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTMacroForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // Fetch projects from Basic Information (CBT)
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
      message.error(error.message || 'Failed to load CBT projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await get(`national/cbt-macro/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching Macro data:', error);
      message.error(error.message || 'Failed to load CBT Macro data');
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
        const response: any = await post('national/cbt-macro/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Macro record created successfully');
          navigate('/cbt-macro');
        }
      } else if (method === 'update') {
        const response: any = await put('national/cbt-macro/update', { ...values, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Macro record updated successfully');
          navigate('/cbt-macro');
        }
      }
    } catch (error: any) {
      console.error('Error saving Macro:', error);
      message.error(error.message || 'Failed to save CBT Macro record');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt-macro');
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
              <div className="body-title">{t('cbtForm:macroIndicators')}</div>
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
              <div className="form-section-header">{t('cbtForm:macroIndicators')}</div>
              <Row gutter={gutterSize}>
                {/* Project Name / Measure - dropdown from Basic Information */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:projectNameMeasure')}
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

                {/* Year */}
                <Col span={12}>
                  <Form.Item label="Reference Year" name="year" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select year"
                      showSearch
                      disabled={isView}
                    >
                      {generateYears().map((year) => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* GDP */}
                <Col span={12}>
                  <Form.Item
                    label="GDP in Reference Year"
                    name="gdp"
                    tooltip="Gross domestic product in reference year expressed in EUR"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter GDP in EUR"
                      disabled={isView}
                      min={0}
                      step={0.01}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Climate Finance Amount */}
                <Col span={12}>
                  <Form.Item
                    label="Climate Finance Amount"
                    name="climateFinanceAmount"
                    tooltip="Total climate finance amount for reference year"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter amount in EUR"
                      disabled={isView}
                      min={0}
                      step={0.01}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Climate Finance Share of GDP */}
                <Col span={12}>
                  <Form.Item
                    label="Climate Finance Share of GDP (%)"
                    name="climateFinanceShareGdp"
                    tooltip="Percentage of climate finance relative to GDP"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter percentage"
                      disabled={isView}
                      min={0}
                      max={100}
                      step={0.01}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Share of State Budget */}
                <Col span={12}>
                  <Form.Item
                    label="Share of State Budget (%)"
                    name="climateFinanceShareBudget"
                    tooltip="Percentage of climate finance relative to total state budget"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter percentage"
                      disabled={isView}
                      min={0}
                      max={100}
                      step={0.01}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
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

export default CBTMacroForm;
