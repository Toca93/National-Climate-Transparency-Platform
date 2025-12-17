import './numberChip.scss';
import { Tag, Tooltip } from 'antd';
import { EmissionUnits } from '../../Enums/emission.enum';
// import { convertToBillions } from '../../Utils/utilServices';
import { formatLargeNumber, formatNumberWithThousandSeparators } from '../../Utils/utilServices';

interface Props {
  value: number;
  valueType?: EmissionUnits;
}

const NumberChip: React.FC<Props> = ({ value, valueType }) => {
  // Converting to Million or Billion format to prevent overflow
  // const { processedNumber, isConverted } = convertToBillions(value);
  // ML change to this new function
  // const { processedNumber, isConverted } = formatLargeNumber(value);
  const processedNumber = formatNumberWithThousandSeparators(value);

  return (
    <div className="number-chip">
      <Tooltip title={processedNumber} showArrow={false} placement="top">
        {valueType ? (
          <Tag className={`${valueType}_color`}>{processedNumber}</Tag>
        ) : (
          <Tag className="default_color">{processedNumber}</Tag>
        )}
      </Tooltip>
    </div>
  );
};

export default NumberChip;
