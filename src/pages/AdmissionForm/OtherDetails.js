import React, { useState, useEffect } from "react";
import { Form, Label, Input, Row, Col, FormGroup, FormFeedback } from "reactstrap";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const OtherDetails = ({ setOtherDetailsFormData, disabled }) => {
    const [formData, setFormData] = useState({
        parent_name: "",
        occupation: "",
        annual_income: "",
        relation_with_applicant: "",
        parent_phone: "",
        employement_status: 0,
        hobbies: "",
        sports_participation: "",
        identification_mark1: "",
        identification_mark2: "",
        student_declaration: false,
    });

    const [errors, setErrors] = useState({});

    const fetchPersonalDetails = async () => {
        try {
            const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);

            if (response.status === 200) {
                console.log(response);
                setFormData((prevData) => ({
                    ...prevData,
                    ...response.result.other_data,
                    ...response.result.parent_data
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

        if (authUser && authUser.form_details.other_details === 1) {
            fetchPersonalDetails();
        }
    }, []);

    // Handle change for text inputs, radio buttons, and checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form validation
    const validateForm = () => {
        let newErrors = {};
        if (!formData.parent_name.trim()) newErrors.parent_name = "Guardian's/Parent's name is required.";
        if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required.";
        if (!formData.annual_income.trim()) newErrors.annual_income = "Annual income is required.";
        if (!formData.relation_with_applicant.trim()) newErrors.relation_with_applicant = "Relationship with applicant is required.";
        if (!formData.parent_phone.trim()) {
            newErrors.parent_phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(formData.parent_phone)) {
            newErrors.parent_phone = "Enter a valid 10-digit phone number.";
        }
        if (!formData.hobbies.trim()) newErrors.hobbies = "Hobbies field is required.";
        if (!formData.sports_participation.trim()) newErrors.sports_participation = "Games/Sport participation is required.";
        if (!formData.student_declaration) newErrors.student_declaration = "You must agree to the student declaration.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form Submitted:", formData);
            setOtherDetailsFormData(formData);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h5 className="mb-3">Other Details</h5>

            <Row>
                {/* Guardian/Parent Name - Full Row */}
                <Col lg="12">
                    <FormGroup>
                        <Label htmlFor="parent_name">Guardian's/Parent's Name <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="parent_name"
                            name="parent_name"
                            value={formData.parent_name}
                            onChange={handleChange}
                            invalid={!!errors.parent_name}
                        />
                        <FormFeedback>{errors.parent_name}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="occupation">Occupation of Guardian/Parent <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            invalid={!!errors.occupation}
                        />
                        <FormFeedback>{errors.occupation}</FormFeedback>
                    </FormGroup>
                </Col>

                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="annual_income">Annual Income of Guardian/Parent <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="number"
                            id="annual_income"
                            name="annual_income"
                            value={formData.annual_income}
                            onChange={handleChange}
                            invalid={!!errors.annual_income}
                        />
                        <FormFeedback>{errors.annual_income}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="relation_with_applicant">Relationship of Guardian with Applicant <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="relation_with_applicant"
                            name="relation_with_applicant"
                            value={formData.relation_with_applicant}
                            onChange={handleChange}
                            invalid={!!errors.relation_with_applicant}
                        />
                        <FormFeedback>{errors.relation_with_applicant}</FormFeedback>
                    </FormGroup>
                </Col>

                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="parent_phone">Guardian/Parent Phone No. <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="parent_phone"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={handleChange}
                            invalid={!!errors.parent_phone}
                        />
                        <FormFeedback>{errors.parent_phone}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            {/* Employment Status - Radio Buttons */}
            <Row>
                <Col lg="6">
                    <FormGroup>
                        <Label>Employment Status <span className="requireField">*</span></Label>
                        <div>
                            <FormGroup check inline>
                                <Input
                                    disabled={disabled}
                                    type="radio"
                                    name="employement_status"
                                    value="1"
                                    checked={formData.employement_status === 1}
                                    onChange={handleChange}
                                />
                                <Label check>Yes</Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Input
                                    disabled={disabled}
                                    type="radio"
                                    name="employement_status"
                                    value="0"
                                    checked={formData.employement_status === 0}
                                    onChange={handleChange}
                                />
                                <Label check>No</Label>
                            </FormGroup>
                        </div>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="hobbies">Hobbies, Proficiency and Other Interests <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="textarea"
                            id="hobbies"
                            name="hobbies"
                            value={formData.hobbies}
                            onChange={handleChange}
                            invalid={!!errors.hobbies}
                        />
                        <FormFeedback>{errors.hobbies}</FormFeedback>
                    </FormGroup>
                </Col>

                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="sports_participation">Games and Sports Participation <span className="requireField">*</span></Label>
                        <Input
                            disabled={disabled}
                            type="textarea"
                            id="sports_participation"
                            name="sports_participation"
                            value={formData.sports_participation}
                            onChange={handleChange}
                            invalid={!!errors.sports_participation}
                        />
                        <FormFeedback>{errors.sports_participation}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="identification_mark1">Identification Mark 1</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="identification_mark1"
                            name="identification_mark1"
                            value={formData.identification_mark1}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Col>

                <Col lg="6">
                    <FormGroup>
                        <Label htmlFor="identification_mark2">Identification Mark 2</Label>
                        <Input
                            disabled={disabled}
                            type="text"
                            id="identification_mark2"
                            name="identification_mark2"
                            value={formData.identification_mark2}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Col>
            </Row>

            {/* Student Declaration - Checkbox */}
            <Row>
                <Col lg="12">
                    <FormGroup check>
                        <Input
                            disabled={disabled}
                            type="checkbox"
                            id="student_declaration"
                            name="student_declaration"
                            checked={formData.student_declaration}
                            onChange={handleChange}
                            invalid={!!errors.student_declaration}
                        />
                        <Label check htmlFor="student_declaration">
                            I hereby declare that the information provided is true and correct. <span className="requireField">*</span>
                        </Label>
                        <FormFeedback>{errors.student_declaration}</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>

            {/* Submit Button */}
            <Row>
                <Col lg="12" className="text-center mt-3">
                    <button disabled={disabled} type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </Col>
            </Row>
        </Form>
    );
};

export default OtherDetails;
