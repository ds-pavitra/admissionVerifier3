// QualifyingExamDetails.js
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";
import { Form, Label, Input, Row, Col, Button, Table } from "reactstrap";

const QualifyingExamDetails = forwardRef(({ setQualifyingExamFormData, disabled }, ref) => {
    const formRef = useRef();

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit()
    }));

    const [formData, setFormData] = useState({
        qualifying_exam_name: "",
        college_attended: "",
        board_university: "",
        passing_year: "",
        obtained_marks: "",
        total_marks: "",
        percentage: "",
        stream: "",
        education_gap: "0",
    });

    const [formErrors, setFormErrors] = useState({});
    const [submittedData, setSubmittedData] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        const fetchPersonalDetails = async () => {
            try {
                const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);
                if (response.status === 200) {
                    const examData = response.result?.qualifying_exam_data;

                    // Ensure examData is always an array
                    setSubmittedData(examData ? [examData] : []);
                } else {
                    alert(`${response.data.message}. Please try again.`);
                }
            } catch (error) {
                alert("Network error. Please try again later.");
            }
        };

        // Fetch data only if personal details are completed
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        if (authUser?.form_details?.qualifying_exam_details === 1) {
            fetchPersonalDetails();
        }
    }, []);



    // **Validation Function**
    const validate = () => {
        let errors = {};
        if (!formData.qualifying_exam_name.trim()) errors.qualifying_exam_name = "Required";
        if (!formData.college_attended.trim()) errors.college_attended = "Required";
        if (!formData.board_university.trim()) errors.board_university = "Required";
        if (!formData.passing_year.trim() || isNaN(formData.passing_year) || formData.passing_year.length !== 4)
            errors.passing_year = "Enter a valid year";
        if (!formData.obtained_marks.trim() || isNaN(formData.obtained_marks)) errors.obtained_marks = "Enter a valid number";
        if (!formData.total_marks.trim() || isNaN(formData.total_marks)) errors.total_marks = "Enter a valid number";
        if (!formData.percentage.trim() || isNaN(formData.percentage) || formData.percentage > 100)
            errors.percentage = "Enter a valid percentage (0-100)";
        if (!formData.stream.trim()) errors.stream = "Required";
        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = () => {

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        let updatedData;
        if (editingIndex !== null) {
            updatedData = [...submittedData];
            updatedData[editingIndex] = formData;
            setEditingIndex(null);
        } else {
            updatedData = [...submittedData, formData];
        }

        setSubmittedData(updatedData);
        setQualifyingExamFormData(formData);

        setFormData({
            qualifying_exam_name: "",
            college_attended: "",
            board_university: "",
            passing_year: "",
            obtained_marks: "",
            total_marks: "",
            percentage: "",
            stream: "",
            education_gap: "0",
        });
 
        setFormErrors({});
        return formData
    };

    // Handle edit action
    const handleEdit = (index) => {
        const dataToEdit = submittedData[index];
        setFormData(dataToEdit);
        setEditingIndex(index);
        setQualifyingExamFormData(submittedData);
    };

    return (
        <div>

             {/* Table to display submitted data */}
             <div className="mt-4">
                <h5>Submitted Qualifying Exam Details : <b style={{ textTransform: "uppercase" }}>{formData.qualifying_exam_name}</b></h5>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>College/School Attended</th>
                            <th>Board/University</th>
                            <th>Passing Year</th>
                            <th>Marks Obt.</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Arts/Com/Sci</th>
                            <th>Education Gap</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submittedData.length === 0 ? (
                            <tr>
                                <td colSpan="9">&nbsp;</td>
                            </tr>
                        ) : (
                            submittedData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.college_attended}</td>
                                    <td>{data.board_university}</td>
                                    <td>{data.passing_year}</td>
                                    <td>{data.obtained_marks}</td>
                                    <td>{data.total_marks}</td>
                                    <td>{data.percentage}</td>
                                    <td>{data.stream}</td>
                                    <td>{data.education_gap}</td>
                                    <td>
                                        <Button disabled={disabled} color="warning" size="sm" onClick={() => handleEdit(index)}><i className="ri-pencil-fill"></i></Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>


            <Form ref={formRef} onSubmit={handleSubmit}>
                <h5 className="mb-3">Qualifying Exam Details</h5>
                <Row>
                    <Col lg="12">
                        <div className="mb-3">
                            <Label htmlFor="qualifying_exam_name">Qualifying Exam Name <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled}
                                type="text"
                                style={{ textTransform: "uppercase" }}
                                id="qualifying_exam_name"
                                name="qualifying_exam_name"
                                value={formData.qualifying_exam_name}
                                onChange={handleChange}
                            />
                            {formErrors.qualifying_exam_name && <span className="text-danger">{formErrors.qualifying_exam_name}</span>}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label htmlFor="college_attended">College/School Attended <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" id="college_attended" name="college_attended" value={formData.college_attended} onChange={handleChange} />
                            {formErrors.college_attended && <span className="text-danger">{formErrors.college_attended}</span>}
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label htmlFor="board_university">Board/University <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" id="board_university" name="board_university" value={formData.board_university} onChange={handleChange} />
                            {formErrors.board_university && <span className="text-danger">{formErrors.board_university}</span>}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label htmlFor="passing_year">Passing Year <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" id="passing_year" name="passing_year" value={formData.passing_year} onChange={handleChange} />
                            {formErrors.passing_year && <span className="text-danger">{formErrors.passing_year}</span>}
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label htmlFor="obtained_marks">Marks Obtained <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" id="obtained_marks" name="obtained_marks" value={formData.obtained_marks} onChange={handleChange} />
                            {formErrors.obtained_marks && <span className="text-danger">{formErrors.obtained_marks}</span>}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="total_marks">Total Marks <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" className="form-control" id="total_marks" name="total_marks" value={formData.total_marks} onChange={handleChange} />
                            {formErrors.total_marks && <span className="text-danger">{formErrors.total_marks}</span>}
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="percentage">Percentage <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" className="form-control" id="percentage" name="percentage" value={formData.percentage} onChange={handleChange} />
                            {formErrors.percentage && <span className="text-danger">{formErrors.percentage}</span>}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="stream">Arts/Com/Sci <span className="requireField">*</span></Label>
                            <Input
                                disabled={disabled} type="text" className="form-control" id="stream" name="stream" value={formData.stream} onChange={handleChange} />
                            {formErrors.stream && <span className="text-danger">{formErrors.stream}</span>}
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="education_gap">Education Gap <span className="requireField">*</span></Label>
                            <div>
                                <Input
                                    disabled={disabled}
                                    type="radio"
                                    id="education_gapYes"
                                    name="education_gap"
                                    value="1"
                                    checked={formData.education_gap === "1"}
                                    onChange={handleChange}
                                    style={{ marginRight: "5px" }}
                                />
                                <Label htmlFor="education_gapYes" className="mr-3 me-3">Yes</Label>

                                <Input
                                    disabled={disabled}
                                    type="radio"
                                    id="education_gapNo"
                                    name="education_gap"
                                    value="0"
                                    checked={formData.education_gap === "0"}
                                    onChange={handleChange}
                                    style={{ marginRight: "5px" }}
                                />
                                <Label htmlFor="education_gapNo">No</Label>
                                {formErrors.education_gap && <span className="text-danger">{formErrors.education_gap}</span>}
                            </div>
                        </div>
                    </Col>

                </Row>

                {/* Submit Button */}
                {/* <Button type="submit" color="primary">Submit</Button> */}
            </Form>

           
        </div>
    );
});

export default QualifyingExamDetails;
