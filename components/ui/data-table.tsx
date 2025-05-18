import { useState } from "react"
import { Input } from "./input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

interface Column {
    header: string
    accessorKey: string
    cell?: (props: { row: { original: any } }) => React.ReactNode
}

interface DataTableProps {
    data: any[]
    columns: Column[]
    searchable?: boolean
    pagination?: boolean
}

export function DataTable({ data, columns, searchable, pagination }: DataTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredData = false
        ? data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : data

    const paginatedData = pagination
        ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : filteredData

    return (
        <div className="space-y-4">
            {searchable && (
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.accessorKey}>{column.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, i) => (
                            <TableRow key={i}>
                                {columns.map((column) => (
                                    <TableCell key={column.accessorKey}>
                                        {column.cell
                                            ? column.cell({ row: { original: row } })
                                            : row[column.accessorKey]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {pagination && filteredData.length > itemsPerPage && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1">
                        Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))
                        }
                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
} 