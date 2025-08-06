export interface ParsedSchemaInfo {
  tableCount: number;
  columnCount: number;
}

export function parseDdlContent(ddlContent: string): ParsedSchemaInfo {
  let tableCount = 0;
  let columnCount = 0;

  // Regex to find CREATE TABLE statements
  // Regex to find CREATE TABLE statements and capture their content
  const tableRegex = /CREATE\s+TABLE\s+[\w."`]+\s*\(([\s\S]*?)\);?/gi;
  let match;
  while ((match = tableRegex.exec(ddlContent)) !== null) {
    tableCount++;
    const tableContent = match[1]; // Content inside the parentheses of CREATE TABLE

    // Regex to find column definitions within the table content
    // This regex looks for lines that start with optional whitespace, followed by a word (column name),
    // then whitespace, then another word (data type), and then anything until a comma or closing parenthesis.
    const columnDefinitionRegex = /^\s*[\w."`]+\s+\w+.*?(?:,|$)/gim;
    const columnsInBlock = (tableContent.match(columnDefinitionRegex) || []).length;
    columnCount += columnsInBlock;
  }

  return { tableCount, columnCount };
}