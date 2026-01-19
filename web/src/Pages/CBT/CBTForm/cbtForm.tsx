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

// Nadležne institucije
const institutions = [
  'Ministarstvo ekologije, održivog razvoja i razvoja sjevera',
  'Ministarstvo finansija',
  'Ministarstvo energetike i rudarstva',
  'Ministarstvo saobraćaja',
  'Ministarstvo poljoprivrede, šumarstva i vodoprivrede',
  'Ministarstvo prostornog planiranja, urbanizma i državne imovine',
  'Ministarstvo zdravlja',
  'Agencija za zaštitu životne sredine',
  'Uprava za vode',
  'Uprava za šume',
  'Zavod za hidrometeorologiju i seizmologiju',
  'Investiciono-razvojni fond',
  'Eko fond',
  'Međunarodni partneri',
];

// Status opcije (H1: planirano / u toku / završeno)
const statusOptions = [
  { value: 'planned', label: 'Planirano (Planned)' },
  { value: 'ongoing', label: 'U toku (Ongoing)' },
  { value: 'completed', label: 'Završeno (Completed)' },
];

// Generisanje godina (npr. od 2020 do 2030)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2020; year <= currentYear + 10; year++) {
    years.push(year.toString());
  }
  return years;
};

const CBTForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Osnovne informacije';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchCBTData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implementirati API poziv
      // const response = await get(`cbt/${entId}`);
      // form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching CBT data:', error);
    } finally {
      setLoading(false);
    }
  }, [get, entId]);

  // Učitavanje podataka za edit/view
  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchCBTData();
    }
  }, [entId, method, fetchCBTData]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (method === 'create') {
        // TODO: Implementirati API poziv
        // await post('cbt', values);
        console.log('Create CBT:', values);
      } else if (method === 'update') {
        // TODO: Implementirati API poziv
        // await put(`cbt/${entId}`, values);
        console.log('Update CBT:', values);
      }
      navigate('/cbt');
    } catch (error) {
      console.error('Error saving CBT:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt');
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
              <div className="form-section-header">Osnovne informacije (Basic Information)</div>

              <Row gutter={gutterSize}>
                {/* Godina izvještavanja */}
                <Col span={12}>
                  <Form.Item
                    label="Godina izvještavanja (Reporting Year)"
                    name="reportingYear"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite godinu izvještavanja"
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

                {/* Naziv projekta / mjere */}
                <Col span={12}>
                  <Form.Item
                    label="Naziv projekta / mjere (Project Name)"
                    name="projectName"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      placeholder="Unesite naziv projekta ili mjere"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Opis aktivnosti */}
                <Col span={24}>
                  <Form.Item
                    label="Opis aktivnosti (Activity Description)"
                    name="activityDescription"
                    rules={[validation.required]}
                  >
                    <TextArea rows={6} placeholder="Unesite opis aktivnosti" disabled={isView} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Nadležna institucija */}
                <Col span={12}>
                  <Form.Item
                    label="Nadležna institucija (Responsible Institution)"
                    name="responsibleInstitution"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite nadležnu instituciju"
                      showSearch
                      disabled={isView}
                    >
                      {institutions.map((institution) => (
                        <Option key={institution} value={institution}>
                          {institution}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Status */}
                <Col span={12}>
                  <Form.Item label="Status" name="status" rules={[validation.required]}>
                    <Select size="large" placeholder="Select status" disabled={isView}>
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Form Actions */}
            {!isView && (
              <Row justify="end" gutter={16} style={{ marginTop: 24, marginRight: 20, marginBottom: 20 }}>
                <Col>
                  <Button size="large" onClick={onCancel}>
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    disabled={isSaveButtonDisabled}
                  >
                    {method === 'create' ? 'Create' : 'Update'}
                  </Button>
                </Col>
              </Row>
            )}

            {isView && (
              <Row justify="end" style={{ marginTop: 24, marginRight: 20, marginBottom: 20 }}>
                <Col>
                  <Button size="large" onClick={onCancel}>
                    Back
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default CBTForm;
