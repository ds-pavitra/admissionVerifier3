import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Button, Container, Row, Col, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter, Input, Spinner, FormGroup, Label
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role_id: "" });
    const [saving, setSaving] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const userApiUrl = `${apiBaseUrl}/user`;
    const roleApiUrl = `${apiBaseUrl}/role`;

    const breadcrumbItems = [
        { title: "Master", link: "#" },
        { title: "User Management", link: "#" },
    ];

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", userApiUrl, null);
            if (response.status === 200) {
                setUsers(response.result || []);
            } else {
                alert("Failed to fetch users. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [userApiUrl]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await apiRequestAsync("get", roleApiUrl, null);
            if (response.status === 200) {
                const formattedRoles = response.result.map(role => ({
                    label: role.name,
                    value: role.id
                }));
                setRoles(formattedRoles);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }, [roleApiUrl]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    const toggleModal = (user = null) => {
        setModal(!modal);
        if (user) {
            setEditingUser(user);
            setNewUser({ name: user.name, email: user.email, phone: user.phone, role_id: user.role_id });
        } else {
            setEditingUser(null);
            setNewUser({ name: "", email: "", phone: "", role_id: "" });
        }
    };

    const handleSaveUser = async () => {
        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim() || !newUser.role_id) return;
        setSaving(true);
        try {
            let response;
            if (editingUser) {
                response = await apiRequestAsync("put", `${userApiUrl}/${editingUser.id}`, newUser);
            } else {
                response = await apiRequestAsync("post", userApiUrl, newUser);
            }

            if (response.status === 200) {
                fetchUsers();
                toggleModal();
            } else {
                alert(response.message || "Failed to save user. Please try again.");
            }
        } catch (error) {
            console.error("Error saving user:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await apiRequestAsync("delete", `${userApiUrl}/${id}`);
            if (response.status === 200) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = useMemo(
        () => [
            { Header: "#", accessor: "index", Cell: ({ row }) => row.index + 1 },
            { Header: "Name", accessor: "name" },
            { Header: "Email", accessor: "email" },
            { Header: "Phone", accessor: "phone" },
            {
                Header: "Actions", accessor: "actions",
                Cell: ({ row }) => (
                    <>
                        <Button color="warning" size="sm" className="me-2" onClick={() => toggleModal(row.original)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={() => handleDeleteUser(row.original.id)}>Delete</Button>
                    </>
                ),
            },
        ], [roles]
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="User Management" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <Button color="secondary" className="me-2" onClick={() => navigator.clipboard.writeText(JSON.stringify(filteredUsers, null, 2))}>Copy</Button>
                                            <Button color="info" className="me-2" onClick={() => {
                                                const csvContent = "data:text/csv;charset=utf-8,Name,Email,Phone,Role\n" +
                                                    filteredUsers.map(u => `${u.name},${u.email},${u.phone},${roles.find(r => r.id === u.role_id)?.name}`).join("\n");
                                                const encodedUri = encodeURI(csvContent);
                                                const link = document.createElement("a");
                                                link.setAttribute("href", encodedUri);
                                                link.setAttribute("download", "users.csv");
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}>Export CSV</Button>
                                            <Button color="primary" onClick={() => window.print()}>Print</Button>
                                        </div>
                                        <Button color="primary" onClick={() => toggleModal()}>Add User</Button>
                                    </div>
                                    <Input type="text" placeholder="Search Users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "250px" }} />
                                    {loading ? <Spinner color="primary" /> : <TableContainer columns={columns} data={filteredUsers} isPagination={true} customPageSize={10} />}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* Add/Edit User Modal */}
                    <Modal isOpen={modal} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>
                            {editingUser ? "Edit User" : "Add User"}
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Phone</Label>
                                <Input
                                    type="text"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Role</Label>
                                <Input
                                    type="select"
                                    value={newUser.role_id}
                                    onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            <Button color="primary" onClick={handleSaveUser} disabled={saving}>
                                {saving ? <Spinner size="sm" /> : "Save"}
                            </Button>
                        </ModalFooter>
                    </Modal>

                </Container>
            </div>
        </React.Fragment>
    );
};
export default UserList;
