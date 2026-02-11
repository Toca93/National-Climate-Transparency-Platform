export type ChartData = {
  chartId: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  categories: string[];
  values: number[];
  chartTitle: string;
  chartDescription: string;
  lastUpdatedTime: number;
};

export type DashboardActionItem = {
  key: number;
  actionId: number;
  title: string;
  actionType: string;
  affectedSectors: string[];
  financeNeeded: number;
  financeReceived: number;
  status: string;
  nationalImplementingEntity: string[];
};

export const chartColorMappings = {
  sectors: [
    '#93D1D7',
    '#0468B1',
    '#FF9FDE',
    '#7FEABF',
    '#FFD086',
    '#C1867B',
    '#FF8183',
    '#B7A4FE',
    '#6B8E23',
    '#B44DD3',
  ],
  finance: ['#F5D486', '#FF8183'],
  support: ['#F5D486', '#FF8183'],
  typeOfSupport: ['#0468B1', '#7FEABF', '#FF9FDE', '#FFD086'],
  activityStatus: ['#93D1D7', '#0468B1', '#7FEABF'],
  etfSector: [
    '#93D1D7',
    '#0468B1',
    '#FF9FDE',
    '#7FEABF',
    '#FFD086',
    '#C1867B',
    '#FF8183',
    '#B7A4FE',
    '#6B8E23',
    '#B44DD3',
  ],
  finInstrument: ['#0468B1', '#7FEABF', '#FF9FDE', '#FFD086', '#C1867B', '#FF8183', '#B7A4FE'],
  financingChannel: ['#93D1D7', '#0468B1', '#7FEABF', '#FF9FDE'],
};
