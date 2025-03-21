import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Button, Container, Row, Col, Card, CardBody, Modal,
    ModalHeader, ModalBody, ModalFooter, Input, Spinner
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer"; // Table Component
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const CourseMaster = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [newCourse, setNewCourse] = useState("");
    const [saving, setSaving] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Search Query State

    const courseApiUrl = `${apiBaseUrl}/course`;

    const breadcrumbItems = [
        { title: "Master", link: "#" },
        { title: "Course Master", link: "#" },
    ];

    // Fetch Courses
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", courseApiUrl, null);
            if (response.status === 200) {
                setCourses(response.result || []);
            } else {
                alert("Failed to fetch courses. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            alert("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [courseApiUrl]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Toggle Modal for Add/Edit
    const toggleModal = (course = null) => {
        setModal(!modal);
        if (course) {
            setEditingCourse(course);
            setNewCourse(course.name);
        } else {
            setEditingCourse(null);
            setNewCourse("");
        }
    };

    // Save Course (Add / Edit)
    const handleSaveCourse = async () => {
        if (!newCourse.trim()) return;
        setSaving(true);
        try {
            let response;
            if (editingCourse) {
                response = await apiRequestAsync("put", `${courseApiUrl}/${editingCourse.id}`, { name: newCourse });
            } else {
                response = await apiRequestAsync("post", courseApiUrl, { name: newCourse });
            }

            if (response.status === 200) {
                fetchCourses();
                toggleModal();
            } else {
                alert(response.message || "Failed to save course. Please try again.");
            }
        } catch (error) {
            console.error("Error saving course:", error);
            alert("An error occurred while saving the course. Please try again later.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Course
    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            const response = await apiRequestAsync("delete", `${courseApiUrl}/${id}`);
            if (response.status === 200) {
                fetchCourses();
            } else {
                alert(response.message || "Failed to delete course. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("An error occurred while deleting the course. Please try again later.");
        }
    };

    // Filter Courses Based on Search Query
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                Header: "Course Name",
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
                        <Button color="danger" size="sm" onClick={() => handleDeleteCourse(row.original.id)}>
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
                    <Breadcrumbs title="Course Management" breadcrumbItems={breadcrumbItems} />

                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/* Header Row: Add Button & Search Bar */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        {/* Export Buttons */}
                                        <div className="mb-3">
                                            <Button color="secondary" className="me-2" onClick={() => navigator.clipboard.writeText(JSON.stringify(filteredCourses, null, 2))}>
                                                Copy
                                            </Button>
                                            <Button color="info" className="me-2" onClick={() => {
                                                const csvContent = "data:text/csv;charset=utf-8," +
                                                    "Course Name,Course ID\n" +
                                                    filteredCourses.map(c => `${c.name},${c.id}`).join("\n");
                                                const encodedUri = encodeURI(csvContent);
                                                const link = document.createElement("a");
                                                link.setAttribute("href", encodedUri);
                                                link.setAttribute("download", "courses.csv");
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}>
                                                Export CSV
                                            </Button>
                                            <Button color="primary" onClick={() => window.print()}>Print</Button>
                                        </div>
                                        <Button color="primary" onClick={() => toggleModal()}>Add Course</Button>

                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Input
                                            type="text"
                                            placeholder="Search Course..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: "250px" }}
                                        />
                                    </div>


                                    {/* Table */}
                                    {loading ? (
                                        <div className="text-center my-4">
                                            <Spinner color="primary" /> Loading courses...
                                        </div>
                                    ) : (
                                        <TableContainer
                                            columns={columns || []}
                                            data={filteredCourses || []}
                                            isPagination={true}
                                            customPageSize={10}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Add/Edit Course Modal */}
                    <Modal isOpen={modal} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>
                            {editingCourse ? "Edit Course" : "Add Course"}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                placeholder="Enter course name"
                                value={newCourse}
                                onChange={(e) => setNewCourse(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            <Button color="primary" onClick={handleSaveCourse} disabled={saving}>
                                {saving ? <Spinner size="sm" /> : "Save"}
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CourseMaster;
