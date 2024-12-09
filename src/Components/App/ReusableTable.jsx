import React, { useState, useEffect } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
} from "@tremor/react";
import "../../Styles/css/custom-table.css";

const ReusableTable = ({
    data,
    columns,
    onSearch,
    enablePagination,
    enableExport,
    enableRowSelection,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [filteredData, setFilteredData] = useState(data);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Update filteredData when data or searchQuery changes
    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = data.filter((row) =>
            Object.values(row).some((value) =>
                value?.toString().toLowerCase().includes(query)
            )
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [data, searchQuery]);

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle row selection
    const toggleRowSelection = (row) => {
        setSelectedRows((prev) =>
            prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(filteredData.map((row) => row)); // Select all visible rows
        } else {
            setSelectedRows([]); // Deselect all
        }
    };

    // Handle export functionality
    const handleExport = (format) => {
        let content = "";

        if (format === "csv") {
            content = [
                columns.map((col) => col.label).join(","),
                ...filteredData.map((row) =>
                    columns.map((col) => row[col.key] || "").join(",")
                ),
            ].join("\n");
        } else if (format === "txt") {
            content = filteredData
                .map((row) =>
                    columns.map((col) => `${col.label}: ${row[col.key] || ""}`).join("\n")
                )
                .join("\n\n");
        }

        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `RadarSystems.${format}`;
        link.click();
    };

    // Pagination logic
    const paginatedData = enablePagination
        ? filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        : filteredData;

    return (
        <div className="table-container">
            {/* Search and Export Controls */}
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                <div className="export-dropdown">
                    <button className="export-button">Exportar</button>
                    <div className="export-options">
                        <button onClick={() => handleExport("csv")}>CSV</button>
                        <button onClick={() => handleExport("txt")}>TXT</button>
                    </div>
                </div>
            </div>

            {/* Table Component */}
            <Table>
                <TableHead className="table-header">
                    <TableRow>
                        {enableRowSelection && (
                            <TableHeaderCell>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                        selectedRows.length > 0 &&
                                        selectedRows.length === filteredData.length
                                    }
                                />
                            </TableHeaderCell>
                        )}
                        {columns.map((col) => (
                            <TableHeaderCell key={col.key}>{col.label}</TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.map((row, index) => (
                        <TableRow key={index} className="table-row">
                            {enableRowSelection && (
                                <TableCell className="table-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row)}
                                        onChange={() => toggleRowSelection(row)}
                                        className="row-checkbox"
                                    />
                                </TableCell>
                            )}
                            {columns.map((col) => (
                                <TableCell key={col.key} className="table-cell">
                                    {col.render
                                        ? col.render(row[col.key], row)
                                        : row[col.key] || "0"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            {enablePagination && totalPages > 1 && (
                <div className="pagination">
                    <div className="pagination-buttons">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Anterior
                        </button>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    prev * rowsPerPage < filteredData.length ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage * rowsPerPage >= filteredData.length}
                            className="pagination-button"
                        >
                            Siguiente
                        </button>
                    </div>
                    <span className="pagination-info">
                        Página {currentPage} de {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ReusableTable;
