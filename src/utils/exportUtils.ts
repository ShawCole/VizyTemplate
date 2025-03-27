// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { unparse } from 'papaparse';
import { B2BData, B2CData } from '../types/data';

export function exportToCSV(
  data: B2BData[] | B2CData[],
  fileName: string,
  type: 'b2b' | 'b2c'
) {
  const csv = unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  // Modern browsers
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}