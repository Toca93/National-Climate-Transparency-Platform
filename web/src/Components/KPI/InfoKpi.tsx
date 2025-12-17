import { CheckOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { useState } from 'react';
import './kpiStyles.scss';

const InfoKpi = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('YES-1/NO-0');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Paragraph className="info-kpi">
      <InfoCircleOutlined className="info-icon" />
      For Yes/No indicators, set the KPI Unit to 'YES-1/NO-0'.
      <br />
      This ensures that in the Achieved and Expected fields, 1 represents Yes and 0 represents No.
      <Tooltip placement="left" title={copied ? 'Copied!' : 'Copy Yes/No unit to clipboard'}>
        {copied ? (
          <CheckOutlined style={{ color: '#52c41a', marginLeft: '8px' }} />
        ) : (
          <CopyOutlined className="copy-icon" onClick={handleCopy} />
        )}
      </Tooltip>
    </Paragraph>
  );
};

export default InfoKpi;
