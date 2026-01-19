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

// Izvori finansiranja (Funding Sources)
const fundingSources = [
  { value: 'national-budget', label: 'Nacionalni budžet (National Budget)' },
  { value: 'international-fund', label: 'Međunarodni fond (International Fund)' },
  { value: 'bilateral-aid', label: 'Bilateralna pomoć (Bilateral Aid)' },
  { value: 'private-sector', label: 'Privatni sektor (Private Sector)' },
];

// Nazivi fondova (Fund Names)
const fundNames = [
  { value: 'gcf', label: 'GCF (Green Climate Fund)' },
  { value: 'gef', label: 'GEF (Global Environment Facility)' },
  { value: 'eu-ipa', label: 'EU IPA' },
  { value: 'ebrd', label: 'EBRD (European Bank for Reconstruction and Development)' },
  { value: 'world-bank', label: 'World Bank' },
  { value: 'undp', label: 'UNDP' },
  { value: 'unep', label: 'UNEP' },
  { value: 'eib', label: 'EIB (European Investment Bank)' },
  { value: 'kfw', label: 'KfW' },
  { value: 'other', label: 'Ostalo (Other)' },
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

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTFundingForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Izvori finansiranja';

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [cbtProjectList, setCbtProjectList] = useState<CBTProjectData[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

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
                {/* Izvor finansiranja */}
                <Col span={12}>
                  <Form.Item
                    label="Izvor finansiranja (Funding Source)"
                    name="fundingSource"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite izvor finansiranja"
                      disabled={isView}
                    >
                      {fundingSources.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Naziv fonda */}
                <Col span={12}>
                  <Form.Item label="Naziv fonda (Fund Name)" name="fundName">
                    <Select
                      size="large"
                      placeholder="Izaberite naziv fonda"
                      disabled={isView}
                      allowClear
                    >
                      {fundNames.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Donatorska institucija */}
                <Col span={12}>
                  <Form.Item
                    label="Donatorska institucija (Donor Institution)"
                    name="donorInstitution"
                  >
                    <Input
                      size="large"
                      placeholder="Unesite naziv donatorske institucije"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>

                {/* Godina odobrenja */}
                <Col span={12}>
                  <Form.Item label="Godina odobrenja (Approval Year)" name="approvalYear">
                    <Select
                      size="large"
                      placeholder="Izaberite godinu odobrenja"
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
