import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, TabContent, TabPane, NavItem, NavLink, Progress, Container, Spinner } from "reactstrap";
import classnames from "classnames";
import EducationDetails from "./EducationDetails";
import PersonalDetails from "./PersonalDetails";
import QualifyingExamDetails from "./QualifyingExamDetails";
import Upload from "./Upload";
import OtherDetails from "./OtherDetails";
import PrintApplication from "./PrintApplication";
import PreviewApplication from "./PreviewApplication";
import SubjectDetailsTable from "./SubjectDetailsTable";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const AdmissionForm = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [progressValue, setProgressValue] = useState(12.5);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [profileFormData, setProfileFormData] = useState({});
    const [educationFormData, setEducationFormData] = useState({});
    const [qualifyingExamFormData, setQualifyingExamFormData] = useState({});
    const [subjectDetailsTable, setSubjectDetailsTable] = useState({});
    const [uploadsFormData, setUploadsFormData] = useState({});
    const [otherDetailsFormData, setOtherDetailsFormData] = useState({});
    const paymentData = { payment_status: 1 };


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
        const paymentStatus = storedUser?.form_details?.payment_status || 0;
        setIsPaymentCompleted(paymentStatus === 1);
    }, []);


    const breadcrumbItems = [
        { title: "Forms", link: "#" },
        { title: "Admission Form", link: "#" },
    ];

    // const isFormDataFilled = (formData) => formData && Object.keys(formData).length > 0;

    const personalDetailsRef = useRef(null);
    const educationDetailsRef = useRef(null);
    const qualifyingExamDetailsRef = useRef(null);
    const subjectDetailsRef = useRef(null);
    const uploadRef = useRef(null);
    const otherDetailsRef = useRef(null);

    const stepRefs = {
        1: personalDetailsRef,
        2: educationDetailsRef,
        3: qualifyingExamDetailsRef,
        4: subjectDetailsRef,
        5: uploadRef,
        6: otherDetailsRef,
    };

    const handleSaveStep = async (step, formUrl, formKey) => {
        const currentStepRef = stepRefs[step];

        if (currentStepRef?.current || step === 8) {
            const validFormData = step === 8 ? paymentData : currentStepRef.current.submitForm();
            if (!validFormData) return; // Stop if validation fails

            if (!window.confirm("Are you sure you want to save this form?")) {
                return;
            }

            setLoading(true);

            const url = `${apiBaseUrl}${formUrl}`;
            try {
                const response = await apiRequestAsync("post", url, validFormData);
                if (response.status === 200) {
                    const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
                    storedUser.form_details[formKey] = 1;

                    if (step === 8) {
                        storedUser.form_details.payment_status = 1;
                        setIsPaymentCompleted(true);
                    }

                    localStorage.setItem("authUser", JSON.stringify(storedUser));

                    setActiveTab(step + 1);
                    setProgressValue((step + 1) * 12.5);
                } else {
                    alert(`${response.data.message}. Please try again.`);
                }
            } catch (error) {
                alert("Network error. Please try again later.");
            } finally {
                setLoading(false); // Hide spinner
            }
        }
    };

    // const handleSaveStep = async (step, formUrl, formData, formKey) => {
    //     if (personalDetailsRef.current) {
    //         const isValid = personalDetailsRef.current.submitForm();
    //         if (isValid) {
    //             handleSaveStep(1, '/applicant/personaldetails', profileFormData, 'personal_details');
    //         }
    //     }

    //     // if (!isFormDataFilled(formData)) {
    //     //     alert("Please fill in all required fields before saving.");
    //     //     return;
    //     // }

    //     if (!window.confirm("Are you sure you want to save this form?")) {
    //         return;
    //     }
    //     setLoading(true); 

    //     const url = `${apiBaseUrl}${formUrl}`;

    //     try {
    //         const response = await apiRequestAsync("post", url, formData);
    //         if (response.status === 200) {
    //             const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};

    //             if (storedUser.form_details) {
    //                 storedUser.form_details[formKey] = 1;
    //                 if (step === 8) {
    //                     storedUser.form_details.payment_status = 1;
    //                     setIsPaymentCompleted(true);
    //                 }
    //                 localStorage.setItem("authUser", JSON.stringify(storedUser));
    //             }

    //             // Special case: If the step is 8 (Payment), update payment status



    //             setActiveTab(step + 1);
    //             setProgressValue((step + 1) * 12.5);
    //         } else {
    //             alert(`${response.data.message}. Please try again.`);
    //         } 
    //     } catch (error) {
    //         alert("Network error. Please try again later.");
    //     } finally {
    //         setLoading(false); // Hide spinner
    //     }
    // };

    const handleSubmitAndProceed = () => {
        const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
        const formDetails = storedUser?.form_details || {};

        // List of required steps (excluding payment_status)
        const requiredSteps = [
            "personal_details",
            "educational_details",
            "qualifying_exam_details",
            "subject_details",
            "document_details",
            "other_details",
        ];

        // Check if any required step is not completed (not 1)
        const incompleteStep = requiredSteps.find(step => !formDetails[step] || formDetails[step] !== 1);

        if (incompleteStep) {
            alert("Please complete all previous steps before proceeding to payment.");
            return;
        }

        // If all required steps are completed, proceed to the payment step
        toggleTabProgress(8);
    };


    const toggleTabProgress = (tab) => {
        const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
        const formDetails = storedUser?.form_details || {};

        // Ensure the payment step (8) is only accessible after step 6 (Other Details)
        if (tab === 8) {
            if (!formDetails["other_details"] || formDetails["other_details"] !== 1) {
                alert("Please complete Other Details before proceeding to Payment.");
                return;
            }
        }

        // Ensure the print step (9) is only accessible after completing the payment
        if (tab === 9 && !isPaymentCompleted) {
            alert("Please complete the payment first.");
            return;
        }

        // Prevent users from accessing steps that are not marked as completed (status = 1)
        const stepKeys = [
            "personal_details",
            "educational_details",
            "qualifying_exam_details",
            "subject_details",
            "document_details",
            "other_details",
            "preview_details",
            "payment_status",
        ];

        if (tab > 1 && tab !== 8) {  // Exclude tab 8 from default checks
            const prevStepKey = stepKeys[tab - 2]; // Get the previous step key
            if (!formDetails[prevStepKey] || formDetails[prevStepKey] !== 1) {
                alert("Please complete the previous step before proceeding.");
                return;
            }
        }

        setActiveTab(tab);
        setProgressValue(tab * 12.5);
    };




    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Admission Form" breadcrumbItems={breadcrumbItems} />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Admission Form Wizard</h4>
                                    {loading && (
                                        <div className="text-center my-4">
                                            <Spinner className="me-2" color="primary" /> Saving data, please wait...
                                        </div>
                                    )}
                                    <div className="twitter-bs-wizard">
                                        <div className="twitter-bs-wizard-nav-container position-relative">
                                            <button
                                                className="btn btn-light position-absolute start-0 top-50 translate-middle-y"
                                                style={{zIndex:"10"}}
                                                onClick={() => {
                                                    const container = document.querySelector(".twitter-bs-wizard-nav");
                                                    container.scrollBy({ left: -100, behavior: "smooth" });
                                                }}
                                            >
                                                &lt;
                                            </button>
                                            <ul className="twitter-bs-wizard-nav nav nav-pills overflow-hidden" style={{ whiteSpace: "nowrap", overflowX: "hidden" }}>
                                                {[
                                                    "Personal Details",
                                                    "Education Details",
                                                    "Qualifying Exam Details",
                                                    "Subject Selection",
                                                    "Documents",
                                                    "Other Information",
                                                    "Preview",
                                                    "Payment",
                                                    "Print Application",
                                                ].map((step, index) => {
                                                    const stepKeys = [
                                                        "personal_details",
                                                        "educational_details",
                                                        "qualifying_exam_details",
                                                        "subject_details",
                                                        "document_details",
                                                        "other_details",
                                                        "preview_details",
                                                        "payment_status",
                                                        "print_application",
                                                    ];

                                                    const storedUser = JSON.parse(localStorage.getItem("authUser")) || {};
                                                    const formDetails = storedUser?.form_details || {};
                                                    const paymentCompleted = formDetails["payment_status"] === 1;

                                                    // Mark step 7 (Preview) and step 9 (Print) as completed if payment is done
                                                    const isStepCompleted =
                                                        formDetails[stepKeys[index]] === 1 || (paymentCompleted && (index === 6 || index === 8));

                                                    return (
                                                        <NavItem key={index}>
                                                            <NavLink
                                                                className={classnames("step-nav-link", {
                                                                    active: activeTab === index + 1,
                                                                    "completed-step": isStepCompleted,
                                                                })}
                                                                onClick={() => toggleTabProgress(index + 1)}
                                                            >
                                                                <span className="step-number">
                                                                    {isStepCompleted ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 48 48"
                                                                        >
                                                                            <linearGradient id="gradient1" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse">
                                                                                <stop offset=".108" stopColor="#0d7044"></stop>
                                                                                <stop offset=".433" stopColor="#11945a"></stop>
                                                                            </linearGradient>
                                                                            <path
                                                                                fill="url(#gradient1)"
                                                                                d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019c0.774-0.774,2.028-0.774,2.802,0
                                        L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019C18.627,42.193,17.373,42.193,16.599,41.42z"
                                                                            ></path>
                                                                            <linearGradient id="gradient2" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse">
                                                                                <stop offset="0" stopColor="#2ac782"></stop>
                                                                                <stop offset="1" stopColor="#21b876"></stop>
                                                                            </linearGradient>
                                                                            <path
                                                                                fill="url(#gradient2)"
                                                                                d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019c0.774,0.774,0.774,2.028,0,2.802
                                        L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019C11.807,36.627,11.807,35.373,12.58,34.599z"
                                                                            ></path>
                                                                        </svg>
                                                                    ) : (
                                                                        String(index + 1).padStart(2, "0")
                                                                    )}
                                                                </span>
                                                                <span className="step-title">{step}</span>
                                                            </NavLink>
                                                        </NavItem>
                                                    );
                                                })}
                                            </ul>
                                            <button
                                                className="btn btn-light position-absolute end-0 top-50 translate-middle-y"
                                                onClick={() => {
                                                    const container = document.querySelector(".twitter-bs-wizard-nav");
                                                    container.scrollBy({ left: 100, behavior: "smooth" });
                                                }}
                                            >
                                                &gt;
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <Progress color="success" striped animated value={progressValue} />
                                        </div>

                                        <TabContent activeTab={activeTab} className="twitter-bs-wizard-tab-content">
                                            <TabPane tabId={1}>
                                                <PersonalDetails ref={personalDetailsRef} profileFormData={profileFormData} setProfileFormData={setProfileFormData} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(1, '/applicant/personaldetails', 'personal_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <EducationDetails ref={educationDetailsRef} educationFormData={educationFormData} setEducationFormData={setEducationFormData} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(2, '/applicant/educationaldetails', 'educational_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <QualifyingExamDetails ref={qualifyingExamDetailsRef} qualifyingExamFormData={qualifyingExamFormData} setQualifyingExamFormData={setQualifyingExamFormData} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(3, '/applicant/qualifyingexamdetails', 'qualifying_exam_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <SubjectDetailsTable ref={subjectDetailsRef} subjectDetailsTable={subjectDetailsTable} setSubjectDetailsTable={setSubjectDetailsTable} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(4, '/applicant/subjectdetails', 'subject_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={5}>
                                                <Upload ref={uploadRef} uploadsFormData={uploadsFormData} setUploadsFormData={setUploadsFormData} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(5, '/applicant/documentdetails', 'document_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={6}>
                                                <OtherDetails otherDetailsFormData={otherDetailsFormData} setOtherDetailsFormData={setOtherDetailsFormData} disabled={isPaymentCompleted} />
                                                {!isPaymentCompleted && <button className="btn btn-primary mt-3" onClick={() => handleSaveStep(6, '/applicant/otherdetails', otherDetailsFormData, 'other_details')}>Save & Continue</button>}
                                            </TabPane>
                                            <TabPane tabId={7}>
                                                <PreviewApplication
                                                    profileFormData={profileFormData}
                                                    educationFormData={educationFormData}
                                                    qualifyingExamFormData={qualifyingExamFormData}
                                                    subjectDetailsTable={subjectDetailsTable}
                                                    uploadsFormData={uploadsFormData}
                                                    otherDetailsFormData={otherDetailsFormData}
                                                    disabled={isPaymentCompleted}
                                                />
                                                <button disabled={isPaymentCompleted} className="btn btn-success mt-3" onClick={handleSubmitAndProceed}>
                                                    Submit & Proceed to Payment
                                                </button>
                                            </TabPane>
                                            <TabPane tabId={8}>
                                                <h5>Payment Section</h5>
                                                <button disabled={isPaymentCompleted} className="btn btn-success mt-3" onClick={() => handleSaveStep(8, '/payment/status', 'payment_status')}>Complete Payment</button>
                                            </TabPane>
                                            <TabPane tabId={9}>
                                                <h5>Print Application</h5>
                                                <PrintApplication profileFormData={profileFormData} educationFormData={educationFormData} qualifyingExamFormData={qualifyingExamFormData} subjectDetailsTable={subjectDetailsTable} uploadsFormData={uploadsFormData} otherDetailsFormData={otherDetailsFormData} />
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AdmissionForm;
