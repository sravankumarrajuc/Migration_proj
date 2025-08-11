import * as XLSX from 'xlsx';
import { FieldMapping, TableMapping } from '@/types/migration';

export interface MappingReportRow {
  'Source Field Name': string;
  'Source Table Name': string;
  'Target Field Name': string;
  'Target Table Name': string;
  'Confidence Level': number;
}

/**
 * Transforms field mappings into the required Excel report format
 */
export function transformMappingsToReportData(
  tableMappings: TableMapping[]
): MappingReportRow[] {
  const reportData: MappingReportRow[] = [];

  tableMappings.forEach(tableMapping => {
    tableMapping.fieldMappings.forEach(fieldMapping => {
      reportData.push({
        'Source Field Name': getFieldNameFromId(fieldMapping.sourceColumnId),
        'Source Table Name': getTableNameFromId(fieldMapping.sourceTableId),
        'Target Field Name': getFieldNameFromId(fieldMapping.targetColumnId),
        'Target Table Name': getTableNameFromId(fieldMapping.targetTableId),
        'Confidence Level': fieldMapping.confidence
      });
    });
  });

  return reportData;
}

/**
 * Extracts readable field name from column ID
 */
function getFieldNameFromId(columnId: string): string {
  // Handle cases where columnId might be a readable name already
  if (columnId.includes('col-')) {
    // Extract meaningful name from IDs like 'col-db2-customers-1'
    const parts = columnId.split('-');
    if (parts.length >= 4) {
      // Try to create a meaningful name from the ID structure
      const tableType = parts[1]; // db2, bq
      const tableName = parts[2]; // customers, claims, etc.
      const fieldNumber = parts[3]; // 1, 2, 3, etc.
      
      // Create field name mappings based on common patterns
      return getFieldNameByPattern(tableType, tableName, fieldNumber);
    }
  }
  
  // If it's already a readable name or doesn't match pattern, return as is
  return columnId;
}

/**
 * Extracts readable table name from table ID
 */
function getTableNameFromId(tableId: string): string {
  // Handle cases where tableId might be a readable name already
  if (tableId.includes('-')) {
    const parts = tableId.split('-');
    if (parts.length >= 3) {
      // Extract from IDs like 'src-db2-customers' or 'tgt-bq-customers'
      const prefix = parts[0]; // src, tgt
      const dialect = parts[1]; // db2, bq
      const tableName = parts[2]; // customers, claims, etc.
      
      return `${dialect.toUpperCase()}_${tableName.toUpperCase()}`;
    }
  }
  
  // If it's already a readable name or doesn't match pattern, return as is
  return tableId;
}

/**
 * Maps field patterns to readable names based on table context
 */
function getFieldNameByPattern(tableType: string, tableName: string, fieldNumber: string): string {
  const fieldMappings: Record<string, Record<string, string>> = {
    'db2-customers': {
      '1': 'CUSTOMER_ID',
      '2': 'NAME_JSON',
      '3': 'REGION_CODE',
      '4': 'CUSTOMER_SEGMENT',
      '5': 'DATE_OF_BIRTH',
      '6': 'EMAIL',
      '7': 'PHONE_NUMBER',
      '8': 'ADDR_JSON',
      '9': 'JOIN_DATE',
      '10': 'STATUS',
      '11': 'PREFERRED_CHANNEL',
      '12': 'RISK_SCORE'
    },
    'bq-customers': {
      '1': 'customer_key',
      '2': 'name_first',
      '3': 'name_last',
      '5': 'region_code',
      '6': 'customer_segment',
      '7': 'date_of_birth',
      '8': 'email',
      '9': 'phone_number',
      '10': 'address_street',
      '11': 'address_city',
      '12': 'address_state',
      '13': 'address_postcode',
      '14': 'join_date',
      '15': 'active_status',
      '16': 'preferred_channel',
      '17': 'risk_score_metric'
    },
    'db2-claims': {
      '1': 'CLAIM_ID',
      '2': 'POLICY_REF',
      '3': 'CUSTOMER_REF',
      '4': 'CLAIM_DATE',
      '5': 'CLM_STATUS',
      '6': 'CLM_AMT',
      '7': 'ADJ_AMT',
      '8': 'SETTLEMENT_DATE',
      '9': 'CLAIM_JSON',
      '10': 'LOSS_TYPE',
      '11': 'REPORTER',
      '12': 'INCIDENT_LOCATION',
      '13': 'INCIDENT_TIMESTAMP',
      '14': 'DAYS_OPEN',
      '15': 'PRIORITY_CD'
    },
    'bq-claims': {
      '1': 'claim_key',
      '2': 'policy_reference',
      '3': 'customer_reference',
      '4': 'claim_date',
      '5': 'claim_status',
      '6': 'claim_amount',
      '7': 'adjustment_amount',
      '8': 'settlement_date',
      '9': 'claim_document',
      '10': 'loss_type',
      '11': 'reported_by',
      '12': 'incident_location',
      '13': 'incident_timestamp',
      '14': 'days_open',
      '15': 'priority_code',
      '16': 'payments',
      '17': 'adjustments',
      '18': 'events'
    }
  };

  const key = `${tableType}-${tableName}`;
  return fieldMappings[key]?.[fieldNumber] || `${tableName.toUpperCase()}_FIELD_${fieldNumber}`;
}

/**
 * Generates and downloads an Excel file with mapping report data
 */
export function generateMappingReportExcel(
  tableMappings: TableMapping[],
  projectName: string = 'Migration Project'
): void {
  try {
    // Transform data to report format
    const reportData = transformMappingsToReportData(tableMappings);
    
    if (reportData.length === 0) {
      throw new Error('No mapping data available to export');
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(reportData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // Source Field Name
      { wch: 20 }, // Source Table Name
      { wch: 25 }, // Target Field Name
      { wch: 20 }, // Target Table Name
      { wch: 15 }  // Confidence Level
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mapping Report');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Mapping_Report_${timestamp}.xlsx`;

    // Write and download file
    XLSX.writeFile(workbook, filename);
    
    console.log(`Excel report generated successfully: ${filename}`);
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw error;
  }
}

/**
 * Preview function to get report data without downloading
 */
export function previewMappingReportData(tableMappings: TableMapping[]): {
  data: MappingReportRow[];
  summary: {
    totalMappings: number;
    averageConfidence: number;
    highConfidenceMappings: number;
  };
} {
  const data = transformMappingsToReportData(tableMappings);
  
  const summary = {
    totalMappings: data.length,
    averageConfidence: data.length > 0 
      ? Math.round(data.reduce((sum, row) => sum + row['Confidence Level'], 0) / data.length)
      : 0,
    highConfidenceMappings: data.filter(row => row['Confidence Level'] >= 90).length
  };

  return { data, summary };
}
