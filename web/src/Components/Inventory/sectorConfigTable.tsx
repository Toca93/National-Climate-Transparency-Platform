import { Button, Col, message, Radio, Row, Table, TableProps } from 'antd';
import './baselineForm.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { ReportSector } from '../../Enums/report.sector.enum';
import { ProjectionSections } from '../../Enums/projection.enum';
import {
  nonLeafSections,
  projectionSectionOrder,
  SectionOpen,
} from '../../Definitions/projectionsDefinitions';
import { getCollapseIcon } from '../../Utils/utilServices';
import { ConfigurationSettingsType } from '../../Enums/configuration.enum';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';
import { IpccSubSector } from '../../Enums/ipcc.subsector.enum';

type DataEntry = {
  key: string;
  topicId: string;
  subSector: string;
};

const getDefaultSectorMapping = (): Record<string, string> => {
  const sectormapping: Record<string, string> = {};
  Object.entries(IpccSubSector).forEach(([key, value]) => {
    sectormapping[key] = key.startsWith('1')
      ? ReportSector.ENERGY
      : key.startsWith('2')
      ? ReportSector.INDUSTRIAL_PROCESSES
      : key.startsWith('3')
      ? ReportSector.AGRICULTURE
      : key.startsWith('4')
      ? ReportSector.WASTE
      : ReportSector.OTHER;
  });
  return sectormapping;
};

const SectorConfigTable = () => {
  const { t } = useTranslation(['projection', 'configuration', 'entityAction']);
  const { get, post } = useConnection();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [isSectionOpen, setIsSectionOpen] = useState<SectionOpen>({
    [ProjectionSections.ENERGY]: false,
    [ProjectionSections.INDUSTRY]: false,
    [ProjectionSections.AGR_FOR_OTH_LAND]: false,
    [ProjectionSections.WASTE]: false,
    [ProjectionSections.OTHER]: false,
  });

  useEffect(() => {
    const fetchSectorConfig = async () => {
      setIsLoading(true);
      try {
        const response = await get(
          `national/settings/${ConfigurationSettingsType.ANNEX_II_REPORT_CATEGORIES}`
        );

        if (response.status === 200 || response.status === 201) {
          // Merge with default mapping to ensure all subsectors have values
          const defaultMapping = getDefaultSectorMapping();
          setSelectedCategories({ ...defaultMapping, ...response.data });
        }
      } catch (error: any) {
        console.error('Failed to fetch sector mapping configuration', error);
        if (error?.status === 404) {
          message.open({
            type: 'info',
            content: t('sectorMappingNotFound'),
            duration: 8,
            style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
          });
          // If no configuration exists, initialize with default values
          const defaultMapping = getDefaultSectorMapping();
          setSelectedCategories(defaultMapping);
          message.open({
            type: 'info',
            content: t('loadingDraftSectorMapping'),
            duration: 8,
            style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSectorConfig();
    }, 200);
    return () => clearTimeout(debounceTimeout);
  }, []);

  useEffect(() => {
    console.log(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryChange = (subSector: string, category: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [subSector]: category,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate an API call to save the new configuration
      console.log('Saving data:');
      const reqBody = {
        id: ConfigurationSettingsType.ANNEX_II_REPORT_CATEGORIES,
        settingValue: selectedCategories,
      };
      const response = await post(`national/settings/update`, reqBody);
      if (response.status === 200 || response.status === 201) {
        console.log('Sector configuration updated successfully');
        message.open({
          type: 'success',
          content: t('sectorMappingUpdateSuccess'),
          duration: 5,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
      }
    } catch (error) {
      console.error('Failed to update sector configuration', error);
      displayErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sectorConfigColumns: TableProps<any>['columns'] = [
    {
      dataIndex: 'topicId',
      align: 'center',
      ellipsis: true,
      fixed: 'left',
      width: 50,
      render: (colValue: string) => {
        if (colValue.length === 1) {
          const currentSection: ProjectionSections = colValue as ProjectionSections;
          return getCollapseIcon(isSectionOpen[currentSection], () => {
            setIsSectionOpen((prevState) => ({
              ...prevState,
              [currentSection]: !prevState[currentSection],
            }));
          });
        } else {
          return null;
        }
      },
    },
    {
      dataIndex: 'topicId',
      align: 'left',
      width: 400,
      fixed: 'left',
      render: (colValue: any) => {
        return (
          <div style={{ marginLeft: `${(colValue.length - 1) * 20}px` }}>
            <span>
              {colValue}
              {'\u00A0'.repeat(3)}
              {t(`${colValue}_title`)}
            </span>
          </div>
        );
      },
    },
    ...Object.entries(ReportSector).map(([key, sector]) => ({
      title: sector,
      dataIndex: sector,
      key: key,
      align: 'center' as const,
      render: (_: any, record: { key: string; subSector: string }) => {
        if (nonLeafSections.includes(record.subSector)) {
          return null;
        } else {
          return (
            <Radio
              checked={(selectedCategories[record.subSector] || '') === sector}
              onChange={() => handleCategoryChange(record.subSector, sector)}
            />
          );
        }
      },
      width: 150,
    })),
  ];

  const sectorConfigData: Array<DataEntry> = [];

  Object.values(projectionSectionOrder).forEach((section) => {
    const tempList: Array<DataEntry> = [];
    section.forEach((node) => {
      tempList.push({
        key: `${node}_visible_init`,
        topicId: node,
        subSector: node,
      });
    });
    sectorConfigData.push(...tempList);
  });

  const controlledSectorConfigData: Array<DataEntry> = useMemo(() => {
    return sectorConfigData.filter(
      (item) =>
        item.topicId.length === 1 ||
        isSectionOpen[item.topicId.slice(0, 1) as ProjectionSections] === true
    );
  }, [isSectionOpen]);

  return (
    <div className="baseline-form">
      <Row className="baseline-timeline">
        <Col span={24}>
          <Table
            loading={isLoading}
            dataSource={controlledSectorConfigData}
            columns={sectorConfigColumns}
            pagination={false}
            scroll={{ y: 12 * 50 }}
          />
        </Col>
      </Row>

      <Row gutter={20} className="action-row" justify={'end'} style={{ marginTop: '20px' }}>
        <Col>
          <Button
            type="primary"
            style={{ height: '35px', width: '90px' }}
            block
            onClick={handleUpdate}
            loading={isLoading}
          >
            {t('entityAction:update')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SectorConfigTable;
