import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Container, Label } from "reactstrap";

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// actions
import { checkLogin, apiError, verifyEmail } from '../../store/actions';

// import images
import cubicleLogo from "../../assets/images/cubicleLogo.png";
import logolight from "../../assets/images/logo-light.png";
import withRouter from '../../components/Common/withRouter';

const Login = ({ router }) => {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();
    const loginError = useSelector(state => state.Login.loginError);

    useEffect(() => {
        dispatch(apiError(""));
        document.body.classList.add("auth-body-bg");

        return () => {
            document.body.classList.remove("auth-body-bg");
        };
    }, [dispatch]);

    const handleEmailSubmit = (event, values) => {
        event.preventDefault();
        setEmail(values.email);
        dispatch(verifyEmail(values.email, handleVerificationResponse));
    };

    const handleVerificationResponse = (status) => {
        if (status === 'new_password') {
            setShowNewPasswordForm(true); // Show new password form
        } else if (status === 'login') {
            setShowPasswordInput(true); // Show login password input
        } else {
            setShowPasswordInput(false);
            setShowNewPasswordForm(false); // Handle error or other cases
        }
    };

    const handleNewPasswordSubmit = (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        // Corrected dispatch format
        dispatch({
            type: "UPDATE_PASSWORD",
            payload: {
                passwordData: { email, password: newPassword, password_confirmation: confirmPassword },
                callback: handlePasswordUpdated,
            },
        });
    };
    

    const handlePasswordUpdated = (success) => {
        if (success === true) {
            window.location.href = "/verifier3/login";// Redirect to login
        } else {
            console.log("Password update failed or unexpected response");
        }
    };
    

    const handlePasswordSubmit = (event, values) => {
        event.preventDefault();
        dispatch(checkLogin(values, router.navigate));
    };

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
                                            <div className="text-center">
                                                <Link to="/" className="">
                                                    <img src={cubicleLogo} alt="" width="275" className="auth-logo logo-dark mx-auto" />
                                                    <img src={logolight} alt="" height="100" className="auth-logo logo-light mx-auto" />
                                                </Link>
                                            </div>
                                            {loginError && (
                                                <Alert color="danger">{loginError}</Alert>
                                            )}
                                            <div className="p-2 mt-5">
                                                <AvForm onValidSubmit={showNewPasswordForm ? handleNewPasswordSubmit : (showPasswordInput ? handlePasswordSubmit : handleEmailSubmit)}>
                                                    <div className="auth-form-group-custom mb-4">
                                                        <Label htmlFor="email">Email</Label>
                                                        <AvField
                                                            name="email"
                                                            type="email"
                                                            validate={{
                                                                required: { value: true, errorMessage: 'Please enter email' },
                                                                email: { value: true, errorMessage: 'Enter a valid email' }
                                                            }}
                                                            placeholder="Enter email"
                                                        />
                                                    </div>
                                                    {showNewPasswordForm && (
                                                        <>
                                                            <div className="auth-form-group-custom mb-4">
                                                                <Label htmlFor="newPassword">New Password</Label>
                                                                <AvField
                                                                    name="newPassword"
                                                                    type="password"
                                                                    validate={{ required: { value: true, errorMessage: 'Please enter new password' } }}
                                                                    placeholder="Enter new password"
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="auth-form-group-custom mb-4">
                                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                                <AvField
                                                                    name="confirmPassword"
                                                                    type="password"
                                                                    validate={{ required: { value: true, errorMessage: 'Please confirm password' } }}
                                                                    placeholder="Confirm new password"
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showPasswordInput && (
                                                        <div className="auth-form-group-custom mb-4">
                                                            <Label htmlFor="password">Password</Label>
                                                            <AvField
                                                                name="password"
                                                                type="password"
                                                                validate={{ required: { value: true, errorMessage: 'Please enter Password' } }}
                                                                placeholder="Enter password"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="mt-4 text-center">
                                                        <Button color="primary" className="w-md waves-effect waves-light" type="submit">
                                                            {showNewPasswordForm ? "Set Password" : (showPasswordInput ? "Log In" : "Verify Email")}
                                                        </Button>
                                                    </div>
                                                </AvForm>
                                            </div>
                                            <div className="mt-5 text-center">
                                                <p>© 2025 Cubicle HRMS</p>
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
};

export default withRouter(Login);
