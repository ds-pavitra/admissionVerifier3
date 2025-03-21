import React, { Component } from 'react';
import { Row, Col, Button, Alert, Container, Label } from "reactstrap";

// Redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// actions
import { checkLogin, apiError } from '../../store/actions';

// import images
import cubicleLogo from "../../assets/images/cubicleLogo.png";
import logolight from "../../assets/images/logo-light.png";
import withRouter from '../../components/Common/withRouter';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "" };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, values) {
        event.preventDefault();
        this.props.checkLogin(values, this.props.router.navigate);
    }

    componentDidMount() {
        // Clear previous error messages when the login page is loaded
        this.props.apiError("");
        document.body.classList.add("auth-body-bg");
    }

    componentWillUnmount() {
        document.body.classList.remove("auth-body-bg");
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <Container fluid className="p-0">
                        <Row className="g-0">
                            <Col lg={4}>
                                <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                                    <div className="w-100">
                                        <Row className="justify-content-center">
                                            <Col lg={9}>
                                                <div>
                                                    <div className="text-center">
                                                        <div>
                                                            <Link to="/" className="">
                                                                <img src={cubicleLogo} alt="" width="275" className="auth-logo logo-dark mx-auto" />
                                                                <img src={logolight} alt="" height="100" className="auth-logo logo-light mx-auto" />
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* 🔹 Show API error if exists */}
                                                    {this.props.loginError && (
                                                        <Alert color="danger">{this.props.loginError}</Alert>
                                                    )}

                                                    <div className="p-2 mt-5">
                                                        <AvForm className="form-horizontal" onValidSubmit={this.handleSubmit}>
                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-user-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="email">Email</Label>
                                                                <AvField
                                                                    name="email"
                                                                    type="email"
                                                                    className="form-control"
                                                                    id="email"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: 'Please enter email' },
                                                                        email: { value: true, errorMessage: 'Enter a valid email' }
                                                                    }}
                                                                    placeholder="Enter email"
                                                                />
                                                            </div>

                                                            <div className="auth-form-group-custom mb-4">
                                                                <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                                                <Label htmlFor="userpassword">Password</Label>
                                                                <AvField
                                                                    name="password"
                                                                    type="password"
                                                                    className="form-control"
                                                                    id="userpassword"
                                                                    validate={{ required: { value: true, errorMessage: 'Please enter Password' } }}
                                                                    placeholder="Enter password"
                                                                />
                                                            </div>

                                                            <div className="mt-4 text-center">
                                                                <Button color="primary" className="w-md waves-effect waves-light" type="submit">Log In</Button>
                                                            </div>

                                                            {/* <div className="mt-4 text-center">
                                                                <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock me-1"></i> Forgot your password?</Link>
                                                            </div>

                                                            <div className="mt-5 text-center">
                                                                <p>Don't have an account? <Link to="/register" className="fw-medium text-primary"> Register </Link> </p>
                                                            </div> */}
                                                        </AvForm>
                                                    </div>

                                                    <div className="mt-5 text-center">
                                                        <p>© 2025 Cubicle HRMS</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={8}>
                                <div className="authentication-bg">
                                    <div className="bg-overlay"></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = (state) => {
    const { loginError } = state.Login;
    return { loginError };
};

export default withRouter(connect(mapStatetoProps, { checkLogin, apiError })(Login));
