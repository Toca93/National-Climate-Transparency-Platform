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

const GenderReporting = () => {
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
    { title: 'Report ID', width: 100, dataIndex: 'id', key: 'id', sorter: false },
    { title: 'Report Title', width: 200, dataIndex: 'title', key: 'title', sorter: false },
    { title: 'Category', width: 150, dataIndex: 'category', key: 'category', sorter: false },
    { title: 'Date', width: 120, dataIndex: 'date', key: 'date', sorter: false },
    { title: 'Status', width: 120, dataIndex: 'status', key: 'status', sorter: false },
  ];

  const items: MenuProps['items'] = [];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">Gender Reporting</div>
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
                  navigate('/gender-reporting/add');
                }}
              >
                ADD GENDER REPORT
              </Button>
            </div>
          </Col>
          <Col {...listSearchBarBps}>
            <Row gutter={10}>
              <Col {...searchBoxBps} className="search-bar">
                <Input
                  addonAfter={<SearchOutlined style={{ color: '#615d67' }} onClick={onSearch} />}
                  placeholder="Search by Report ID"
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
              emptyMessage="No Gender Reports Available"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GenderReporting;
