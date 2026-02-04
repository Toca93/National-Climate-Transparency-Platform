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

// ETF Sector opcije (poklapaju se sa backend Sector enum)
const sectorOptions = [
  { value: 'Energy', label: 'Energija (Energy)' },
  { value: 'Transport', label: 'Transport (Transport)' },
  { value: 'Industry (IPPU)', label: 'Industrija (Industry)' },
  { value: 'Agriculture', label: 'Poljoprivreda (Agriculture)' },
  { value: 'Forestry', label: 'Šumarstvo (Forestry)' },
  { value: 'Water and Sanitation', label: 'Vodovod i kanalizacija (Water and Sanitation)' },
  { value: 'Land Use', label: 'Korišćenje zemljišta (Land Use)' },
  { value: 'Coastal Resilience', label: 'Otpornost obalnog područja (Coastal Resilience)' },
  { value: 'Health', label: 'Zdravlje (Health)' },
  { value: 'Hazards Management', label: 'Upravljanje rizicima (Hazards Management)' },
  { value: 'Nature Based Solutions', label: 'Prirodno bazirana rješenja (Nature Based Solutions)' },
  { value: 'Blue Economy', label: 'Plava ekonomija (Blue Economy)' },
  { value: 'Cross-cutting', label: 'Međusektorski (Cross-cutting)' },
  { value: 'Other', label: 'Drugo (Other)' },
];

// SubSector opcije (poklapaju se sa backend SubSector enum vrednostima)
const subSectorOptions = [
  {
    value: 'Grid-Connected Generation (electricity)',
    label: 'Grid-Connected Generation (electricity)',
  },
  {
    value: 'Off-Grid / Rural Generation (electricity)',
    label: 'Off-Grid / Rural Generation (electricity)',
  },
  {
    value: 'Transmission & Distribution (electricity)',
    label: 'Transmission & Distribution (electricity)',
  },
  { value: 'Fuels', label: 'Fuels' },
  { value: 'Government', label: 'Government' },
  { value: 'Industry', label: 'Industry' },
  { value: 'Appliances', label: 'Appliances' },
  { value: 'Water', label: 'Water' },
  { value: 'Cities', label: 'Cities' },
  { value: 'Buildings', label: 'Buildings' },
  { value: 'Land (transport)', label: 'Land (transport)' },
  { value: 'Maritime (transport)', label: 'Maritime (transport)' },
  { value: 'Aviation (transport)', label: 'Aviation (transport)' },
  { value: 'Wastewater', label: 'Wastewater' },
  { value: 'Solid Waste', label: 'Solid Waste' },
  { value: 'Forestry', label: 'Forestry' },
  { value: 'Agroforestry', label: 'Agroforestry' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Land Use', label: 'Land Use' },
  { value: 'Coastal', label: 'Coastal' },
  { value: 'Fishing', label: 'Fishing' },
  { value: 'Biodiversity', label: 'Biodiversity' },
  { value: 'Ecosystems', label: 'Ecosystems' },
  { value: 'Nature Based Solutions', label: 'Nature Based Solutions' },
  { value: 'Tourism', label: 'Tourism' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Households', label: 'Households' },
  { value: 'Food systems', label: 'Food systems' },
  { value: 'Multi-Subsector', label: 'Multi-Subsector' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

// Da/Ne opcije
const yesNoOptions = [
  { value: 'Yes', label: 'Da (Yes)' },
  { value: 'No', label: 'Ne (No)' },
];

// Tip finansijske podrške opcije (Adaptation, Mitigation, Cross-cutting)
const typeOfSupportOptions = [
  { value: 'Adaptation', label: 'Adaptacija' },
  { value: 'Mitigation', label: 'Mitigacija' },
  { value: 'CrossCutting', label: 'Međusektorski' },
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

  // State za prikaz polja "Other (specify)" kada je izabran Other sector
  const [showOtherSectorField, setShowOtherSectorField] = useState<boolean>(false);

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
        // Convert years back to string for the Select component
        const formData = {
          ...response.data,
          startYear: response.data.startYear?.toString(),
          endYear: response.data.endYear?.toString(),
        };
        form.setFieldsValue(formData);

        // Show other sector field if sector is Other
        if (response.data.sector === 'Other') {
          setShowOtherSectorField(true);
        }
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
      // Prepare payload - convert years to number
      const payload = {
        ...values,
        startYear: parseInt(values.startYear, 10),
        endYear: parseInt(values.endYear, 10),
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
                {/* Naziv projekta, programa ili aktivnosti */}
                <Col span={24}>
                  <Form.Item
                    label="Naziv projekta, programa ili aktivnosti (Project, program or activity name)"
                    name="projectName"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      placeholder="Unesite naziv projekta, programa ili aktivnosti"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Godina početka */}
                <Col span={12}>
                  <Form.Item
                    label="Godina početka (Start Year)"
                    name="startYear"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite godinu početka"
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

                {/* Godina završetka */}
                <Col span={12}>
                  <Form.Item
                    label="Godina završetka (End Year)"
                    name="endYear"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite godinu završetka"
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
                {/* Ciljevi i opis */}
                <Col span={24}>
                  <Form.Item
                    label="Ciljevi i opis (Objectives and description)"
                    name="activityDescription"
                    rules={[validation.required]}
                  >
                    <TextArea rows={6} placeholder="Unesite ciljeve i opis" disabled={isView} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Nadležna institucija - Implementing entity */}
                <Col span={12}>
                  <Form.Item
                    label="Nadležna institucija (Implementing entity)"
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

                {/* Primalac sredstava - Recipient entity */}
                <Col span={12}>
                  <Form.Item label="Primalac sredstava (Recipient entity)" name="recipientEntity">
                    <Input
                      size="large"
                      placeholder="Unesite primaoca sredstava"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Status aktivnosti */}
                <Col span={12}>
                  <Form.Item
                    label="Status aktivnosti (Status of activity)"
                    name="status"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite status aktivnosti"
                      disabled={isView}
                    >
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

            {/* ETF klasifikacija */}
            <div className="form-section-card">
              <div className="form-section-header">ETF klasifikacija (ETF Classification)</div>

              <Row gutter={gutterSize}>
                {/* Sektor */}
                <Col span={12}>
                  <Form.Item label="Sektor (Sector)" name="sector" rules={[validation.required]}>
                    <Select
                      size="large"
                      placeholder="Izaberite sektor"
                      showSearch
                      disabled={isView}
                      onChange={(value) => {
                        setShowOtherSectorField(value === 'Other');
                        if (value !== 'Other') {
                          form.setFieldsValue({ otherSectorText: undefined });
                        }
                      }}
                    >
                      {sectorOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Podsektor */}
                <Col span={12}>
                  <Form.Item
                    label="Podsektor (Subsector)"
                    name="subSector"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite podsektor"
                      showSearch
                      disabled={isView}
                      mode="multiple"
                      allowClear
                    >
                      {subSectorOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Other Sector tekst (prikazuje se samo ako je izabran Other) */}
              {showOtherSectorField && (
                <Row gutter={gutterSize}>
                  <Col span={24}>
                    <Form.Item
                      label="Navedite drugi sektor (Please specify other sector)"
                      name="otherSectorText"
                      rules={[validation.required]}
                    >
                      <Input size="large" placeholder="Unesite naziv sektora" disabled={isView} />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={gutterSize}>
                {/* NDC pitanje */}
                <Col span={24}>
                  <Form.Item
                    label="Da li je aktivnost zasnovana na nacionalnoj strategiji i/ili NDC-u?"
                    name="basedOnNDC"
                    rules={[validation.required]}
                  >
                    <Select size="large" placeholder="Izaberite odgovor" disabled={isView}>
                      {yesNoOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Doprinos transferu tehnologija */}
                <Col span={12}>
                  <Form.Item
                    label="Doprinos ciljevima razvoja i transfera tehnologija?"
                    name="technologyTransferContribution"
                    rules={[validation.required]}
                  >
                    <Select size="large" placeholder="Izaberite odgovor" disabled={isView}>
                      {yesNoOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Doprinos jačanju kapaciteta */}
                <Col span={12}>
                  <Form.Item
                    label="Doprinos ciljevima jačanja kapaciteta?"
                    name="capacityBuildingContribution"
                    rules={[validation.required]}
                  >
                    <Select size="large" placeholder="Izaberite odgovor" disabled={isView}>
                      {yesNoOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Tip finansijske podrške */}
                <Col span={12}>
                  <Form.Item
                    label="Tip finansijske podrške (Type of support)"
                    name="typeOfSupport"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      placeholder="Izaberite tip finansijske podrške"
                      disabled={isView}
                    >
                      {typeOfSupportOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
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
                    <TextArea
                      rows={4}
                      placeholder="Unesite dodatne informacije (opciono)"
                      disabled={isView}
                    />
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
