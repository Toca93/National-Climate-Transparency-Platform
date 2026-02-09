import { useTranslation } from 'react-i18next';
import '../../../Styles/app.scss';
import LayoutTable from '../../../Components/common/Table/layout.table';
import {
  Button,
  Col,
  Row,
  Input,
  Dropdown,
  Popover,
  List,
  Typography,
  MenuProps,
  message,
} from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import {
  addActionBps,
  filterDropdownBps,
  listSearchBarBps,
  searchBoxBps,
} from '../../../Definitions/breakpoints/breakpoints';

interface Item {
  id: string;
  projectId: string;
  projectName: string;
  year: number;
  currency: string;
  gdp: number;
  climateFinanceShareGdp: number;
  climateFinanceShareBudget: number;
}

const CBTMacroList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'tableAction']);
  const { post } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [tempSearchValue, setTempSearchValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  // Action menu content
  const actionMenuContent = (record: Item) => (
    <List
      className="action-menu"
      size="small"
      dataSource={[
        {
          text: t('tableAction:View'),
          icon: <InfoCircleOutlined style={{ color: '#8A1538' }} />,
          click: () => navigate(`/cbt-macro/view/${record.id}`),
        },
        {
          text: t('tableAction:Edit'),
          icon: <EditOutlined style={{ color: '#8A1538' }} />,
          click: () => navigate(`/cbt-macro/edit/${record.id}`),
        },
      ]}
      renderItem={(item) => (
        <List.Item onClick={item.click} style={{ cursor: 'pointer' }}>
          <Typography.Text className="action-icon">{item.icon}</Typography.Text>
          <span>{item.text}</span>
        </List.Item>
      )}
    />
  );

  // Fetch CBT Macro data
  const fetchData = async (page: number, size: number, search?: string) => {
    setLoading(true);
    try {
      const payload: any = {
        page: page,
        size: size,
        sort: {
          key: 'id',
          order: 'DESC',
        },
      };

      if (search) {
        payload.filterAnd = [
          {
            key: 'projectId',
            operation: 'like',
            value: `%${search}%`,
          },
        ];
      }

      const response: any = await post('national/cbt-macro/query', payload);

      if (response.data) {
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          projectId: item.projectId,
          projectName: item.cbt?.projectName || '-',
          year: item.year,
          currency: item.currency,
          gdp: item.gdp,
          climateFinanceShareGdp: item.climateFinanceShareGdp,
          climateFinanceShareBudget: item.climateFinanceShareBudget,
        }));
        setTableData(formattedData);
        setTotalRowCount(response.total || response.data.length);
      }
    } catch (error: any) {
      console.error('Error fetching CBT Macro data:', error);
      message.error(error.message || 'Failed to load CBT Macro data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when pagination/search changes
  useEffect(() => {
    fetchData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSearch = () => {
    setSearchValue(tempSearchValue);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'ID',
      width: 120,
      dataIndex: 'id',
      key: 'id',
      sorter: false,
      render: (id: string) => (
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => navigate(`/cbt-macro/view/${id}`)}
        >
          {id}
        </span>
      ),
    },
    {
      title: 'Project ID',
      width: 150,
      dataIndex: 'projectId',
      key: 'projectId',
      sorter: false,
      render: (projectId: string) => (
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => navigate(`/cbt/view/${projectId}`)}
        >
          {projectId}
        </span>
      ),
    },
    {
      title: 'Project Name',
      width: 200,
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: false,
    },
    {
      title: 'Year',
      width: 80,
      dataIndex: 'year',
      key: 'year',
      sorter: false,
    },
    {
      title: 'Currency',
      width: 80,
      dataIndex: 'currency',
      key: 'currency',
      sorter: false,
    },
    {
      title: 'GDP (EUR)',
      width: 150,
      dataIndex: 'gdp',
      key: 'gdp',
      sorter: false,
      render: (value: number | string) => (value ? Number(value).toLocaleString('de-DE') : '-'),
    },
    {
      title: 'Share of GDP (%)',
      width: 130,
      dataIndex: 'climateFinanceShareGdp',
      key: 'climateFinanceShareGdp',
      sorter: false,
      render: (value: number | string) => (value ? `${Number(value).toFixed(2)}%` : '-'),
    },
    {
      title: 'Share of Budget (%)',
      width: 130,
      dataIndex: 'climateFinanceShareBudget',
      key: 'climateFinanceShareBudget',
      sorter: false,
      render: (value: number | string) => (value ? `${Number(value).toFixed(2)}%` : '-'),
    },
    {
      title: '',
      key: 'actions',
      align: 'right' as const,
      width: 50,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_: any, record: Item) => (
        <Popover
          showArrow={false}
          trigger={'click'}
          placement="bottomRight"
          content={actionMenuContent(record)}
        >
          <EllipsisOutlined
            rotate={90}
            style={{ fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
          />
        </Popover>
      ),
    },
  ];

  const items: MenuProps['items'] = [];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">Climate Financing - Macro Indicators</div>
      </div>
      <div className="content-card">
        <Row className="table-actions-section">
          <Col {...addActionBps}>
            <div className="action-bar">
              <Button
                type="primary"
                size="large"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  navigate('/cbt-macro/add');
                }}
              >
                Add New Record
              </Button>
            </div>
          </Col>
          <Col {...listSearchBarBps}>
            <Row gutter={10}>
              <Col {...searchBoxBps} className="search-bar">
                <Input
                  addonAfter={<SearchOutlined style={{ color: '#615d67' }} onClick={onSearch} />}
                  placeholder="Search by ID or project name"
                  allowClear
                  onPressEnter={onSearch}
                  onChange={(e) => setTempSearchValue(e.target.value)}
                  style={{ width: 265 }}
                  value={tempSearchValue}
                />
              </Col>
              <Col {...filterDropdownBps} className="filter-bar">
                <Dropdown
                  arrow={false}
                  placement="bottomRight"
                  trigger={['click']}
                  menu={{ items }}
                  overlayStyle={{ width: '240px' }}
                >
                  <FilterOutlined
                    style={{
                      color: '#615d67',
                      fontSize: '20px',
                    }}
                  />
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <LayoutTable
              tableData={tableData}
              columns={columns}
              loading={loading}
              pagination={{
                total: totalRowCount,
                current: currentPage,
                pageSize: pageSize,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '30'],
                showSizeChanger: true,
                style: { textAlign: 'center' },
                locale: { page: '' },
                position: ['bottomRight'],
              }}
              handleTableChange={handleTableChange}
              emptyMessage="No macro indicator records available"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CBTMacroList;
