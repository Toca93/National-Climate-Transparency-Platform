import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin, InputNumber } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;

const gutterSize = 30;

// Exchange rate for EUR to USD conversion (this can be made configurable)
const EUR_TO_USD_RATE = 1.08; // Example rate, should be updated periodically

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTInstrumentsForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Finansijski instrumenti';

  const navigate = useNavigate();
  const { get, post } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // State za praćenje valute (EUR ili USD)
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');

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
      // TODO: Implementirati API poziv
      // const response = await get(`cbt-instruments/${entId}`);
      // form.setFieldsValue(response.data);
      //
      // // Set currency from loaded data
      // if (response.data?.currency) {
      //   setCurrency(response.data.currency);
      // }
    } catch (error) {
      console.error('Error fetching Instruments data:', error);
    } finally {
      setLoading(false);
    }
  }, [get, entId]);

  useEffect(() => {
    fetchCBTProjects();
  }, []);

  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchData();
    }
  }, [entId, method, fetchData]);

  // Handler za promenu iznosa koji izračunava konverziju
  const handleAmountChange = (value: number | null) => {
    if (value && value > 0) {
      const convertedAmount =
        currency === 'EUR'
          ? Math.round(value * EUR_TO_USD_RATE * 100) / 100
          : Math.round((value / EUR_TO_USD_RATE) * 100) / 100;
      form.setFieldsValue({ convertedAmount });
    } else {
      form.setFieldsValue({ convertedAmount: undefined });
    }
  };

  // Efekat za ponovno izračunavanje konverzije kada se promeni valuta
  useEffect(() => {
    const totalAmount = form.getFieldValue('totalAmount');
    if (totalAmount && totalAmount > 0) {
      handleAmountChange(totalAmount);
    }
  }, [currency]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        // TODO: Implementirati API poziv
        console.log('Create Instruments:', values);
      } else if (method === 'update') {
        // TODO: Implementirati API poziv
        console.log('Update Instruments:', values);
      }
      navigate('/cbt-instruments');
    } catch (error) {
      console.error('Error saving Instruments:', error);
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
              <div className="form-section-header">
                Finansijski instrumenti (Financial Instruments)
              </div>

              <Row gutter={gutterSize}>
                {/* Naziv projekta / mjere - dropdown iz Osnovnih informacija */}
                <Col span={24}>
                  <Form.Item
                    label="Naziv projekta / mjere (Project Name)"
                    name="projectId"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite projekat iz Osnovnih informacija"
                      disabled={isView}
                      loading={loadingProjects}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: string, option: any) =>
                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {cbtProjectList.map((project: CBTProjectData) => (
                        <Option key={project.id} value={project.id}>
                          {project.projectName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div
                className="form-section-sub-header"
                style={{ marginTop: 16, marginBottom: 16, fontWeight: 600 }}
              >
                Finansijski podaci (Financial Data) - konverzija EUR/USD
              </div>

              <Row gutter={gutterSize}>
                {/* Valuta selector */}
                <Col span={12}>
                  <Form.Item label="Valuta (Currency)" name="currency" initialValue="EUR">
                    <Select
                      size="large"
                      placeholder="Izaberite valutu"
                      disabled={isView}
                      onChange={(value: 'EUR' | 'USD') => {
                        setCurrency(value);
                      }}
                    >
                      <Option value="EUR">EUR (€)</Option>
                      <Option value="USD">USD ($)</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* Kurs (readonly) */}
                <Col span={12}>
                  <Form.Item
                    label="Kurs EUR/USD (Exchange Rate)"
                    tooltip="Srednji kurs za konverziju"
                  >
                    <Input
                      size="large"
                      value={`1 EUR = ${EUR_TO_USD_RATE} USD`}
                      disabled={true}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Ukupan iznos u izabranoj valuti */}
                <Col span={12}>
                  <Form.Item
                    label={`Ukupan iznos (Total Amount) ${currency === 'EUR' ? '€' : '$'}`}
                    name="totalAmount"
                    rules={[validation.required]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder={`Unesite ukupan iznos u ${currency}`}
                      disabled={isView}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter={currency === 'EUR' ? '€' : '$'}
                      onChange={handleAmountChange}
                    />
                  </Form.Item>
                </Col>

                {/* Konvertovani iznos */}
                <Col span={12}>
                  <Form.Item
                    label={`Konvertovani iznos (Converted Amount) ${
                      currency === 'EUR' ? '$' : '€'
                    }`}
                    name="convertedAmount"
                    tooltip="Automatski izračunato preko srednjeg kursa"
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Automatska konverzija"
                      disabled={true}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter={currency === 'EUR' ? '$' : '€'}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Nacionalna komponenta */}
                <Col span={12}>
                  <Form.Item
                    label={`Nacionalna komponenta (National Component) ${
                      currency === 'EUR' ? '€' : '$'
                    }`}
                    name="nationalComponent"
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Unesite nacionalnu komponentu"
                      disabled={isView}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter={currency === 'EUR' ? '€' : '$'}
                    />
                  </Form.Item>
                </Col>

                {/* Međunarodna komponenta */}
                <Col span={12}>
                  <Form.Item
                    label={`Međunarodna komponenta (International Component) ${
                      currency === 'EUR' ? '€' : '$'
                    }`}
                    name="internationalComponent"
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Unesite međunarodnu komponentu"
                      disabled={isView}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter={currency === 'EUR' ? '€' : '$'}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Dodatne informacije */}
                <Col span={24}>
                  <Form.Item
                    label="Dodatne informacije (Additional information)"
                    name="additionalInformation"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Unesite dodatne informacije o finansijskim instrumentima"
                      disabled={isView}
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
