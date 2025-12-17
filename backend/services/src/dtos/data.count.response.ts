export class DataCountResponseDto {
  stats: any;
  lastUpdate: number;
  year?: number;

  constructor(stats: any, lastUpdate: number, year?: number) {
    this.stats = stats;
    this.lastUpdate = lastUpdate;
    this.year = year;
  }
}
