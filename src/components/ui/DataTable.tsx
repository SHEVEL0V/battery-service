import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";

export interface Column<T> {
  header?: React.ReactNode;
  align?: "left" | "center" | "right";
  sx?: SxProps<Theme>;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  empty: string;
}

export function DataTable<T extends { id: string }>({ columns, rows, empty }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <Typography color="text.secondary">{empty}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align} sx={column.sx}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
