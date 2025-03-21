import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiRefreshCcw } from "react-icons/fi";

import Breadcrumbs from '../../components/Common/Breadcrumb';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Verifier 3", link: "/" },
                { title: "Dashboard", link: "#" },
            ],
            overall: { total: 7, approved: 0, rejected: 0, pending: 7, reverification: 0 },
            courseData: [
                { name: "FYBCom", total: 3, approved: 0, rejected: 0, pending: 3 },
                { name: "BssscccIT", total: 4, approved: 0, rejected: 0, pending: 4 }
            ]
        };
    }

    render() {
        const COLORS = ["#28a745", "#dc3545", "#ffc107", "#007bff", "blue"];
        const overallData = [
            { name: "Approved", value: this.state.overall.approved },
            { name: "Rejected", value: this.state.overall.rejected },
            { name: "Pending", value: this.state.overall.pending },
            { name: "Total", value: this.state.overall.total },
            { name: "Reverification", value: this.state.overall.reverification }
        ];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
                        
                        <Row>
                            <Col xl={2} style={{width:"20%"}} md={6}>
                                <Card className="text-center p-3 shadow-lg border-0">
                                    <FiUsers size={40} className="text-primary mb-2" />
                                    <CardTitle>Total Applications</CardTitle>
                                    <h3>{this.state.overall.total}</h3>
                                </Card>
                            </Col>
                            <Col xl={2} style={{width:"20%"}} md={6}>
                                <Card className="text-center p-3 shadow-lg border-0">
                                    <FiCheckCircle size={40} className="text-success mb-2" />
                                    <CardTitle>Approved</CardTitle>
                                    <h3>{this.state.overall.approved}</h3>
                                </Card>
                            </Col>
                            <Col xl={2} style={{width:"20%"}} md={6}>
                                <Card className="text-center p-3 shadow-lg border-0">
                                    <FiXCircle size={40} className="text-danger mb-2" />
                                    <CardTitle>Rejected</CardTitle>
                                    <h3>{this.state.overall.rejected}</h3>
                                </Card>
                            </Col>
                            <Col xl={2} style={{width:"20%"}} md={6}>
                                <Card className="text-center p-3 shadow-lg border-0">
                                    <FiClock size={40} className="text-warning mb-2" />
                                    <CardTitle>Pending</CardTitle>
                                    <h3>{this.state.overall.pending}</h3>
                                </Card>
                            </Col>
                            <Col xl={2} style={{ width: "20%" }} md={6}>
                                <Card className="text-center p-3 shadow-lg border-0">
                                    <FiRefreshCcw size={40} color="blue" className="mb-2" /> 
                                    <CardTitle>Reverification</CardTitle>
                                    <h3>{this.state.overall.reverification}</h3>
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
                                            <BarChart data={this.state.courseData} barGap={8} barSize={30}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="total" fill="#007bff" name="Total" />
                                                <Bar dataKey="approved" fill="#28a745" name="Approved" />
                                                <Bar dataKey="rejected" fill="#dc3545" name="Rejected" />
                                                <Bar dataKey="pending" fill="#ffc107" name="Pending" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
