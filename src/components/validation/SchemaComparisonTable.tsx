import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SchemaComparisonTableProps {}

const schemaData = [
  {
    sourceTable: "DB2_CUSTOMERS",
    sourceCols: 12,
    targetTable: "customers_denorm",
    targetCols: 9,
    matchedCols: 9,
    percentMatched: "75 %",
    unmappedSourceCols: "DOB, PHONE, PREF_CHANNEL",
    unmappedTargetCols: "–",
  },
  {
    sourceTable: "DB2_POLICIES",
    sourceCols: 10,
    targetTable: "policies_denorm",
    targetCols: 11,
    matchedCols: 10,
    percentMatched: "80 %",
    unmappedSourceCols: "–",
    unmappedTargetCols: "history[] (nested array)",
  },
  {
    sourceTable: "DB2_CLAIMS",
    sourceCols: 14,
    targetTable: "claims_denorm",
    targetCols: 14,
    matchedCols: 14,
    percentMatched: "100 %",
    unmappedSourceCols: "–",
    unmappedTargetCols: "payments[], adjustments[], events[] (nested)",
  },
  {
    sourceTable: "DB2_RISK_RATINGS",
    sourceCols: 7,
    targetTable: "risk_ratings_denorm",
    targetCols: 7,
    matchedCols: 7,
    percentMatched: "80 %",
    unmappedSourceCols: "–",
    unmappedTargetCols: "– history[] (nested array)",
  },
  {
    sourceTable: "DB2_AGENTS",
    sourceCols: 6,
    targetTable: "agents_denorm",
    targetCols: 6,
    matchedCols: 6,
    percentMatched: "100 %",
    unmappedSourceCols: "–",
    unmappedTargetCols: "commissions[] (nested)",
  },
];

export function SchemaComparisonTable({}: SchemaComparisonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source Table</TableHead>
          <TableHead>Source Cols</TableHead>
          <TableHead>Target Table</TableHead>
          <TableHead>Target Cols</TableHead>
          <TableHead>Matched Cols</TableHead>
          <TableHead>% Matched</TableHead>
          <TableHead>Unmapped Source Cols</TableHead>
          <TableHead>Unmapped Target Cols</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schemaData.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.sourceTable}</TableCell>
            <TableCell>{row.sourceCols}</TableCell>
            <TableCell>{row.targetTable}</TableCell>
            <TableCell>{row.targetCols}</TableCell>
            <TableCell>{row.matchedCols}</TableCell>
            <TableCell>{row.percentMatched}</TableCell>
            <TableCell>{row.unmappedSourceCols}</TableCell>
            <TableCell>{row.unmappedTargetCols}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}