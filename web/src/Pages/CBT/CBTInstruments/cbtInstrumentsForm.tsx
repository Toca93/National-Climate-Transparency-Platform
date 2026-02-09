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

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTInstrumentsForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Financial Instruments';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // State za praćenje kursa konverzije (valuta je fiksno EUR)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Fiksna valuta EUR - koristi se u formi kao initialValue

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
      const response: any = await get(`national/cbt-instruments/${entId}`);
      if (response.data) {
        form.setFieldsValue(response.data);
        // Set exchange rate for calculation
        if (response.data.exchangeRate) {
          setExchangeRate(response.data.exchangeRate);
        }
      }
    } catch (error: any) {
      console.error('Error fetching Instruments data:', error);
      message.error(error.message || 'Failed to load CBT Instruments data');
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

  // Handler za promenu iznosa koji izračunava konverziju
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0 && exchangeRate && exchangeRate > 0) {
      const convertedAmount = Math.round(value * exchangeRate * 100) / 100;
      form.setFieldsValue({ convertedAmount });
    } else {
      form.setFieldsValue({ convertedAmount: undefined });
    }
  };

  // Handler za promenu kursa
  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setExchangeRate(value);
    // Ponovo izračunaj konverziju ako postoji iznos i kurs
    const totalAmount = parseFloat(form.getFieldValue('totalAmount'));
    if (!isNaN(totalAmount) && totalAmount > 0 && !isNaN(value) && value > 0) {
      const convertedAmount = Math.round(totalAmount * value * 100) / 100;
      form.setFieldsValue({ convertedAmount });
    } else {
      form.setFieldsValue({ convertedAmount: undefined });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        const response: any = await post('national/cbt-instruments/add', values);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Instruments record created successfully');
          navigate('/cbt-instruments');
        }
      } else if (method === 'update') {
        const response: any = await put('national/cbt-instruments/update', {
          ...values,
          id: entId,
        });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT Instruments record updated successfully');
          navigate('/cbt-instruments');
        }
      }
    } catch (error: any) {
      console.error('Error saving Instruments:', error);
      message.error(error.message || 'Failed to save CBT Instruments record');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt-instruments');
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
              <div className="form-section-header">Financial Instruments</div>

              <Row gutter={gutterSize}>
                {/* Project Name / Measure - dropdown iz Osnovnih informacija */}
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

              <div
                className="form-section-sub-header"
                style={{ marginTop: 16, marginBottom: 16, fontWeight: 600 }}
              >
                Financial Data - EUR/USD Conversion
              </div>

              <Row gutter={gutterSize}>
                {/* Kurs (editable) */}
                <Col span={24}>
                  <Form.Item
                    label="EUR/USD Exchange Rate"
                    name="exchangeRate"
                    tooltip="Enter exchange rate for EUR to USD conversion"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="e.g. 1.08"
                      disabled={isView}
                      step={0.0001}
                      onChange={handleExchangeRateChange}
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
                {/* Ukupan iznos u EUR */}
                <Col span={12}>
                  <Form.Item
                    label="Total Amount €"
                    name="totalAmount"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter total amount in EUR"
                      disabled={isView}
                      min={0}
                      step={0.01}
                      onChange={handleAmountChange}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                {/* Konvertovani iznos u USD */}
                <Col span={12}>
                  <Form.Item
                    label="Converted Amount $"
                    name="convertedAmount"
                    tooltip="Automatically calculated using exchange rate"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Automatic conversion"
                      disabled={true}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* National Component */}
                <Col span={12}>
                  <Form.Item label="National Component €" name="nationalComponent">
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter national component"
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

                {/* International Component */}
                <Col span={12}>
                  <Form.Item label="International Component €" name="internationalComponent">
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      type="number"
                      placeholder="Enter international component"
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
                {/* Additional Information */}
                <Col span={24}>
                  <Form.Item label="Additional Information" name="additionalInformation">
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter additional information about financial instruments"
                      disabled={isView}
                      style={{ fontSize: inputFontSize }}
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

export default CBTInstrumentsForm;
