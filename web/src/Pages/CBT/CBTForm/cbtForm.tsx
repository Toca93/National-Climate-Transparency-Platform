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

// Status options (H1: planned / ongoing / completed)
const statusOptions = [
  { value: 'Planned', label: 'Planned' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Completed', label: 'Completed' },
];

// H7: Verification status options
const verificationStatusOptions = [
  { value: 'Unverified', label: 'Unverified' },
  { value: 'InternallyVerified', label: 'Internally Verified' },
  { value: 'BTRReady', label: 'BTR Ready' },
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

// Yes/No options
const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

// Type of financial support options (Adaptation, Mitigation, Cross-cutting)
const typeOfSupportOptions = [
  { value: 'Adaptation', label: 'Adaptation' },
  { value: 'Mitigation', label: 'Mitigation' },
  { value: 'CrossCutting', label: 'Cross-cutting' },
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
  useTranslation(['cbtForm', 'common', 'entityAction', 'formHeader']);

  const isView: boolean = method === 'view';
  const formTitle = 'Basic Information';

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
      message.error(error.message || 'Failed to load CBT data');
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
              <div className="form-section-header">Basic Information</div>

              <Row gutter={gutterSize}>
                {/* Project, programme or activity name */}
                <Col span={24}>
                  <Form.Item
                    label="Project, Programme or Activity Name"
                    name="projectName"
                    rules={[validation.required]}
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter project, programme or activity name"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Start Year */}
                <Col span={12}>
                  <Form.Item label="Start Year" name="startYear" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select start year"
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
                  <Form.Item label="End Year" name="endYear" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select end year"
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
                    label="Objectives and Description"
                    name="activityDescription"
                    rules={[validation.required]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Enter objectives and description"
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
                    label="National Implementing Entity(ies)"
                    name="nationalImplementingEntities"
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select national entities"
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
                    label="International Implementing Entity(ies)"
                    name="internationalImplementingEntities"
                  >
                    <Select
                      mode="tags"
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter international entities"
                      disabled={isView}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Recipient Entity */}
                <Col span={12}>
                  <Form.Item label="Recipient Entity" name="recipientEntity">
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter recipient entity"
                      disabled={isView}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={gutterSize}>
                {/* Activity Status */}
                <Col span={12}>
                  <Form.Item label="Activity Status" name="status" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select activity status"
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
              <div className="form-section-header">ETF Classification</div>

              <Row gutter={gutterSize}>
                {/* Sector */}
                <Col span={12}>
                  <Form.Item label="Sector" name="sector" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select sector"
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
                  <Form.Item label="Sub-sector" name="subSector" rules={[validation.required]}>
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select sub-sector"
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
                      label="Specify Other Sector"
                      name="otherSectorText"
                      rules={[validation.required]}
                    >
                      <Input
                        size="large"
                        style={{ fontSize: inputFontSize }}
                        placeholder="Enter sector name"
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
                    label="Is the activity based on a national strategy and/or NDC?"
                    name="basedOnNDC"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select answer"
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
                    label="Contribution to technology development and transfer objectives?"
                    name="technologyTransferContribution"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select answer"
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
                    label="Contribution to capacity building objectives?"
                    name="capacityBuildingContribution"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select answer"
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
                    label="Type of Financial Support"
                    name="typeOfSupport"
                    rules={[validation.required]}
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select type of financial support"
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
                  <Form.Item label="Additional Information" name="additionalInformation">
                    <TextArea
                      rows={4}
                      placeholder="Enter additional information (optional)"
                      disabled={isView}
                      style={{ fontSize: inputFontSize }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* H7: Documentation & Verification */}
            <div className="form-section-card">
              <div className="form-section-header">Documentation & Verification</div>

              <div
                style={{ color: '#3A3541', opacity: 0.8, marginTop: '10px', marginBottom: '10px' }}
              >
                Documents
              </div>
              <UploadFileGrid
                isSingleColumn={false}
                usedIn={method}
                buttonText="Upload"
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
                    label="Verification Status"
                    name="verificationStatus"
                    initialValue="Unverified"
                  >
                    <Select
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Select verification status"
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
                    label="Verification Note"
                    name="verificationNote"
                    tooltip="Additional information about verification status"
                  >
                    <Input
                      size="large"
                      style={{ fontSize: inputFontSize }}
                      placeholder="Enter note (optional)"
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
