import { useEffect, useState } from 'react';
import { Row, Col, Table, TableProps, InputNumber, Button, message } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './projectionParameters.scss';
import { useTranslation } from 'react-i18next';
import '../../Pages/Configurations/configurations.scss';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { displayErrorMessage } from '../../Utils/errorMessageHandler';
import { ConfigurationSettingsType } from '../../Enums/configuration.enum';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';
import { Role } from '../../Enums/role.enum';

// Enum for parameter IDs
export enum ProjectionParameterId {
  GDP_EUR = 'gdp_eur',
  POPULATION = 'population',
  FUEL_PRICES = 'fuel_prices',
  FUEL_BMB95 = 'fuel_bmb95',
  FUEL_BMB98 = 'fuel_bmb98',
  FUEL_EURODIZEL = 'fuel_eurodizel',
  FUEL_LOZ_ULJE = 'fuel_loz_ulje',
  FUEL_LPG = 'fuel_lpg',
  FUEL_PLINSKO_ULJE = 'fuel_plinsko_ulje',
}

// Parameter row definition
interface ParameterRow {
  key: string;
  id: ProjectionParameterId;
  name: string;
  isGroup?: boolean;
  parentId?: ProjectionParameterId;
}

// Fixed parameter rows
const PARAMETER_ROWS: ParameterRow[] = [
  { key: '1', id: ProjectionParameterId.GDP_EUR, name: 'BDP (€)' },
  { key: '2', id: ProjectionParameterId.POPULATION, name: 'Broj stanovnika' },
  {
    key: '3',
    id: ProjectionParameterId.FUEL_PRICES,
    name: 'Cijene goriva (€)',
    isGroup: true,
  },
  {
    key: '3.1',
    id: ProjectionParameterId.FUEL_BMB95,
    name: 'Eurosuper 95 (BMB 95)',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
  {
    key: '3.2',
    id: ProjectionParameterId.FUEL_BMB98,
    name: 'Eurosuper 98 (BMB 98)',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
  {
    key: '3.3',
    id: ProjectionParameterId.FUEL_EURODIZEL,
    name: 'Eurodizel',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
  {
    key: '3.4',
    id: ProjectionParameterId.FUEL_LOZ_ULJE,
    name: 'Lož ulje (ekstra lako / lako)',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
  {
    key: '3.5',
    id: ProjectionParameterId.FUEL_LPG,
    name: 'TNG / LPG (autogas)',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
  {
    key: '3.6',
    id: ProjectionParameterId.FUEL_PLINSKO_ULJE,
    name: 'Plinsko ulje',
    parentId: ProjectionParameterId.FUEL_PRICES,
  },
];

// Generate years from 2000 to current year
const generateYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = 2000; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

const YEARS = generateYears();

export const ProjectionParameters: React.FC = () => {
  const [isFuelGroupOpen, setIsFuelGroupOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parametersData, setParametersData] = useState<
    Record<string, Record<number, number | null>>
  >({});
  const { t } = useTranslation(['configuration', 'entityAction']);
  const { get, post } = useConnection();
  const { userInfoState } = useUserContext();

  // Fetch existing data on component load
  useEffect(() => {
    const fetchParameters = async () => {
      setIsLoading(true);
      try {
        const response = await get(
          `national/settings/${ConfigurationSettingsType.PROJECTION_PARAMETERS}`
        );

        if (response.status === 200 || response.status === 201) {
          setParametersData(response.data || {});
        }
      } catch (error: any) {
        console.error('Failed to fetch projection parameters', error);
        if (error?.status === 404) {
          // No existing data, start with empty state
          setParametersData({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchParameters();
    }, 200);
    return () => clearTimeout(debounceTimeout);
  }, []);

  // Filter visible rows based on fuel group state
  const visibleRows = PARAMETER_ROWS.filter(
    (row) =>
      !row.parentId || (row.parentId === ProjectionParameterId.FUEL_PRICES && isFuelGroupOpen)
  );

  // Column definitions
  const columns: TableProps<ParameterRow>['columns'] = [
    {
      dataIndex: 'isGroup',
      align: 'center',
      fixed: 'left',
      width: 50,
      render: (_isGroup: boolean, record: ParameterRow) => {
        if (record.isGroup) {
          return isFuelGroupOpen ? (
            <MinusCircleOutlined
              className="collapse-icon"
              onClick={() => setIsFuelGroupOpen(false)}
              style={{ color: '#0468B1', fontSize: '14px' }}
            />
          ) : (
            <PlusCircleOutlined
              className="collapse-icon"
              onClick={() => setIsFuelGroupOpen(true)}
              style={{ color: '#0468B1', fontSize: '14px' }}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Parameter',
      dataIndex: 'name',
      align: 'left',
      width: 300,
      fixed: 'left',
      render: (name: string, record: ParameterRow) => {
        const indent = record.parentId ? 20 : 0;
        const isGroup = record.isGroup;
        return (
          <div style={{ marginLeft: `${indent}px`, fontWeight: isGroup ? 600 : 400 }}>{name}</div>
        );
      },
    },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const reqBody = {
        id: ConfigurationSettingsType.PROJECTION_PARAMETERS,
        settingValue: parametersData,
      };
      const response: any = await post('national/settings/update', reqBody);

      if (response.status === 200 || response.status === 201) {
        message.open({
          type: 'success',
          content: t('configuration:projectionParametersUpdateSuccess'),
          duration: 3,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
      }
    } catch (error: any) {
      displayErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add year columns
  YEARS.forEach((year) => {
    columns.push({
      title: year.toString(),
      dataIndex: 'id',
      width: 150,
      align: 'center',
      render: (_id: string, record: ParameterRow) => {
        if (record.isGroup) {
          return null;
        }
        return (
          <InputNumber
            controls={false}
            className="leaf-input-box"
            value={parametersData[record.id]?.[year] ?? null}
            onChange={(value) => {
              setParametersData((prev) => ({
                ...prev,
                [record.id]: {
                  ...prev[record.id],
                  [year]: value,
                },
              }));
            }}
          />
        );
      },
    });
  });

  return (
    <div className="configuration-section-card projection-parameters">
      <div className="form-section-header sectors">
        {t('configuration:projectionParametersTitle')}
      </div>
      <div className="form-section-subheader">
        {t('configuration:projectionParametersDescription')}
      </div>

      <Row className="parameters-table-container">
        <Col span={24}>
          <Table
            loading={isLoading}
            dataSource={visibleRows}
            columns={columns}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowClassName={(record) => (record.isGroup ? 'group-row' : '')}
          />
        </Col>
      </Row>

      {userInfoState?.userRole === Role.Root && (
        <Row gutter={20} className="action-row" justify={'end'} style={{ marginTop: '20px' }}>
          <Col>
            <Button
              type="primary"
              style={{ height: '35px', width: '90px' }}
              block
              onClick={handleSave}
              loading={isLoading}
            >
              {t('entityAction:update')}
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
