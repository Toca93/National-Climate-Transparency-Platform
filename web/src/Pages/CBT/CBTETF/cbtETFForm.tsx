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

// Tip finansiranja (Financing Type)
const financingTypes = [
  { value: 'mitigation', label: 'Mitigation' },
  { value: 'adaptation', label: 'Adaptation' },
  { value: 'cross-cutting', label: 'Cross-cutting' },
];

// Veza sa NDC mjerom (Link with NDC measure)
const ndcLinkOptions = [
  { value: 'yes', label: 'Da (Yes)' },
  { value: 'no', label: 'Ne (No)' },
];

// Sektori (Sectors)
const sectors = [
  { value: 'energy', label: 'Energetika (Energy)' },
  { value: 'transport', label: 'Saobraćaj (Transport)' },
  { value: 'agriculture', label: 'Poljoprivreda (Agriculture)' },
  { value: 'waste', label: 'Otpad (Waste)' },
  { value: 'forestry', label: 'Šumarstvo (Forestry)' },
  { value: 'water-coast', label: 'Vode / obala (Water / Coast)' },
];

// Interface za projekte iz Osnovnih informacija (CBT)
interface CBTProjectData {
  id: string;
  projectName: string;
}

const CBTETFForm: React.FC<FormLoadProps> = ({ method }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'ETF klasifikacija';

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
      // const response = await get(`cbt-etf/${entId}`);
      // form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching ETF data:', error);
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
        console.log('Create ETF:', values);
      } else if (method === 'update') {
        // TODO: Implementirati API poziv
        console.log('Update ETF:', values);
      }
      navigate('/cbt-etf');
    } catch (error) {
      console.error('Error saving ETF:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/cbt-etf');
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
              <div className="form-section-header">Klasifikacija po ETF pravilima</div>

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
                      {cbtProjectList.map((project) => (
                        <Option key={project.id} value={project.id}>
                          {project.projectName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Tip finansiranja */}
                <Col span={12}>
                  <Form.Item
                    label="Tip finansiranja (Financing Type)"
                    name="financingType"
                    rules={[validation.required]}
                  >
                    <Select size="large" placeholder="Izaberite tip finansiranja" disabled={isView}>
                      {financingTypes.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Veza sa NDC mjerom */}
                <Col span={12}>
                  <Form.Item
                    label="Veza sa NDC mjerom (NDC Measure Link)"
                    name="ndcLink"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite da li postoji veza sa NDC"
                      disabled={isView}
                    >
                      {ndcLinkOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Sektor */}
                <Col span={12}>
                  <Form.Item label="Sektor (Sector)" name="sector" rules={[validation.required]}>
                    <Select size="large" placeholder="Izaberite sektor" disabled={isView}>
                      {sectors.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
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

export default CBTETFForm;
