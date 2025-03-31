import React, { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, Spinner } from "reactstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiRefreshCcw } from "react-icons/fi";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

import Breadcrumbs from '../../components/Common/Breadcrumb';

const Dashboard = () => {
    const [breadcrumbItems] = useState([
        { title: "Verifier 3", link: "/" },
        { title: "Dashboard", link: "#" }
    ]);
    const [loading, setLoading] = useState(false);
    const dashboardStatsApiurl = `${apiBaseUrl}/dashboard/stats`;

    const [overall, setOverall] = useState({});
    const [courseData, setCourseData] = useState([]);

    const COLORS = ["#28a745", "#dc3545", "#ffc107", "#007bff", "blue"];
    const overallData = [
        { name: "Approved", value: overall.approved },
        { name: "Rejected", value: overall.rejected },
        { name: "Pending", value: overall.pending },
        { name: "Total", value: overall.total },
        { name: "Reverification", value: overall.reverification }
    ];

    const fetchDashboardStatsData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiRequestAsync("get", dashboardStatsApiurl, null);
            if (response.status === 200) {
                setOverall(response.result.overall || {});
                setCourseData(response.result.course_wise || []);
            } else {
                alert("Failed to fetch dashboard stats. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    }, [dashboardStatsApiurl]);

    useEffect(() => {
        fetchDashboardStatsData();
    }, [fetchDashboardStatsData]);

    return (
        <div className="page-content">
            {loading ? <Spinner color="primary" /> :
                <Container fluid>
                    <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col xl={2} style={{width:"20%"}} md={6}>
                            <Card className="text-center p-3 shadow-lg border-0">
                                <FiUsers size={40} className="text-primary mb-2" />
                                <CardTitle>Total Applications</CardTitle>
                                <h3>{overall.total}</h3>
                            </Card>
                        </Col>
                        <Col xl={2} style={{width:"20%"}} md={6}>
                            <Card className="text-center p-3 shadow-lg border-0">
                                <FiCheckCircle size={40} className="text-success mb-2" />
                                <CardTitle>Approved</CardTitle>
                                <h3>{overall.approved}</h3>
                            </Card>
                        </Col>
                        <Col xl={2} style={{width:"20%"}} md={6}>
                            <Card className="text-center p-3 shadow-lg border-0">
                                <FiXCircle size={40} className="text-danger mb-2" />
                                <CardTitle>Rejected</CardTitle>
                                <h3>{overall.rejected}</h3>
                            </Card>
                        </Col>
                        <Col xl={2} style={{width:"20%"}} md={6}>
                            <Card className="text-center p-3 shadow-lg border-0">
                                <FiClock size={40} className="text-warning mb-2" />
                                <CardTitle>Pending</CardTitle>
                                <h3>{overall.pending}</h3>
                            </Card>
                        </Col>
                        <Col xl={2} style={{ width: "20%" }} md={6}>
                            <Card className="text-center p-3 shadow-lg border-0">
                                <FiRefreshCcw size={40} color="blue" className="mb-2" />
                                <CardTitle>Reverification</CardTitle>
                                <h3>{overall.reverification}</h3>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={6}>
                            <Card className="shadow-lg border-0">
                                <CardBody>
                                    <h4 className="card-title text-center">Overall Applications</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={overallData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                                                {overallData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="shadow-lg border-0">
                                <CardBody>
                                    <h4 className="card-title text-center">Course-wise Applications</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={courseData} barGap={8} barSize={30}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="total_applicants" fill="#007bff" name="Total" />
                                            <Bar dataKey="approved" fill="#28a745" name="Approved" />
                                            <Bar dataKey="rejected" fill="#dc3545" name="Rejected" />
                                            <Bar dataKey="pending" fill="#ffc107" name="Pending" />
                                            <Bar dataKey="reverification" fill="blue" name="Reverification" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
};

export default Dashboard;
