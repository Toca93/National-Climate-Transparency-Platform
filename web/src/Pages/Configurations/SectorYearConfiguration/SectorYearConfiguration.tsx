import { Button, Form, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { ConfigurationSettingsType } from '../../../Enums/configuration.enum';

const SectorYearConfiguration = () => {
  const { t } = useTranslation(['configuration']);
  const [form] = Form.useForm();
  const { get, post } = useConnection();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(
          `national/settings/${ConfigurationSettingsType.SECTOR_YEAR_CONFIGURATION}`
        );
        if (response.status === 200) {
          const data = response.data;
          form.setFieldsValue({
            mostRecentYear: data.mostRecentYear,
            projectionYear1: data.projectionYear1,
            projectionYear2: data.projectionYear2,
            projectionYear3: data.projectionYear3,
          });
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          message.info(t('sectorYearConfigurationNotFound'), 3);
        }
      }
    };

    fetchData();
  }, [form]);

  const initialValues = {
    mostRecentYear: 2000,
    projectionYear1: 2000,
    projectionYear2: 2000,
    projectionYear3: 2000,
  };
  const onFinish = (values: any) => {
    console.log('Form Values:', values);
    post('national/settings/update', {
      id: ConfigurationSettingsType.SECTOR_YEAR_CONFIGURATION,
      settingValue: {
        mostRecentYear: values.mostRecentYear,
        projectionYear1: values.projectionYear1,
        projectionYear2: values.projectionYear2,
        projectionYear3: values.projectionYear3,
      },
    })
      .then(() => {
        console.log('Sector year configuration updated successfully');
        message.success(t('sectorYearConfigurationUpdateSuccess'), 3);
      })
      .catch((error) => {
        console.error('Error updating sector year configuration:', error);
        message.error(t('sectorYearConfigurationUpdateError'), 3);
      });
  };

  return (
    <div>
      <div className="form-section-subheader">{t('sectorYearConfigurationDescription')}</div>
      <Form onFinish={onFinish} form={form} initialValues={initialValues}>
        <Form.Item
          label={
            <label className="form-item-header" style={{ width: '200px', textAlign: 'left' }}>
              {t('sectorMostRecentYear')}
            </label>
          }
          name="mostRecentYear"
        >
          <InputNumber min={2000} max={2050} className="form-input-box" />
        </Form.Item>
        <Form.Item
          label={
            <label className="form-item-header" style={{ width: '200px', textAlign: 'left' }}>
              {t('sectorProjectionYear1')}
            </label>
          }
          name="projectionYear1"
        >
          <InputNumber min={2000} max={2050} className="form-input-box" />
        </Form.Item>
        <Form.Item
          label={
            <label className="form-item-header" style={{ width: '200px', textAlign: 'left' }}>
              {t('sectorProjectionYear2')}
            </label>
          }
          name="projectionYear2"
        >
          <InputNumber min={2000} max={2050} className="form-input-box" />
        </Form.Item>
        <Form.Item
          label={
            <label className="form-item-header" style={{ width: '200px', textAlign: 'left' }}>
              {t('sectorProjectionYear3')}
            </label>
          }
          name="projectionYear3"
        >
          <InputNumber min={2000} max={2050} className="form-input-box" />
        </Form.Item>
        <Form.Item className="form-item-submit">
          <Button type="primary" block htmlType="submit" className="sector-years-save-button">
            {t('entityAction:update')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SectorYearConfiguration;
