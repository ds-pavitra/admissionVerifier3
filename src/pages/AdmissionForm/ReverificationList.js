import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Button, Container, Row, Col, Card, CardBody, Input, Spinner, Modal, ModalHeader, ModalBody
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";
import ViewApplication from "./ViewApplication";

const ReverificationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState();

    const applicantsApiUrl = `${apiBaseUrl}/reverification`;

    const breadcrumbItems = [
        { title: "Home", link: "#" },
        { title: "Reverification", link: "#" },
    ];

    // Fetch applications from API
    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", `${applicantsApiUrl}/list`, null);
            if (response.status === 200) {
                setApplications(response.result || []);
            } else {
                alert("Failed to fetch applications. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    }, [applicantsApiUrl]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Handle "View" button click
    const handleViewApplication = (application) => {
        console.log(application.id);        
        setApplicationStatus(application.verification_status)
        setSelectedApplication(application.id);
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setSelectedApplication(null);
        setModalOpen(false);
    };

    // Filter applications based on search input
    const filteredApplications = applications.filter(app =>
        app.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const COLORS = {
        approved: "#28a745",        // Green
        rejected: "#dc3545",        // Red
        pending: "#ffc107",         // Yellow
        reverification: "blue",     // Blue
    };

    const columns = useMemo(() => [
        { Header: "#", accessor: "index", Cell: ({ row }) => row.index + 1 },
        { Header: "Application No", accessor: "application_no" },
        { Header: "Course Name", accessor: "course_name" },
        { Header: "First Name", accessor: "first_name" },
        { Header: "Middle Name", accessor: "middle_name" },
        { Header: "Last Name", accessor: "last_name" },
        {
            Header: "Verification Status",
            accessor: "verification_status",
            Cell: ({ value }) => (
                <span
                    style={{
                        backgroundColor: COLORS[value.toLowerCase()] || "#6c757d", // Default gray
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        display: "inline-block",
                        minWidth: "100px",
                        textAlign: "center"
                    }}
                >
                    {value}
                </span>
            )
        },
        { Header: "Verified By", accessor: "verified_by_name" },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({ row }) => (
                <Button color="info" size="sm" onClick={() => handleViewApplication(row.original)}>
                    View
                </Button>
            ),
        },
    ], []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reverification" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <Button color="secondary" className="me-2" onClick={() => navigator.clipboard.writeText(JSON.stringify(filteredApplications, null, 2))}>
                                                Copy
                                            </Button>
                                            <Button color="info" className="me-2" onClick={() => {
                                                const csvContent = "data:text/csv;charset=utf-8,Application No,First Name,Middle Name,Last Name,Phone,Email,Course Name\n" +
                                                    filteredApplications.map(a =>
                                                        `${a.application_no},${a.first_name},${a.middle_name},${a.last_name},${a.phone},${a.email},${a.course_name}`
                                                    ).join("\n");
                                                const encodedUri = encodeURI(csvContent);
                                                const link = document.createElement("a");
                                                link.setAttribute("href", encodedUri);
                                                link.setAttribute("download", "applications.csv");
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}>
                                                Export CSV
                                            </Button>
                                            <Button color="primary" onClick={() => window.print()}>Print</Button>
                                        </div>
                                    </div>
                                    <Input type="text" placeholder="Search Applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "250px" }} />
                                    {loading ? <Spinner color="primary" /> : <TableContainer columns={columns} data={filteredApplications} isPagination={true} customPageSize={10} />}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* View Application Modal */}
            <Modal isOpen={modalOpen} toggle={closeModal} size="xl">
                <ModalHeader toggle={closeModal}>Application Details</ModalHeader>
                <ModalBody>
                    {selectedApplication && <ViewApplication application={selectedApplication}  fetchlist={fetchApplications} toggle={closeModal} verificationStatus={applicationStatus} verifyType="reverify" />}
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default ReverificationList;
