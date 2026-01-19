import { useTranslation } from 'react-i18next';
import '../../../Styles/app.scss';
import LayoutTable from '../../../Components/common/Table/layout.table';
import { Button, Col, Row, Input, Dropdown, MenuProps } from 'antd';
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import {
  addActionBps,
  filterDropdownBps,
  listSearchBarBps,
  searchBoxBps,
} from '../../../Definitions/breakpoints/breakpoints';

interface Item {
  key: number;
  id: string;
  reportingYear: number;
  projectName: string;
  activityDescription: string;
  responsibleInstitution: string;
  status: string;
}

const CBTList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);
  const { post } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [tempSearchValue, setTempSearchValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

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

      const formattedData: Item[] = response.data.map((item: any, index: number) => ({
        key: index,
        id: item.id,
        reportingYear: item.reportingYear,
        projectName: item.projectName,
        activityDescription: item.activityDescription,
        responsibleInstitution: item.responsibleInstitution,
        status: item.status,
      }));

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
      title: 'ID',
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
      title: 'Godina izvještavanja',
      width: 140,
      dataIndex: 'reportingYear',
      key: 'reportingYear',
      sorter: false,
    },
    {
      title: 'Naziv projekta / mjere',
      width: 220,
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: false,
    },
    {
      title: 'Nadležna institucija',
      width: 220,
      dataIndex: 'responsibleInstitution',
      key: 'responsibleInstitution',
      sorter: false,
    },
    { title: 'Status', width: 120, dataIndex: 'status', key: 'status', sorter: false },
  ];

  const items: MenuProps['items'] = [];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">Klimatsko finansiranje - Osnovne informacije</div>
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
                Dodaj novi zapis
              </Button>
            </div>
          </Col>
          <Col {...listSearchBarBps}>
            <Row gutter={10}>
              <Col {...searchBoxBps} className="search-bar">
                <Input
                  addonAfter={<SearchOutlined style={{ color: '#615d67' }} onClick={onSearch} />}
                  placeholder="Pretraži po ID ili nazivu projekta"
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
              emptyMessage="Nema dostupnih zapisa klimatskog finansiranja"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CBTList;
