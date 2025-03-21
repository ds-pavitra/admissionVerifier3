import React, { useEffect, useState } from "react";
import { Row, Col, Button, Alert, Container, Label, Input, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import cubicleLogo from "../../assets/images/cubicleLogo.png";
import withRouter from '../../components/Common/withRouter';
import { registerUser, registerUserFailed, apiError } from '../../store/actions';
// import Select from 'react-select';
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const courseListUrl = `${apiBaseUrl}/course`;

const Register = ({ user, registrationError, loading, registerUser, registerUserFailed, apiError, router }) => {
    // const [course_id, setcourse_id] = useState();
    // const navigate = useNavigate();

    const [courseOptions, setCourseOptions] = useState([]);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);
    const sendOtpUrl = `${apiBaseUrl}/otp/generate`;
    const verifyOtpUrl = `${apiBaseUrl}/otp/verify`;

    const [resendTimer, setResendTimer] = useState(0);  // Countdown Timer

    useEffect(() => {
        registerUserFailed("");
        apiError("");
        const fetchCourseData = async () => {
            try {
                const data = await apiRequestAsync('get', courseListUrl, null);
                const courseidOptions = data.result.map((course) => ({ value: course.id, label: course.name }));
                setCourseOptions(courseidOptions);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourseData();
    }, [registerUserFailed, apiError]);

    const { register, handleSubmit, getValues,formState: { errors }, setValue } = useForm({
        mode: "onBlur",
        defaultValues: { name: "", course_id: "", email: "", phone: "", password: "" }
    });

    const sendOtp = async () => {
        const userEmail = getValues("email");
        try {
            const response = await apiRequestAsync('post', sendOtpUrl, { email: userEmail });
    
            if (response.status === 200) {
                const serverWaitTime = new Date(response.result.waitTime).getTime();
                const currentTime = new Date().getTime();
                const remainingTime = Math.floor((serverWaitTime - currentTime) / 1000);
    
                setResendTimer(remainingTime > 0 ? remainingTime : 0);
                setIsOtpSent(true);
                setShowOtpModal(true);
    
                // Start Countdown Timer
                const timerInterval = setInterval(() => {
                    setResendTimer((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(timerInterval);
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 1000);
    
            } else if (response.status === 400) {
                alert(response.data.message); // API Block Message (e.g., "Maximum attempts reached")
                setShowOtpModal(false); // Close OTP modal on block
            } else {
                alert("Error sending OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };
    
    

    const verifyOtp = async () => {
        const userEmail = getValues("email");
        try {
            const response = await apiRequestAsync('post', verifyOtpUrl, { email: userEmail, otp });
            if (response.status === 200) {
                setShowOtpModal(false);
                registerUser(tempUserData, router.navigate);
            } else {
                alert("Invalid OTP, please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    const onSubmit = (data) => {
        setTempUserData(data);
        sendOtp(data.phone);
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col lg={4}>
                    <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                        <div className="w-100">
                            <Row className="justify-content-center">
                                <Col lg={9}>
                                    <div>
                                        <div className="text-center">
                                            <Link to="#" className="logo">
                                                <img src={cubicleLogo} height="20" alt="logo" />
                                            </Link>
                                            <h4 className="font-size-18 mt-4">Register account</h4>
                                            <p className="text-muted">Get your free Cubicle HRMS account now.</p>
                                        </div>

                                        {user && <Alert color="success">Registration Done Successfully.</Alert>}
                                        {registrationError && <Alert color="danger">{registrationError}</Alert>}

                                        <div className="p-2 mt-5">
                                            <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
                                                <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="name">Name</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px" }}
                                                        type="text"
                                                        id="name"
                                                        {...register("name", { required: "Name is required" })}
                                                        onChange={(e) => setValue("name", e.target.value, { shouldValidate: true })}
                                                        placeholder="Enter name"
                                                    />
                                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                                </FormGroup>

                                                <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="course_id">Course</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px", paddingTop: "28px" }}
                                                        type="select"
                                                        id="course_id"
                                                        {...register("course_id", { required: "Course is required" })}
                                                        onChange={(e) => {
                                                            const selectedCourse = e.target.value;
                                                            setValue("course_id", selectedCourse, { shouldValidate: true });
                                                        }}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {Array.isArray(courseOptions) && courseOptions.map(course => (
                                                            <option key={course.value} value={course.value}>{course.label}</option>
                                                        ))}
                                                    </Input>
                                                    {errors.course_id && <span className="text-danger">{errors.course_id.message}</span>}
                                                </FormGroup>


                                                {/* <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="course_id">Course</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px", paddingTop: "28px" }}
                                                        type="select"
                                                        id="course_id"
                                                        {...register("course_id", { required: "Course is required" })}
                                                        onChange={(e) => setcourse_id(e.target.value)}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {Array.isArray(courseOptions) && courseOptions.map(course => (
                                                            <option key={course.value} value={course.label}>{course.label}</option>
                                                        ))}
                                                    </Input>
                                                    {errors.course_id && <span className="text-danger">{errors.course_id.message}</span>}
                                                </FormGroup> */}

                                                {/* <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label htmlFor="role" style={{ fontSize: '1rem' }}>Course</Label>
                                                    <Select
                                                        options={courseOptions}
                                                        value={course_id}
                                                        onChange={(selectedOption) => setcourse_id(selectedOption)}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                    />
                                                    {errors.course && <span className="text-danger">{errors.course.message}</span>}
                                                </FormGroup> */}

                                                <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="email">Email</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px" }}
                                                        type="email"
                                                        id="email"
                                                        {...register("email", {
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                                message: "Enter a valid email",
                                                            }
                                                        })}
                                                        onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
                                                        placeholder="Enter email"
                                                    />
                                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                </FormGroup>


                                                <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="phone">Phone</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px" }}
                                                        type="text"
                                                        id="phone"
                                                        {...register("phone", {
                                                            required: "Phone is required",
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: "Enter a valid 10-digit phone number",
                                                            }
                                                        })}
                                                        onChange={(e) => setValue("phone", e.target.value, { shouldValidate: true })}
                                                        placeholder="Enter phone number"
                                                    />
                                                    {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                                                </FormGroup>


                                                <FormGroup className="auth-form-group-custom mb-4">
                                                    <Label style={{ left: "25px" }} htmlFor="password">Password</Label>
                                                    <Input
                                                        style={{ paddingLeft: "24px" }}
                                                        type="password"
                                                        id="password"
                                                        {...register("password", { required: "Password is required" })}
                                                        onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
                                                        placeholder="Enter password"
                                                    />
                                                    {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                                </FormGroup>


                                                <div className="text-center">
                                                    <Button color="primary" className="w-100" type="submit">
                                                        {isOtpSent ? "Resend OTP" : "Send OTP"}
                                                    </Button>
                                                </div>

                                                <div className="mt-4 text-center">
                                                    <p className="mb-0">By registering you agree to the Cubicle HRMS <Link to="#" className="text-primary">Terms of Use</Link></p>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="mt-5 text-center">
                                            <p>Already have an account? <Link to="/login" className="fw-medium text-primary"> Login</Link></p>
                                            <p>© 2025 Cubicle HRMS.</p>
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
            <Modal isOpen={showOtpModal} toggle={() => setShowOtpModal(!showOtpModal)}>
                <ModalHeader toggle={() => setShowOtpModal(!showOtpModal)}>Enter OTP</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={verifyOtp}>Verify OTP</Button>

                    {/* Resend OTP with Timer Inside Modal */}
                    <Button
                        color="warning"
                        onClick={sendOtp}
                        disabled={resendTimer > 0}
                    >
                        {resendTimer > 0
                            ? `Resend OTP in ${resendTimer}s`
                            : "Resend OTP"}
                    </Button>

                    <Button color="secondary" onClick={() => setShowOtpModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

const mapStateToProps = state => {
    const { user, registrationError, loading } = state.Account;
    return { user, registrationError, loading };
};

export default withRouter(connect(mapStateToProps, { registerUser, apiError, registerUserFailed })(Register));
