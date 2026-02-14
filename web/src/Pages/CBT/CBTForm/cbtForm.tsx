import { useTranslation } from 'react-i18next';
import { Row, Col, Input, Button, Form, Select, Spin, message } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { FormLoadProps } from '../../../Definitions/InterfacesAndType/formInterface';
import { getValidationRules } from '../../../Utils/validationRules';
import UploadFileGrid from '../../../Components/Upload/uploadFiles';
import '../../../Styles/app.scss';

const { Option } = Select;
const { TextArea } = Input;

const gutterSize = 30;
const inputFontSize = '15px';

// Responsible institutions
const institutions = [
  'Ministry of Ecology, Sustainable Development and Northern Development',
  'Ministry of Finance',
  'Ministry of Energy and Mining',
  'Ministry of Transport',
  'Ministry of Agriculture, Forestry and Water Management',
  'Ministry of Spatial Planning, Urbanism and State Property',
  'Ministry of Health',
  'Environmental Protection Agency',
  'Water Administration',
  'Forest Administration',
  'Institute for Hydrometeorology and Seismology',
  'Investment and Development Fund',
  'Eco Fund',
  'International Partners',
];

// ETF Sector options (matching backend Sector enum)
const sectorOptions = [
  { value: 'Energy', label: 'Energy' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Industry (IPPU)', label: 'Industry (IPPU)' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Forestry', label: 'Forestry' },
  { value: 'Water and Sanitation', label: 'Water and Sanitation' },
  { value: 'Land Use', label: 'Land Use' },
  { value: 'Coastal Resilience', label: 'Coastal Resilience' },
  { value: 'Health', label: 'Health' },
  { value: 'Hazards Management', label: 'Hazards Management' },
  { value: 'Nature Based Solutions', label: 'Nature Based Solutions' },
  { value: 'Blue Economy', label: 'Blue Economy' },
  { value: 'Cross-cutting', label: 'Cross-cutting' },
  { value: 'Other', label: 'Other' },
];

// SubSector options (matching backend SubSector enum values)
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

// Generate years (e.g. from 2020 to 2030)
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

  const navigate = useNavigate();
  const { get, post, put } = useConnection();
  const { entId } = useParams();

  const validation = getValidationRules(method);

  const [loading, setLoading] = useState<boolean>(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  // Document upload state
  const [uploadedFiles, setUploadedFiles] = useState<
    { key: string; title: string; data: string }[]
  >([]);
  const [storedFiles, setStoredFiles] = useState<{ key: string; title: string; url: string }[]>([]);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  // State for showing "Other (specify)" field when Other sector is selected
  const [showOtherSectorField, setShowOtherSectorField] = useState<boolean>(false);

  // Status options (H1: planned / ongoing / completed)
  const statusOptions = [
    { value: 'Planned', label: t('cbtForm:statusPlanned') },
    { value: 'Ongoing', label: t('cbtForm:statusOngoing') },
    { value: 'Completed', label: t('cbtForm:statusCompleted') },
  ];

  // H7: Verification status options
  const verificationStatusOptions = [
    { value: 'Unverified', label: t('cbtForm:unverified') },
    { value: 'InternallyVerified', label: t('cbtForm:internallyVerified') },
    { value: 'BTRReady', label: t('cbtForm:btrReady') },
  ];

  // Yes/No options
  const yesNoOptions = [
    { value: 'Yes', label: t('cbtForm:yes') },
    { value: 'No', label: t('cbtForm:no') },
  ];

  // Type of financial support options
  const typeOfSupportOptions = [
    { value: 'Adaptation', label: t('cbtForm:adaptationType') },
    { value: 'Mitigation', label: t('cbtForm:mitigationType') },
    { value: 'CrossCutting', label: t('cbtForm:crossCuttingType') },
  ];

  const fetchCBTData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`national/cbt/${entId}`);
      if (response.data) {
        const entityData = response.data;

        // Convert years back to string for the Select component
        const formData = {
          ...entityData,
          startYear: entityData.startYear?.toString(),
          endYear: entityData.endYear?.toString(),
        };
        form.setFieldsValue(formData);

        // Show other sector field if sector is Other
        if (entityData.sector === 'Other') {
          setShowOtherSectorField(true);
        }

        // Load stored documents (backend returns parsed objects)
        if (entityData.documents?.length > 0) {
          const tempFiles: { key: string; title: string; url: string }[] = [];
          entityData.documents.forEach((document: any) => {
            tempFiles.push({
              key: document.createdTime?.toString() || document.url,
              title: document.title,
              url: document.url,
            });
          });
          setStoredFiles(tempFiles);
        }
      }
    } catch (error: any) {
      console.error('Error fetching CBT data:', error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [get, entId, form]);

  // Load data for edit/view
  useEffect(() => {
    if (entId && (method === 'update' || method === 'view')) {
      fetchCBTData();
    }
  }, [entId, method, fetchCBTData]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Prepare payload - convert years to number
      const payload: any = {
        ...values,
        startYear: parseInt(values.startYear, 10),
        endYear: parseInt(values.endYear, 10),
      };

      // Remove documents field from form values (handled separately)
      delete payload.documents;

      // Add uploaded files to payload
      if (uploadedFiles.length > 0) {
        if (method === 'create') {
          payload.documents = [];
          uploadedFiles.forEach((file) => {
            payload.documents.push({ title: file.title, data: file.data });
          });
        } else if (method === 'update') {
          payload.newDocuments = [];
          uploadedFiles.forEach((file) => {
            payload.newDocuments.push({ title: file.title, data: file.data });
          });
        }
      }

      // Add removed files to payload
      if (filesToRemove.length > 0) {
        payload.removedDocuments = [];
        filesToRemove.forEach((removedFileKey) => {
          payload.removedDocuments.push(
            storedFiles.find((file) => file.key === removedFileKey)?.url
          );
        });
      }

      if (method === 'create') {
        const response = await post('national/cbt/add', payload);
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || t('cbtForm:cbtCreationSuccess'));
          navigate('/cbt');
        }
      } else if (method === 'update') {
        const response = await put('national/cbt/update', { ...payload, id: entId });
        if (response.status === 200 || response.status === 201) {
          message.success(response.message || t('cbtForm:cbtUpdateSuccess'));
          navigate('/cbt');
        }
      }
    } catch (error: any) {
      console.error('Error saving CBT:', error);
      message.error(error.message);
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
              <div className="body-title">{t('cbtForm:basicInformation')}</div>
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
              <div className="form-section-header">{t('cbtForm:basicInformation')}</div>

              <Row gutter={gutterSize}>
                {/* Project, programme or activity name */}
                <Col span={24}>
                  <Form.Item
                    label={t('cbtForm:projectName')}
                    name="projectName"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:projectNamePlaceholder')}
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Start Year */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:startYear')}
                    name="startYear"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:startYearPlaceholder')}
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

                {/* End Year */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:endYear')}
                    name="endYear"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:endYearPlaceholder')}
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
                {/* Objectives and Description */}
                <Col span={24}>
                  <Form.Item
                    label={t('cbtForm:objectivesDescription')}
                    name="activityDescription"
                    rules={[validation.required]}
                  >
                    <TextArea
                      rows={6}
                      placeholder={t('cbtForm:objectivesDescriptionPlaceholder')}
                      disabled={isView}
                      style={{ fontSize: inputFontSize }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* National Implementing Entities */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:nationalImplementingEntities')}
                    name="nationalImplementingEntities"
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:nationalImplementingEntitiesPlaceholder')}
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

                {/* International Implementing Entities */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:internationalImplementingEntities')}
                    name="internationalImplementingEntities"
                  >
                    <Select
                      mode="tags"
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:internationalImplementingEntitiesPlaceholder')}
                      disabled={isView}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Recipient Entity */}
                <Col span={12}>
                  <Form.Item label={t('cbtForm:recipientEntity')} name="recipientEntity">
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:recipientEntityPlaceholder')}
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Activity Status */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:activityStatus')}
                    name="status"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:activityStatusPlaceholder')}
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

            {/* ETF Classification */}
            <div className="form-section-card">
              <div className="form-section-header">{t('cbtForm:etfClassification')}</div>

              <Row gutter={gutterSize}>
                {/* Sector */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:sector')}
                    name="sector"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:sectorPlaceholder')}
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

                {/* Sub-sector */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:subSector')}
                    name="subSector"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:subSectorPlaceholder')}
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

              {/* Other Sector text (shown only when Other is selected) */}
              {showOtherSectorField && (
                <Row gutter={gutterSize}>
                  <Col span={24}>
                    <Form.Item
                      label={t('cbtForm:specifyOtherSector')}
                      name="otherSectorText"
                      rules={[validation.required]}
                    >
                      <Input
                        size="large"
                        style={{ fontSize: inputFontSize }}
                        placeholder={t('cbtForm:specifyOtherSectorPlaceholder')}
                        disabled={isView}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={gutterSize}>
                {/* NDC question */}
                <Col span={24}>
                  <Form.Item
                    label={t('cbtForm:basedOnNDC')}
                    name="basedOnNDC"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:selectAnswer')}
                      disabled={isView}
                    >
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
                {/* Technology transfer contribution */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:technologyTransfer')}
                    name="technologyTransferContribution"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:selectAnswer')}
                      disabled={isView}
                    >
                      {yesNoOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Capacity building contribution */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:capacityBuilding')}
                    name="capacityBuildingContribution"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:selectAnswer')}
                      disabled={isView}
                    >
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
                {/* Type of financial support */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:typeOfSupport')}
                    name="typeOfSupport"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:typeOfSupportPlaceholder')}
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
                {/* Additional Information */}
                <Col span={24}>
                  <Form.Item
                    label={t('cbtForm:additionalInformation')}
                    name="additionalInformation"
                  >
                    <TextArea
                      rows={4}
                      placeholder={t('cbtForm:additionalInformationPlaceholder')}
                      disabled={isView}
                      style={{ fontSize: inputFontSize }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* H7: Documentation & Verification */}
            <div className="form-section-card">
              <div className="form-section-header">{t('cbtForm:documentationVerification')}</div>

              <div
                style={{ color: '#3A3541', opacity: 0.8, marginTop: '10px', marginBottom: '10px' }}
              >
                {t('cbtForm:documents')}
              </div>
              <UploadFileGrid
                isSingleColumn={false}
                usedIn={method}
                buttonText={t('cbtForm:upload')}
                storedFiles={storedFiles}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                removedFiles={filesToRemove}
                setRemovedFiles={setFilesToRemove}
                setIsSaveButtonDisabled={setIsSaveButtonDisabled}
              />

              <Row gutter={gutterSize}>
                {/* Verification Status */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:verificationStatus')}
                    name="verificationStatus"
                    initialValue="Unverified"
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:verificationStatusPlaceholder')}
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

                {/* Verification Note */}
                <Col span={12}>
                  <Form.Item
                    label={t('cbtForm:verificationNote')}
                    name="verificationNote"
                    tooltip={t('cbtForm:verificationNoteTooltip')}
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder={t('cbtForm:verificationNotePlaceholder')}
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
                {t('cbtForm:cancel')}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                onClick={() => form.submit()}
                disabled={isSaveButtonDisabled}
              >
                {method === 'create' ? t('cbtForm:create') : t('cbtForm:update')}
              </Button>
            </Col>
          </Row>
        )}

        {isView && (
          <Row justify="end" style={{ marginTop: 15, paddingRight: 30, paddingBottom: 30 }}>
            <Col>
              <Button size="large" onClick={onCancel}>
                {t('cbtForm:back')}
              </Button>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default CBTForm;
