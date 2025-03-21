import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Button, Container, Row, Col, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter, Input, Spinner
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Table Component
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const DocumentMaster = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [newDocument, setNewDocument] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Search Query State
    const [isRequired, setIsRequired] = useState("1");

    const documentApiUrl = `${apiBaseUrl}/document`;

    const breadcrumbItems = [
        { title: "Master", link: "#" },
        { title: "Document Master", link: "#" },
    ];

    // Fetch Courses
    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", documentApiUrl, null);
            if (response.status === 200) {
                setDocuments(response.result || []);
            } else {
                alert("Failed to fetch courses. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [documentApiUrl]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Toggle Modal for Add/Edit
    const toggleModal = (document = null) => {
        setModal(!modal);
        if (document) {
            setEditingDocument(document);
            setNewDocument(document.name);
            setIsRequired(document.is_required);
        } else {
            setEditingDocument(null);
            setNewDocument("");
            setIsRequired("1");
        }
    };

    // Save Document (Add / Edit)
    const handleSaveDocument = async () => {
        if (!newDocument.trim()) return;
        setSaving(true);
        try {
            const payload = { 
                "name": newDocument, 
                "is_required": parseInt(isRequired) // Ensure it's a number
            };
    
            let response;
            if (editingDocument) {
                response = await apiRequestAsync("put", `${documentApiUrl}/${editingDocument.id}`, payload);
            } else {
                response = await apiRequestAsync("post", documentApiUrl, payload);
            }
    
            if (response.status === 200) {
                fetchDocuments();
                toggleModal();
            } else {
                alert(response.message || "Failed to save document. Please try again.");
            }
        } catch (error) {
            console.error("Error saving document:", error);
            alert("An error occurred while saving the document. Please try again later.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Document
    const handleDeleteDocument = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Document?")) return;
        try {
            const response = await apiRequestAsync("delete", `${documentApiUrl}/${id}`);
            if (response.status === 200) {
                fetchDocuments();
            } else {
                alert(response.message || "Failed to delete Document. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting Document:", error);
            alert("An error occurred while deleting the Document. Please try again later.");
        }
    };

    // Filter Documents Based on Search Query
    const filteredDocuments = documents.filter(Document =>
        Document.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Table Columns
    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: "index",
                Cell: ({ row }) => row.index + 1,
                width: "5%",
            },
            {
                Header: "Document Name",
                accessor: "name",
                width: "65%",
            },
            {
                Header: "Document Required",
                accessor: "is_required",
                width: "10%",
                Cell: ({ value }) => (value === 1 ? "Yes" : "No"),
            },
            {
                Header: "Actions",
                accessor: "actions",
                width: "20%",
                Cell: ({ row }) => (
                    <>
                        <Button color="warning" size="sm" className="me-2" onClick={() => toggleModal(row.original)}>
                            Edit
                        </Button>
                        <Button color="danger" size="sm" onClick={() => handleDeleteDocument(row.original.id)}>
                            Delete
                        </Button>
                    </>
                ),
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Document Management" breadcrumbItems={breadcrumbItems} />

                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/* Header Row: Add Button & Search Bar */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        {/* Export Buttons */}
                                        <div className="mb-3">
                                            <Button color="secondary" className="me-2" onClick={() => navigator.clipboard.writeText(JSON.stringify(filteredDocuments, null, 2))}>
                                                Copy
                                            </Button>
                                            <Button color="info" className="me-2" onClick={() => {
                                                const csvContent = "data:text/csv;charset=utf-8," +
                                                    "Document Name,Document ID\n" +
                                                    filteredDocuments.map(c => `${c.name},${c.id}`).join("\n");
                                                const encodedUri = encodeURI(csvContent);
                                                const link = document.createElement("a");
                                                link.setAttribute("href", encodedUri);
                                                link.setAttribute("download", "Documents.csv");
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}>
                                                Export CSV
                                            </Button>
                                            <Button color="primary" onClick={() => window.print()}>Print</Button>
                                        </div>
                                        <Button color="primary" onClick={() => toggleModal()}>Add Document</Button>

                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Input
                                            type="text"
                                            placeholder="Search Document..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: "250px" }}
                                        />
                                    </div>


                                    {/* Table */}
                                    {loading ? (
                                        <div className="text-center my-4">
                                            <Spinner color="primary" /> Loading Documents...
                                        </div>
                                    ) : (
                                        <TableContainer
                                            columns={columns || []}
                                            data={filteredDocuments || []}
                                            isPagination={true}
                                            customPageSize={10}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Add/Edit Document Modal */}
                    <Modal isOpen={modal} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>
                            {editingDocument ? "Edit Document" : "Add Document"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                placeholder="Enter Document name"
                                value={newDocument}
                                onChange={(e) => setNewDocument(e.target.value)}
                            />
                            <label className="mt-3">Is Required?</label>
                            <Input
                                type="select"
                                value={isRequired}
                                onChange={(e) => setIsRequired(e.target.value)}
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </Input>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            <Button color="primary" onClick={handleSaveDocument} disabled={saving}>
                                {saving ? <Spinner size="sm" /> : "Save"}
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DocumentMaster;
