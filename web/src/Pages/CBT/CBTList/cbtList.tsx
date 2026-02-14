import { useTranslation } from 'react-i18next';
import '../../../Styles/app.scss';
import LayoutTable from '../../../Components/common/Table/layout.table';
import { Button, Col, Row, Input, Dropdown, Popover, List, Typography, MenuProps, Tag } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import {
  addActionBps,
  filterDropdownBps,
  listSearchBarBps,
  searchBoxBps,
} from '../../../Definitions/breakpoints/breakpoints';

interface ParsedDocument {
  title: string;
  url: string;
}

interface Item {
  key: number;
  id: string;
  startYear: number;
  endYear: number;
  projectName: string;
  activityDescription: string;
  nationalImplementingEntities: string[];
  internationalImplementingEntities: string[];
  status: string;
  documents: ParsedDocument[];
}

const CBTList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['cbtForm', 'common', 'tableAction']);
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
          click: () => navigate(`/cbt/view/${record.id}`),
        },
        {
          text: t('tableAction:Edit'),
          icon: <EditOutlined style={{ color: '#8A1538' }} />,
          click: () => navigate(`/cbt/edit/${record.id}`),
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload: any = {
        page: currentPage,
        size: pageSize,
        sort: {
          key: 'id',
          order: 'DESC',
        },
      };

      // Add search filter if search value exists
      if (searchValue) {
        payload.filterOr = [
          {
            key: 'id',
            operation: 'like',
            value: `%${searchValue}%`,
          },
          {
            key: 'projectName',
            operation: 'like',
            value: `%${searchValue}%`,
          },
        ];
      }

      const response: any = await post('national/cbt/query', payload);

      const formattedData: Item[] = response.data.map((item: any, index: number) => {
        // Parse document JSON strings from text[] column
        let parsedDocs: ParsedDocument[] = [];
        if (item.documents && item.documents.length > 0) {
          parsedDocs = item.documents.map((doc: string) => {
            try {
              return JSON.parse(doc);
            } catch {
              return { title: doc, url: doc };
            }
          });
        }
        return {
          key: index,
          id: item.id,
          startYear: item.startYear,
          endYear: item.endYear,
          projectName: item.projectName,
          activityDescription: item.activityDescription,
          nationalImplementingEntities: item.nationalImplementingEntities || [],
          internationalImplementingEntities: item.internationalImplementingEntities || [],
          status: item.status,
          documents: parsedDocs,
        };
      });

      setTableData(formattedData);
      setTotalRowCount(response.total);
    } catch (error: any) {
      console.error('Error fetching CBT data:', error);
    } finally {
      setLoading(false);
    }
  }, [post, currentPage, pageSize, searchValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      title: t('cbtForm:id'),
      width: 120,
      dataIndex: 'id',
      key: 'id',
      sorter: false,
      render: (id: string) => (
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => navigate(`/cbt/view/${id}`)}
        >
          {id}
        </span>
      ),
    },
    {
      title: '',
      width: 50,
      key: 'download',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_: any, record: Item) => {
        if (!record.documents || record.documents.length === 0) {
          return null;
        }
        if (record.documents.length === 1) {
          return (
            <DownloadOutlined
              style={{ fontSize: '16px', color: '#8A1538', cursor: 'pointer' }}
              onClick={() => {
                const doc = record.documents[0];
                const link = document.createElement('a');
                link.href = doc.url;
                link.download = doc.title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          );
        }
        return (
          <Popover
            showArrow={false}
            trigger="click"
            placement="bottomLeft"
            content={
              <List
                size="small"
                dataSource={record.documents}
                renderItem={(doc: ParsedDocument) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '4px 8px' }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = doc.url;
                      link.download = doc.title;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <DownloadOutlined style={{ marginRight: 8, color: '#8A1538' }} />
                    <span>{doc.title}</span>
                  </List.Item>
                )}
              />
            }
          >
            <DownloadOutlined style={{ fontSize: '16px', color: '#8A1538', cursor: 'pointer' }} />
          </Popover>
        );
      },
    },
    {
      title: t('cbtForm:startYear'),
      width: 120,
      dataIndex: 'startYear',
      key: 'startYear',
      sorter: false,
    },
    {
      title: t('cbtForm:endYear'),
      width: 120,
      dataIndex: 'endYear',
      key: 'endYear',
      sorter: false,
    },
    {
      title: t('cbtForm:projectName'),
      width: 280,
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: false,
    },
    {
      title: t('cbtForm:implementingEntity'),
      width: 220,
      key: 'implementingEntity',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_: any, record: Item) => {
        const national = record.nationalImplementingEntities || [];
        const international = record.internationalImplementingEntities || [];
        const combined = [...national, ...international].slice(0, 2);
        return (
          <div>
            {combined.map((entity, idx) => (
              <Tag
                key={idx}
                color="rgba(233, 68, 118, 0.11)"
                style={{ color: '#8A1538', marginBottom: 4, marginRight: 4 }}
              >
                {entity.length > 25 ? entity.substring(0, 25) + '...' : entity}
              </Tag>
            ))}
          </div>
        );
      },
    },
    { title: t('cbtForm:status'), width: 120, dataIndex: 'status', key: 'status', sorter: false },
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
        <div className="body-title">{t('cbtForm:climateFinancingBasicInfo')}</div>
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
                  navigate('/cbt/add');
                }}
              >
                {t('cbtForm:addNewRecord')}
              </Button>
            </div>
          </Col>
          <Col {...listSearchBarBps}>
            <Row gutter={10}>
              <Col {...searchBoxBps} className="search-bar">
                <Input
                  addonAfter={<SearchOutlined style={{ color: '#615d67' }} onClick={onSearch} />}
                  placeholder={t('cbtForm:searchPlaceholder')}
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
              emptyMessage={t('cbtForm:noBasicInfoRecords')}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CBTList;
