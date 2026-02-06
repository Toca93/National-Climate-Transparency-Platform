import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { FileHandlerInterface } from '../file-handler/filehandler.interface';
import { ExportFileType } from "../enums/shared.enum";
import { DataExportDto } from "../dtos/data.export.dto";
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DataExportService {
  constructor(private fileHandler: FileHandlerInterface,) {

  };

	async generateCsvOrExcel(data: DataExportDto[], headers: string[], fileName: string, fileType: ExportFileType, applyFormatting: boolean = false) {

		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		const day = currentDate.getDate().toString().padStart(2, '0');
		const hours = currentDate.getHours().toString().padStart(2, '0');
		const minutes = currentDate.getMinutes().toString().padStart(2, '0');
		const seconds = currentDate.getSeconds().toString().padStart(2, '0');
	
		const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
		const fileExtension = fileType === ExportFileType.CSV ? 'csv' : 'xlsx';
		const outputFileName = `${fileName}_${formattedDateTime}.${fileExtension}`;
	
		if (fileType === ExportFileType.CSV) {
			let csvContent = '';
	
			const refinedData = [];
			refinedData.push(headers);
	
			data.forEach(item => {
				const values = Object.values(item).map(value => (value === undefined || value === null) ? "" : value);
				refinedData.push(values);
			});
	
			refinedData.forEach(row => {
				const rowValues = row.map(value => `"${value}"`).join(',');
				csvContent += rowValues + '\n';
			});
	
			fs.writeFileSync(outputFileName, csvContent);
		} else if (fileType === ExportFileType.XLSX) {
			if (applyFormatting) {
				// Use ExcelJS for formatted exports (reports 6, 7, 12, 13)
				await this.generateFormattedExcel(data, headers, outputFileName);
			} else {
				// Use standard XLSX for simple exports
				const worksheetData = [headers, ...data.map(item => Object.values(item).map(value => {
					if (Array.isArray(value)) {
						return value.join('; '); // Convert array to a semicolon-separated string
					}
					return value === undefined || value === null ? "" : value;
				}))];
		
				const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
				const workbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
				XLSX.writeFile(workbook, outputFileName);
			}
		}
	
		const content = fs.readFileSync(outputFileName, { encoding: 'base64' });
		const url = await this.fileHandler.uploadFile('documents/exports/' + outputFileName, content);
	
		console.log('Export completed', 'exports/', url);
		return { url, outputFileName };
	}

	private async generateFormattedExcel(data: DataExportDto[], headers: string[], outputFileName: string) {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Sheet1');

		// Add headers with bold formatting and center alignment
		const headerRow = worksheet.addRow(headers);
		headerRow.eachCell((cell) => {
			cell.font = { bold: true };
			cell.alignment = { horizontal: 'center', vertical: 'middle' };
		});

		// Add data rows with center alignment
		data.forEach(item => {
			const rowValues = Object.values(item).map(value => {
				if (Array.isArray(value)) {
					return value.join('; ');
				}
				return value === undefined || value === null ? "" : value;
			});
			const dataRow = worksheet.addRow(rowValues);
			dataRow.eachCell((cell) => {
				cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
			});
		});

		// Auto-fit column widths based on content
		worksheet.columns.forEach(column => {
			let maxLength = 0;
			column.eachCell({ includeEmpty: true }, cell => {
				const cellValue = cell.value ? cell.value.toString() : '';
				maxLength = Math.max(maxLength, cellValue.length);
			});
			// Set width with some padding (min 10, max 50)
			column.width = Math.min(Math.max(maxLength + 4, 10), 50);
		});

		// Freeze header row
		worksheet.views = [
			{ state: 'frozen', ySplit: 1 }
		];

		await workbook.xlsx.writeFile(outputFileName);
	}
}


