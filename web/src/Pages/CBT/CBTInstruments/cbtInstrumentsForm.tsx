import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin, InputNumber } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getFormTitle } from '../../../Utils/utilServices';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;

const gutterSize = 30;

// Tipovi finansijskih instrumenata (Financial Instrument Types)
const instrumentTypes = [
  { value: 'grant', label: 'Grant' },
  { value: 'credit', label: 'Kredit (Credit)' },
  { value: 'combined', label: 'Kombinovani instrument (Combined Instrument)' },
  { value: 'guarantee', label: 'Garancija (Guarantee)' },
];

// Generisanje godina (npr. od 2010 do 2030)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2010; year <= currentYear + 10; year++) {
    years.push(year.toString());
  }
  return years;
};

const CBTInstrumentsForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = getFormTitle('CBTInstruments', method);

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Implementirati API poziv
      // const response = await get(`cbt-instruments/${entId}`);
      // form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching Instruments data:', error);
    } finally {
      setLoading(false);
    }
  }, [get, entId]);

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
                {/* Naziv projekta / mjere - za povezivanje sa H1 */}
                <Col span={24}>
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
                {/* Tip instrumenta */}
                <Col span={12}>
                  <Form.Item
                    label="Tip instrumenta (Instrument Type)"
                    name="instrumentType"
                    rules={[validation.required]}
                  >
                    <Select size="large" placeholder="Izaberite tip instrumenta" disabled={isView}>
                      {instrumentTypes.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Godina - za iznos po godini */}
                <Col span={12}>
                  <Form.Item label="Godina (Year)" name="year">
                    <Select
                      size="large"
                      placeholder="Izaberite godinu"
                      showSearch
                      disabled={isView}
                      allowClear
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

              <div
                className="form-section-sub-header"
                style={{ marginTop: 16, marginBottom: 16, fontWeight: 600 }}
              >
                Finansijski podaci (Financial Data) - svi iznosi u EUR (€)
              </div>

              <Row gutter={gutterSize}>
                {/* Ukupan iznos */}
                <Col span={12}>
                  <Form.Item
                    label="Ukupan iznos (Total Amount) €"
                    name="totalAmount"
                    rules={[validation.required]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Unesite ukupan iznos"
                      disabled={isView}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter="€"
                    />
                  </Form.Item>
                </Col>

                {/* Iznos po godini */}
                <Col span={12}>
                  <Form.Item label="Iznos po godini (Amount per Year) €" name="amountPerYear">
                    <InputNumber
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Unesite iznos po godini"
                      disabled={isView}
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/,/g, '') as any}
                      addonAfter="€"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Nacionalna komponenta */}
                <Col span={12}>
                  <Form.Item
                    label="Nacionalna komponenta (National Component) €"
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
                      addonAfter="€"
                    />
                  </Form.Item>
                </Col>

                {/* Međunarodna komponenta */}
                <Col span={12}>
                  <Form.Item
                    label="Međunarodna komponenta (International Component) €"
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
                      addonAfter="€"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Form Actions */}
            {!isView && (
              <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
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
              <Row justify="end" style={{ marginTop: 24 }}>
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

export default CBTInstrumentsForm;
