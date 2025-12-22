import { useTranslation } from 'react-i18next';
import '../../Styles/app.scss';
import LayoutTable from '../../Components/common/Table/layout.table';
import { Button, Col, Row, Input, Dropdown, MenuProps } from 'antd';
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addActionBps,
  filterDropdownBps,
  listSearchBarBps,
  searchBoxBps,
} from '../../Definitions/breakpoints/breakpoints';

const MonitoringPlans = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);

  const [loading] = useState<boolean>(false);
  const [tableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRowCount] = useState<number>(0);
  const [tempSearchValue, setTempSearchValue] = useState<string>('');

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSearch = () => {
    console.log('Search:', tempSearchValue);
  };

  const columns = [
    { title: 'Plan ID', width: 100, dataIndex: 'id', key: 'id', sorter: false },
    { title: 'Plan Name', width: 200, dataIndex: 'name', key: 'name', sorter: false },
    { title: 'Project', width: 150, dataIndex: 'project', key: 'project', sorter: false },
    { title: 'Start Date', width: 120, dataIndex: 'startDate', key: 'startDate', sorter: false },
    { title: 'End Date', width: 120, dataIndex: 'endDate', key: 'endDate', sorter: false },
    { title: 'Status', width: 120, dataIndex: 'status', key: 'status', sorter: false },
  ];

  const items: MenuProps['items'] = [];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">Monitoring Plans</div>
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
                  navigate('/monitoring-plans/add');
                }}
              >
                ADD MONITORING PLAN
              </Button>
            </div>
          </Col>
          <Col {...listSearchBarBps}>
            <Row gutter={10}>
              <Col {...searchBoxBps} className="search-bar">
                <Input
                  addonAfter={<SearchOutlined style={{ color: '#615d67' }} onClick={onSearch} />}
                  placeholder="Search by Plan ID"
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
              emptyMessage="No Monitoring Plans Available"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonitoringPlans;
