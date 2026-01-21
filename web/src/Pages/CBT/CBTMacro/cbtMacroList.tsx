import { useTranslation } from 'react-i18next';
import '../../../Styles/app.scss';
import LayoutTable from '../../../Components/common/Table/layout.table';
import { Button, Col, Row, Input, Dropdown, MenuProps } from 'antd';
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addActionBps,
  filterDropdownBps,
  listSearchBarBps,
  searchBoxBps,
} from '../../../Definitions/breakpoints/breakpoints';

interface Item {
  key: number;
  id: string;
  projectName: string;
  year: number;
  gdp: number;
  climateFinanceShareGdp: number;
  climateFinanceShareBudget: number;
}

const CBTMacroList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);

  const [loading] = useState<boolean>(false);
  const [tableData] = useState<Item[]>([]);
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
    { title: 'ID', width: 80, dataIndex: 'id', key: 'id', sorter: false },
    {
      title: 'Naziv projekta / mjere',
      width: 200,
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: false,
    },
    {
      title: 'Godina',
      width: 100,
      dataIndex: 'year',
      key: 'year',
      sorter: false,
    },
    {
      title: 'BDP (EUR)',
      width: 150,
      dataIndex: 'gdp',
      key: 'gdp',
      sorter: false,
      render: (value: number) => value?.toLocaleString('de-DE'),
    },
    {
      title: 'Udio u BDP-u (%)',
      width: 130,
      dataIndex: 'climateFinanceShareGdp',
      key: 'climateFinanceShareGdp',
      sorter: false,
      render: (value: number) => (value ? `${value.toFixed(2)}%` : '-'),
    },
    {
      title: 'Udio u budžetu (%)',
      width: 130,
      dataIndex: 'climateFinanceShareBudget',
      key: 'climateFinanceShareBudget',
      sorter: false,
      render: (value: number) => (value ? `${value.toFixed(2)}%` : '-'),
    },
  ];

  const items: MenuProps['items'] = [];

  return (
    <div className="content-container">
      <div className="title-bar">
        <div className="body-title">Klimatsko finansiranje - Makro pokazatelji</div>
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
              emptyMessage="Nema dostupnih zapisa makro pokazatelja"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CBTMacroList;
