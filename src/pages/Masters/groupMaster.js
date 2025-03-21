import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Button, Container, Row, Col, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter, Input, Spinner
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Table Component
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const GroupMaster = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [newGroup, setNewGroup] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Search Query State

    const groupApiUrl = `${apiBaseUrl}/group`;

    const breadcrumbItems = [
        { title: "Master", link: "#" },
        { title: "Group Master", link: "#" },
    ];

    // Fetch Groups
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", groupApiUrl, null);
            if (response.status === 200) {
                setGroups(response.result || []);
            } else {
                alert("Failed to fetch groups. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [groupApiUrl]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Toggle Modal for Add/Edit
    const toggleModal = (group = null) => {
        setModal(!modal);
        if (group) {
            setEditingGroup(group);
            setNewGroup(group.name);
        } else {
            setEditingGroup(null);
            setNewGroup("");
        }
    };

    // Save Group (Add / Edit)
    const handleSaveGroup = async () => {
        if (!newGroup.trim()) return;
        setSaving(true);
        try {
            let response;
            if (editingGroup) {
                response = await apiRequestAsync("put", `${groupApiUrl}/${editingGroup.id}`, { name: newGroup });
            } else {
                response = await apiRequestAsync("post", groupApiUrl, { name: newGroup });
            }

            if (response.status === 200) {
                fetchGroups();
                toggleModal();
            } else {
                alert(response.message || "Failed to save group. Please try again.");
            }
        } catch (error) {
            console.error("Error saving group:", error);
            alert("An error occurred while saving the group. Please try again later.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Group
    const handleDeleteGroup = async (id) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            const response = await apiRequestAsync("delete", `${groupApiUrl}/${id}`);
            if (response.status === 200) {
                fetchGroups();
            } else {
                alert(response.message || "Failed to delete group. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting group:", error);
            alert("An error occurred while deleting the group. Please try again later.");
        }
    };

    // Filter Groups Based on Search Query
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                Header: "Group Name",
                accessor: "name",
                width: "75%",
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
                        <Button color="danger" size="sm" onClick={() => handleDeleteGroup(row.original.id)}>
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
                    <Breadcrumbs title="Group Management" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="mb-3">
                                            <Button color="secondary" className="me-2" onClick={() => navigator.clipboard.writeText(JSON.stringify(filteredGroups, null, 2))}>
                                                Copy
                                            </Button>
                                            <Button color="info" className="me-2" onClick={() => {
                                                const csvContent = "data:text/csv;charset=utf-8," +
                                                    "Group Name,Group ID\n" +
                                                    filteredGroups.map(g => `${g.name},${g.id}`).join("\n");
                                                const encodedUri = encodeURI(csvContent);
                                                const link = document.createElement("a");
                                                link.setAttribute("href", encodedUri);
                                                link.setAttribute("download", "groups.csv");
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}>
                                                Export CSV
                                            </Button>
                                            <Button color="primary" onClick={() => window.print()}>Print</Button>
                                        </div>
                                        <Button color="primary" onClick={() => toggleModal()}>Add Group</Button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Input
                                            type="text"
                                            placeholder="Search Group..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: "250px" }}
                                        />
                                    </div>
                                    {loading ? (
                                        <div className="text-center my-4">
                                            <Spinner color="primary" /> Loading groups...
                                        </div>
                                    ) : (
                                        <TableContainer
                                            columns={columns || []}
                                            data={filteredGroups || []}
                                            isPagination={true}
                                            customPageSize={10}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* Add/Edit Group Modal */}
                    <Modal isOpen={modal} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>
                            {editingGroup ? "Edit Group" : "Add Group"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                placeholder="Enter Group name"
                                value={newGroup}
                                onChange={(e) => setNewGroup(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            <Button color="primary" onClick={handleSaveGroup} disabled={saving}>
                                {saving ? <Spinner size="sm" /> : "Save"}
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default GroupMaster;
