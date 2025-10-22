import { TimeMachineResult } from './timeMachineIntegration'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export async function generatePDF(results: TimeMachineResult[]): Promise<Uint8Array> {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Swim Meet Results', 14, 20);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  const tableData = results.map(result => [
    result.eventId,
    result.lane.toString(),
    result.time,
    result.status,
    result.splits.join(', ')
  ]);

  (doc as any).autoTable({
    head: [['Event', 'Lane', 'Time', 'Status', 'Splits']],
    body: tableData,
    startY: 40
  });

  return doc.output('arraybuffer');
}

export function generateCSV(results: TimeMachineResult[]): string {
  const headers = ['Event ID', 'Lane', 'Time', 'Status', 'Splits'];
  const rows = results.map(result => [
    result.eventId,
    result.lane,
    result.time,
    result.status,
    result.splits.join(';')
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function generateHyTek(results: TimeMachineResult[]): string {
  // HY-TEK specific format
  return results.map(result => {
    const event = result.eventId.padStart(4, '0');
    const lane = result.lane.toString().padStart(2, '0');
    const time = result.time.replace(':', '').replace('.', '');
    return `D0,${event},${lane},${time},${result.status}`;
  }).join('\r\n');
}

export async function generateExcel(results: TimeMachineResult[]): Promise<Uint8Array> {
  const worksheet = XLSX.utils.json_to_sheet(results.map(result => ({
    Event: result.eventId,
    Lane: result.lane,
    Time: result.time,
    Status: result.status,
    Splits: result.splits.join(', '),
    'Heat Number': result.heatNumber
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

function downloadFile(content: string | Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
