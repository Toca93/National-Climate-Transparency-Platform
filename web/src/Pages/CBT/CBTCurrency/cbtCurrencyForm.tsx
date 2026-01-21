import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;
const { TextArea } = Input;

const gutterSize = 30;

// Lista valuta (Currency List)
const currencies = [
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'RSD', label: 'RSD - Serbian Dinar' },
  { value: 'BAM', label: 'BAM - Bosnian Mark' },
  { value: 'HRK', label: 'HRK - Croatian Kuna' },
  { value: 'MKD', label: 'MKD - Macedonian Denar' },
  { value: 'ALL', label: 'ALL - Albanian Lek' },
];

// Metode preračuna (Conversion Methods)
const conversionMethods = [
  { value: 'ecb-rate', label: 'ECB kurs (ECB Exchange Rate)' },
  { value: 'annual-average', label: 'Godišnji prosjek (Annual Average)' },
  { value: 'spot-rate', label: 'Spot kurs na dan transakcije (Spot Rate)' },
  { value: 'central-bank', label: 'Kurs centralne banke (Central Bank Rate)' },
  { value: 'fixed-rate', label: 'Fiksni kurs (Fixed Rate)' },
  { value: 'other', label: 'Ostalo (Other)' },
];

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTCurrencyForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Valuta i metodologija';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // Dohvati projekte iz Osnovnih informacija (CBT)
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
      // const response = await get(`cbt-currency/${entId}`);
      // form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching Currency data:', error);
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        // TODO: Implementirati API poziv
        console.log('Create Currency:', values);
      } else if (method === 'update') {
        // TODO: Implementirati API poziv
        console.log('Update Currency:', values);
      }
      navigate('/cbt-currency');
    } catch (error) {
      console.error('Error saving Currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt-currency');
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
                Valuta i metodologija (Currency & Methodology)
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

              <Row gutter={gutterSize}>
                {/* Valuta */}
                <Col span={12}>
                  <Form.Item
                    label="Valuta (Currency)"
                    name="currency"
                    rules={[validation.required]}
                    initialValue="EUR"
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite valutu"
                      disabled={isView}
                      showSearch
                    >
                      {currencies.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Metod preračuna */}
                <Col span={12}>
                  <Form.Item
                    label="Metod preračuna (Conversion Method)"
                    name="conversionMethod"
                    tooltip="Ako je izvorno u drugoj valuti, navedite metod preračuna u EUR"
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite metod preračuna"
                      disabled={isView}
                      allowClear
                    >
                      {conversionMethods.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Napomena o metodologiji */}
                <Col span={24}>
                  <Form.Item
                    label="Napomena o metodologiji (Methodology Note - CBT)"
                    name="methodologyNote"
                    tooltip="Dodatne informacije o metodologiji korištenoj za klimatsko finansiranje"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Unesite napomenu o metodologiji (opciono)"
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

export default CBTCurrencyForm;
