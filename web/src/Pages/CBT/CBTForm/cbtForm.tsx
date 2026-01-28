import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadFile, UploadProps } from 'antd/lib/upload/interface';
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
  { value: 'Planned', label: 'Planirano (Planned)' },
  { value: 'Ongoing', label: 'U toku (Ongoing)' },
  { value: 'Completed', label: 'Završeno (Completed)' },
];

// H7: Status verifikacije opcije
const verificationStatusOptions = [
  { value: 'Unverified', label: 'Neprovjereno (Unverified)' },
  { value: 'InternallyVerified', label: 'Interno verifikovano (Internally Verified)' },
  { value: 'BTRReady', label: 'Spremno za BTR (BTR Ready)' },
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

  // H7: State za upload dokumenata
  const [contractFileList, setContractFileList] = useState<UploadFile[]>([]);

  // Upload props za dokumente
  const getUploadProps = (
    fileList: UploadFile[],
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  ): UploadProps => ({
    beforeUpload: (file) => {
      const isPdfOrDoc =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isPdfOrDoc) {
        message.error('Možete učitati samo PDF ili Word dokumente!');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Dokument mora biti manji od 10MB!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      setIsSaveButtonDisabled(false);
    },
    onRemove: () => {
      setIsSaveButtonDisabled(false);
    },
    maxCount: 5,
    multiple: true,
  });

  const fetchCBTData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/cbt/${entId}`);
      if (response.data) {
        // Convert reportingYear back to string for the Select component
        const formData = {
          ...response.data,
          reportingYear: response.data.reportingYear?.toString(),
        };
        form.setFieldsValue(formData);
      }
    } catch (error: any) {
      console.error('Error fetching CBT data:', error);
      message.error(error.message || 'Failed to load CBT data');
    } finally {
      setLoading(false);
    }
  }, [get, entId, form]);

  // Učitavanje podataka za edit/view
  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchCBTData();
    }
  }, [entId, method, fetchCBTData]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Prepare payload - convert reportingYear to number
      const payload = {
        ...values,
        reportingYear: parseInt(values.reportingYear, 10),
      };

      if (method === 'create') {
        const response = await post('national/cbt/add', payload);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT record created successfully');
          navigate('/cbt');
        }
      } else if (method === 'update') {
        const response = await put('national/cbt/update', { ...payload, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || 'CBT record updated successfully');
          navigate('/cbt');
        }
      }
    } catch (error: any) {
      console.error('Error saving CBT:', error);
      message.error(error.message || 'Failed to save CBT record');
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

            {/* H7: Dokumentacija i verifikacija */}
            <div className="form-section-card">
              <div className="form-section-header">
                Dokumentacija i verifikacija (Documentation & Verification)
              </div>

              <Row gutter={gutterSize}>
                {/* Dokumenti */}
                <Col span={12}>
                  <Form.Item
                    label="Dokumenti (Documents)"
                    name="documents"
                    tooltip="Učitajte relevantne dokumente vezane za projekat"
                  >
                    <Upload {...getUploadProps(contractFileList, setContractFileList)}>
                      <Button icon={<UploadOutlined />} disabled={isView}>
                        Učitaj dokument
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Status verifikacije */}
                <Col span={12}>
                  <Form.Item
                    label="Status verifikacije (Verification Status)"
                    name="verificationStatus"
                    initialValue="Unverified"
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite status verifikacije"
                      disabled={isView}
                    >
                      {verificationStatusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Napomena o verifikaciji */}
                <Col span={12}>
                  <Form.Item
                    label="Napomena o verifikaciji (Verification Note)"
                    name="verificationNote"
                    tooltip="Dodatne informacije o statusu verifikacije"
                  >
                    <Input
                      size="large"
                      placeholder="Unesite napomenu (opciono)"
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

export default CBTForm;
