import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import '../../../Styles/app.scss';

const { Option } = Select;

const gutterSize = 30;

// Predviđeni finansijski instrumenti (Planned Financial Instruments)
const financialInstruments = [
  { value: 'grant', label: 'Grant' },
  { value: 'concessional-loan', label: 'Koncesioni zajam (Concessional Loan)' },
  { value: 'non-concessional-loan', label: 'Nekoncesioni zajam (Non-concessional Loan)' },
  { value: 'equity', label: 'Kapital (Equity)' },
  { value: 'guarantee', label: 'Garancija (Guarantee)' },
  { value: 'insurance', label: 'Osiguranje (Insurance)' },
  { value: 'other', label: 'Ostalo (Other)' },
];

// Status opcije
const statusOptions = [
  { value: 'Committed', label: 'Ugovoreno (Committed)' },
  { value: 'Received', label: 'Isplaćeno (Received)' },
];

// Support Needed or Received opcije
const supportNeededOrReceivedOptions = [
  { value: 'Needed', label: 'Potrebno (Needed)' },
  { value: 'Received', label: 'Primljeno (Received)' },
];

// Način finansiranja (Funding Method)
const fundingMethodOptions = [
  { value: 'Multilateral', label: 'Multilateralni (Multilateral)' },
  { value: 'Bilateral', label: 'Bilateralni (Bilateral)' },
  { value: 'Regional', label: 'Regionalni (Regional)' },
  { value: 'Other', label: 'Ostalo (navesti) - Other (please specify)' },
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
  const formTitle = 'Izvori finansiranja';

  const navigate = useNavigate();
  const { get, post } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // State za prikaz polja "Other" kada je izabran Ostalo za Način finansiranja
  const [showOtherFundingMethod, setShowOtherFundingMethod] = useState<boolean>(false);

  // State za praćenje da li je izabrano "Received" za Support Needed or Received
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
      // TODO: Implementirati API poziv
      // const response = await get(`cbt-funding/${entId}`);
      // form.setFieldsValue(response.data);
      //
      // // Show other funding method field if fundingMethod is Other
      // if (response.data?.fundingMethod === 'Other') {
      //   setShowOtherFundingMethod(true);
      // }
      //
      // // Set support received state based on loaded data
      // if (response.data?.supportNeededOrReceived === 'Received') {
      //   setIsSupportReceived(true);
      // } else {
      //   setIsSupportReceived(false);
      // }
    } catch (error) {
      console.error('Error fetching Funding data:', error);
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
        console.log('Create Funding:', values);
      } else if (method === 'update') {
        // TODO: Implementirati API poziv
        console.log('Update Funding:', values);
      }
      navigate('/cbt-funding');
    } catch (error) {
      console.error('Error saving Funding:', error);
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
              <div className="form-section-header">Izvori finansiranja (Funding Sources)</div>

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
                {/* Predviđeni finansijski instrument */}
                <Col span={12}>
                  <Form.Item
                    label="Predviđeni finansijski instrument (Planned Financial Instrument)"
                    name="financialInstrument"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite finansijski instrument"
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
                    <Select size="large" placeholder="Izaberite status" disabled={isView}>
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
                    label="Podrška potrebna ili primljena (Support needed or received)"
                    name="supportNeededOrReceived"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite status podrške"
                      disabled={isView}
                      onChange={(value) => {
                        setIsSupportReceived(value === 'Received');
                        if (value !== 'Received') {
                          form.setFieldsValue({
                            fundingMethod: undefined,
                            otherFundingMethodText: undefined,
                          });
                          setShowOtherFundingMethod(false);
                        }
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
                    label="Način finansiranja (Funding Method)"
                    name="fundingMethod"
                    rules={isSupportReceived ? [validation.required] : undefined}
                  >
                    <Select
                      size="large"
                      placeholder={
                        isSupportReceived
                          ? 'Izaberite način finansiranja'
                          : 'Dostupno samo kada je primljeno'
                      }
                      disabled={isView || !isSupportReceived}
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
                    label="Očekivana upotreba, uticaj i procijenjeni rezultati (Expected use, impact and estimated results)"
                    name="expectedImpact"
                  >
                    <Input
                      size="large"
                      placeholder="Unesite očekivane rezultate"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Ostalo - tekstualno polje (prikazuje se samo ako je izabran Ostalo i primljeno) */}
              {showOtherFundingMethod && isSupportReceived && (
                <Row gutter={gutterSize}>
                  <Col span={24}>
                    <Form.Item
                      label="Navedite drugi način finansiranja (Please specify other funding method)"
                      name="otherFundingMethodText"
                      rules={[validation.required]}
                    >
                      <Input
                        size="large"
                        placeholder="Unesite način finansiranja"
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
