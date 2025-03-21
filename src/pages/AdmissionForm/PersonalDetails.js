
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, Label, Input, Row, Col } from "reactstrap";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const PersonalDetails = forwardRef(({ setProfileFormData, disabled }, ref) => {
    const formRef = useRef();

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit()
    }));

    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        father_first_name: "",
        father_middle_name: "",
        father_last_name: "",
        mother_name: "",
        name_as_per_aadhar: "",
        in_house_student: "",
        abc_id_no: "",
        marital_status: "",
        dob: "",
        gender: "",
        birth_place: "",
        blood_group: "",
        native_place: "",
        organ_donor: "",
        transaction_type: "",
        religion: "",
        nationality: "",
        udise_no: "",
        aadhar_no: "",
        university_preregistration_no: "",
        eligibility_no: "",
        phone: "",
        alternate_no: "",
        email: "",
        parent_phone: "",
        domicile_state: "",
        admission_category: "",
        caste_category: "",
        social_reservation: "",
        caste: "",
        phy_handicapped: "",
        learning_disability_no: "",
        handicap_percentage: "",
        mother_tongue: "",
        ncc_nss: "",
        correspondence_address: "",
        correspondence_pincode: "",
        correspondence_state: "",
        correspondence_district: "",
        correspondence_tehsil: "",
        correspondence_city: "",
        sameAddress: false,
        permanent_address: "",
        permanent_pincode: "",
        permanent_state: "",
        permanent_district: "",
        permanent_tehsil: "",
        permanent_city: "",
    });


    const fetchPersonalDetails = async () => {
        try {
            const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);

            if (response.status === 200) {
                console.log(response);
                setFormData((prevData) => ({
                    ...prevData,
                    ...response.result.personal_data,
                    ...response.result.address_data,
                    ...response.result.legal_reservation_data
                }));
            } else {
                console.log(response.data.message);
                alert(`${response.data.message}. Please try again.`);
            }
        } catch (error) {
            console.log(error);
            alert("Network error. Please try again later.");
        }
    };
    useEffect(() => {
        // Get user data from localStorage
        const authUser = JSON.parse(localStorage.getItem("authUser"));

        if (authUser && authUser.form_details.personal_details === 1) {
            fetchPersonalDetails();
        }
    }, []);

    const [formErrors, setFormErrors] = useState({});

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "first_name":
            case "middle_name":
            case "last_name":
            case "father_first_name":
            case "father_middle_name":
            case "father_last_name":
                if (!value) error = `${name.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
                break;
            case "mother_name":
                if (!value) error = "Mother's Name is required";
                break;
            case "name_as_per_aadhar":
                if (!value) error = "Aadhar Name is required";
                break;
            case "in_house_student":
                if (!value) error = "In-House Student status is required";
                break;
            case "abc_id_no":
                if (!value) error = "ABC ID is required";
                break;
            case "marital_status":
                if (!value) error = "Marital Status is required";
                break;
            case "dob":
                if (!value) error = "Date of Birth is required";
                break;
            case "gender":
                if (!value) error = "Gender is required";
                break;
            case "birth_place":
                if (!value) error = "Place of Birth is required";
                break;
            case "blood_group":
                if (!value) error = "Blood Group is required";
                break;
            case "native_place":
                if (!value) error = "Native Place is required";
                break;
            case "organ_donor":
                if (!value) error = "Organ Donor status is required";
                break;
            case "transaction_type":
                if (!value) error = "Transaction Type is required";
                break;
            case "religion":
                if (!value) error = "Religion is required";
                break;
            case "nationality":
                if (!value) error = "Nationality is required";
                break;
            case "udise_no":
                if (!value) error = "UDISE No. is required";
                break;
            case "aadhar_no":
                if (!value) error = "Aadhar No. is required";
                break;
            case "university_preregistration_no":
                if (!value) error = "Pre-Registration No. is required";
                break;
            case "eligibility_no":
                if (!value) error = "Eligibility No. is required";
                break;
            case "phone":
                if (!value) {
                    error = "Student Mobile No. is required";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Mobile number must be 10 digits";
                }
                break;
            case "alternate_no":
                if (!value) {
                    error = "Alternate Contact No. is required";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Alternate Contact number must be 10 digits";
                }
                break;
            case "email":
                if (!value) {
                    error = "Student Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is invalid";
                }
                break;
            case "parent_phone":
                if (!value) {
                    error = "Parent Phone No. is required";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Parent Phone number must be 10 digits";
                }
                break;
            case "domicile_state":
                if (!value) error = "Domicile State is required";
                break;
            case "admission_category":
                if (!value) error = "Admission Category is required";
                break;
            case "caste_category":
                if (!value) error = "Caste Category is required";
                break;
            // case "social_reservation":
            //     if (!value) error = "Social Reservation status is required";
            //     break;
            case "caste":
                if (!value) error = "Caste is required";
                break;
            case "phy_handicapped":
                if (!value) error = "Physically Handicapped status is required";
                break;
            // case "learning_disability_no":
            // if (!value) error = "Learning Disability No. is required";
            // break;
            // case "handicap_percentage":
            //     if (!value) error = "Handicapped Percentage is required";
            //     break;
            case "mother_tongue":
                if (!value) error = "Mother Tongue is required";
                break;
            case "ncc_nss":
                if (!value) error = "NCC/NSS status is required";
                break;
            case "correspondence_address":
                if (!value) error = "Correspondence Address is required";
                break;
            case "correspondence_pincode":
                if (!value) error = "Correspondence Pin Code is required";
                break;
            case "correspondence_state":
                if (!value) error = "Correspondence State is required";
                break;
            case "correspondence_district":
                if (!value) error = "Correspondence District is required";
                break;
            // case "correspondence_tehsil":
            //     if (!value) error = "Correspondence Tehsil is required";
            //     break;
            case "correspondence_city":
                if (!value) error = "Correspondence City is required";
                break;
            case "sameAddress":
                // You can add validation based on whether `sameAddress` is checked or not
                break;
            case "permanent_address":
                if (!value && !formData.sameAddress) error = "Permanent Address is required";
                break;
            case "permanent_pincode":
                if (!value && !formData.sameAddress) error = "Permanent Pin Code is required";
                break;
            case "permanent_state":
                if (!value && !formData.sameAddress) error = "Permanent State is required";
                break;
            case "permanent_district":
                if (!value && !formData.sameAddress) error = "Permanent District is required";
                break;
            // case "permanent_tehsil":
            //     if (!value && !formData.sameAddress) error = "Permanent Tehsil is required";
            //     break;
            case "permanent_city":
                if (!value && !formData.sameAddress) error = "Permanent City is required";
                break;
            default:
                break;
        }

        return error;
    };


    const handleCheckboxChange = (e) => {
        const { checked } = e.target;

        // Update the state when checkbox is toggled
        setFormData((prevState) => {
            if (checked) {
                // Copy correspondence address values to permanent address if checked
                return {
                    ...prevState,
                    sameAddress: checked,
                    permanent_address: prevState.correspondence_address,
                    permanent_pincode: prevState.correspondence_pincode,
                    permanent_state: prevState.correspondence_state,
                    permanent_district: prevState.correspondence_district,
                    permanent_tehsil: prevState.correspondence_tehsil,
                    permanent_city: prevState.correspondence_city
                };
            } else {
                // Clear permanent address fields if unchecked
                return {
                    ...prevState,
                    sameAddress: checked,
                    permanent_address: "",
                    permanent_pincode: "",
                    permanent_state: "",
                    permanent_district: "",
                    permanent_tehsil: "",
                    permanent_city: ""
                };
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData({
            ...formData,
            [name]: value,
        });

        // Validate the changed field
        const error = validateField(name, value);

        // Update form errors
        setFormErrors({
            ...formErrors,
            [name]: error,
        });

        console.log(formData);

    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // Validate all fields
    //     const errors = {};
    //     Object.keys(formData).forEach((field) => {
    //         const error = validateField(field, formData[field]);
    //         if (error) {
    //             errors[field] = error;
    //         }
    //     });

    //     if (Object.keys(errors).length > 0) {
    //         setFormErrors(errors);
    //     } else {
    //         console.log("Form data is valid:", formData);
    //         setProfileFormData(formData);
    //         // Proceed with form submission (e.g., send to server)
    //     }
    // };

    const handleSubmit = () => {
        console.log("entered handle submit button");
        
        const errors = {};
        Object.keys(formData).forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                errors[field] = error;
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // Show errors
            return false; // Prevent submission
        } else {
            console.log("Form data is valid:", formData);
            setProfileFormData(formData); // Save valid data
            return formData; // Indicate success
        }
    };



    return (
        <Form ref={formRef} onSubmit={handleSubmit}>
            <h5 className="mb-3">Personal Details</h5>
            <Row>
                {/* Name of Student */}
                <Label className="form-label">Name of Student</Label>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="last-name">Last Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="last-name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.last_name}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="first-name">First Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="first-name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.first_name}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="middle-name">Middle Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="middle-name"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.middle_name}</span>
                    </div>
                </Col>
            </Row>

            {/* Other Fields */}

            <Row>
                <Label className="form-label">Father's Name</Label>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="father_last_name">Last Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="father_last_name"
                            name="father_last_name"
                            value={formData.father_last_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.father_last_name}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="father_first_name">First Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="father_first_name"
                            name="father_first_name"
                            value={formData.father_first_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.father_first_name}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="father_middle_name">Middle Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="father_middle_name"
                            name="father_middle_name"
                            value={formData.father_middle_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.father_middle_name}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="aadhar-name">Name as per Aadhar <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="aadhar-name"
                            name="name_as_per_aadhar"
                            value={formData.name_as_per_aadhar}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.name_as_per_aadhar}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="mothers-name">Mother's Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="mothers-name"
                            name="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.mother_name}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">In-house Student <span className="requireField">*</span></Label>
                        <div>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="inhouse-yes"
                                style={{ marginRight: "5px" }}
                                name="in_house_student"
                                value="1"
                                checked={formData.in_house_student === "1"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="inhouse-yes" className="me-3">Yes</Label>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="inhouse-no"
                                style={{ marginRight: "5px" }}
                                name="in_house_student"
                                value="0"
                                checked={formData.in_house_student === "0"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="inhouse-no">No</Label>
                        </div>
                        <span style={{ color: "#ff0909" }}>{formErrors.in_house_student}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="abc-id">ABC ID No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="abc-id"
                            name="abc_id_no"
                            value={formData.abc_id_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.abc_id_no}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">Marital Status <span className="requireField">*</span></Label>
                        <div>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="married"
                                style={{ marginRight: "5px" }}
                                name="marital_status"
                                value="Married"
                                checked={formData.marital_status === "Married"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="married" className="me-3">Married</Label>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="unmarried"
                                style={{ marginRight: "5px" }}
                                name="marital_status"
                                value="Unmarried"
                                checked={formData.marital_status === "Unmarried"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="unmarried">Unmarried</Label>
                        </div>
                        <span style={{ color: "#ff0909" }}>{formErrors.marital_status}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="dob">Date of Birth <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="date"
                            className="form-control"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.dob}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">Gender <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="select"
                            className="form-select"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                        </Input>
                        <span style={{ color: "#ff0909" }}>{formErrors.gender}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="place-of-birth">Place of Birth <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="place-of-birth"
                            name="birth_place"
                            value={formData.birth_place}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.birth_place}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="blood-group">Blood Group <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="blood-group"
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.blood_group}</span>
                    </div>
                </Col>
            </Row>

            {/* Add Remaining Fields */}
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="native-place">Native Place <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="native-place"
                            name="native_place"
                            value={formData.native_place}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.native_place}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">Organ Donor <span className="requireField">*</span></Label>
                        <div>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="donor-yes"
                                style={{ marginRight: "5px" }}
                                name="organ_donor"
                                value="1"
                                checked={formData.organ_donor === "1"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="donor-yes" className="me-3">Yes</Label>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="donor-no"
                                style={{ marginRight: "5px" }}
                                name="organ_donor"
                                value="0"
                                checked={formData.organ_donor === "0"}
                                onChange={handleChange}
                            />{" "}
                            <Label htmlFor="donor-no">No</Label>
                        </div>
                        <span style={{ color: "#ff0909" }}>{formErrors.organ_donor}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* Transaction Type */}
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="transaction-type">Transaction Type <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="transaction-type"
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.transaction_type}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="religion">Religion <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="religion"
                            name="religion"
                            value={formData.religion}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.religion}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="nationality">Nationality <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.nationality}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="udise-no">UDISE No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="udise-no"
                            name="udise_no"
                            value={formData.udise_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.udise_no}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="aadhar-no">Aadhar Card No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="aadhar-no"
                            name="aadhar_no"
                            value={formData.aadhar_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.aadhar_no}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="pre-reg-no">University Pre Registration No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="pre-reg-no"
                            name="university_preregistration_no"
                            value={formData.university_preregistration_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.university_preregistration_no}</span>
                    </div>
                </Col>
            </Row>

            {/* More fields */}
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="eligibility-no">Eligibility No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="eligibility-no"
                            name="eligibility_no"
                            value={formData.eligibility_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.eligibility_no}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="student-mobile">Student's Mobile No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="student-mobile"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.phone}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="alternate-contact">Alternate Contact No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="alternate-contact"
                            name="alternate_no"
                            value={formData.alternate_no}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.alternate_no}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="student-email">Student Email ID <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="email"
                            className="form-control"
                            id="student-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.email}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="parent-phone">Parent Phone No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="parent-phone"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.parent_phone}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="domicile-state">Domicile State <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="domicile-state"
                            name="domicile_state"
                            value={formData.domicile_state}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.domicile_state}</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="admission-category">Admission Category <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="admission-category"
                            name="admission_category"
                            value={formData.admission_category}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.admission_category}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="caste-category">Caste Category <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="caste-category"
                            name="caste_category"
                            value={formData.caste_category}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.caste_category}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="social-reservation">Social Reservation</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="social-reservation"
                            name="social_reservation"
                            value={formData.social_reservation}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.social_reservation}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="caste">Caste <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="caste"
                            name="caste"
                            value={formData.caste}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.caste}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">Physically Handicapped <span className="requireField">*</span></Label>
                        <div>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="phy-handicapped-yes"
                                style={{ marginRight: "5px" }}
                                name="phy_handicapped"
                                value="1"
                                onChange={handleChange}
                            />
                            <Label htmlFor="phy-handicapped-yes" className="me-3">Yes</Label>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="phy-handicapped-no"
                                style={{ marginRight: "5px" }}
                                name="phy_handicapped"
                                value="0"
                                onChange={handleChange}
                            />
                            <Label htmlFor="phy-handicapped-no">No</Label>
                        </div>
                        <span style={{ color: "#ff0909" }}>{formErrors.phy_handicapped}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="learning-disability">Learning Disability No.</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="learning-disability"
                            name="learningDisability"
                            value={formData.learningDisability}
                            onChange={handleChange}
                        />
                        {/* <span style={{ color: "#ff0909" }}>{formErrors.learningDisability}</span> */}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="handicapped-percentage">Handicapped Percentage</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="handicapped-percentage"
                            name="handicap_percentage"
                            value={formData.handicap_percentage}
                            onChange={handleChange}
                        />
                        {/* <span style={{ color: "#ff0909" }}>{formErrors.handicap_percentage}</span> */}
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="mother-tongue">Mother Tongue <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="mother-tongue"
                            name="mother_tongue"
                            value={formData.mother_tongue}
                            onChange={handleChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.mother_tongue}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label">Do you wish to join NCC/NSS? <span className="requireField">*</span></Label>
                        <div>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="ncc-nss-yes"
                                style={{ marginRight: "5px" }}
                                name="ncc_nss"
                                value="1"
                                onChange={handleChange}
                            />
                            <Label htmlFor="ncc-nss-yes" className="me-3">Yes</Label>
                            <Input
                                disabled={disabled}
                                type="radio"
                                id="ncc-nss-no"
                                style={{ marginRight: "5px" }}
                                name="ncc_nss"
                                value="0"
                                onChange={handleChange}
                            />
                            <Label htmlFor="ncc-nss-no">No</Label>
                        </div>
                        <span style={{ color: "#ff0909" }}>{formErrors.ncc_nss}</span>
                    </div>
                </Col>
            </Row>


            {/* Correspondence Address */}
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-address">Address of Correspondence <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-address"
                            name="correspondence_address"
                            value={formData.correspondence_address}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_address}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-pin-code">Pin Code <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-pin-code"
                            name="correspondence_pincode"
                            value={formData.correspondence_pincode}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_pincode}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-state">State <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-state"
                            name="correspondence_state"
                            value={formData.correspondence_state}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_state}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-district">District <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-district"
                            name="correspondence_district"
                            value={formData.correspondence_district}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_district}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-tehsil">Tehsil</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-tehsil"
                            name="correspondence_tehsil"
                            value={formData.correspondence_tehsil}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_tehsil}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="corr-city">City <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            className="form-control"
                            id="corr-city"
                            name="correspondence_city"
                            value={formData.correspondence_city}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.correspondence_city}</span>
                    </div>
                </Col>
            </Row>


            {/* Checkbox for Same Address */}
            <Row>
                <Col lg="12">
                    {/* <div className="form-check mb-4">
                        <Input
                        disabled={disabled}
                            type="checkbox"
                            className="form-check-input"
                            id="same-address"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    document.getElementById("perm-address").value = document.getElementById("corr-address").value;
                                    document.getElementById("perm-pin-code").value = document.getElementById("corr-pin-code").value;
                                    document.getElementById("perm-state").value = document.getElementById("corr-state").value;
                                    document.getElementById("perm-district").value = document.getElementById("corr-district").value;
                                    document.getElementById("perm-tehsil").value = document.getElementById("corr-tehsil").value;
                                    document.getElementById("perm-city").value = document.getElementById("corr-city").value;
                                } else {
                                    document.getElementById("perm-address").value = "";
                                    document.getElementById("perm-pin-code").value = "";
                                    document.getElementById("perm-state").value = "";
                                    document.getElementById("perm-district").value = "";
                                    document.getElementById("perm-tehsil").value = "";
                                    document.getElementById("perm-city").value = "";
                                }
                            }}
                        />
                        <Label className="form-check-label" htmlFor="same-address">Is your Permanent Address the same as your Correspondence Address? <span className="requireField">*</span></Label>
                    </div> */}
                    <div className="form-check mb-4">
                        <Input
                            disabled={disabled}
                            type="checkbox"
                            className="form-check-input"
                            id="same-address"
                            checked={formData.sameAddress}
                            onChange={handleCheckboxChange}
                        />
                        <Label className="form-check-label" htmlFor="same-address">
                            Is your Permanent Address the same as your Correspondence Address?
                            <span className="requireField">*</span></Label>
                    </div>
                </Col>
            </Row>

            {/* Permanent Address */}
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-address">Permanent Address <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-address"
                            name="permanent_address"
                            value={formData.permanent_address}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_address}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-pin-code">Pin Code <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-pin-code"
                            name="permanent_pincode"
                            value={formData.permanent_pincode}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_pincode}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-state">State <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-state"
                            name="permanent_state"
                            value={formData.permanent_state}
                            onChange={handleInputChange}
                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_state}</span>
                    </div>
                </Col>
                <Col lg="4">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-district">District <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-district"
                            name="permanent_district"
                            value={formData.permanent_district}
                            onChange={handleInputChange}

                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_district}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-tehsil">Tehsil</Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-tehsil"
                            name="permanent_tehsil"
                            value={formData.permanent_tehsil}
                            onChange={handleInputChange}

                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_tehsil}</span>
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="perm-city">City <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled || formData.sameAddress}
                            type="text"
                            className="form-control"
                            id="perm-city"
                            name="permanent_city"
                            value={formData.permanent_city}
                            onChange={handleInputChange}

                        />
                        <span style={{ color: "#ff0909" }}>{formErrors.permanent_city}</span>
                    </div>
                </Col>
            </Row>
            {/* <Button disabled={disabled} color="primary" type="submit">Submit</Button> */}
        </Form>
    );
});

export default PersonalDetails;
