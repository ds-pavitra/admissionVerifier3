import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Table, Input } from "reactstrap";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const EducationDetails = forwardRef(({ setEducationFormData, disabled }, ref) => {
    const [formData, setFormData] = useState([
        { exam_name: "SSC", board_name: "", school_name: "", passing_year: "", exam_seat_no: "", total_marks: "", obtained_marks: "", percentage: "", cgpa: "" },
        { exam_name: "HSC", board_name: "", school_name: "", passing_year: "", exam_seat_no: "", total_marks: "", obtained_marks: "", percentage: "", cgpa: "" },
        { exam_name: "FY", board_name: "", school_name: "", passing_year: "", exam_seat_no: "", total_marks: "", obtained_marks: "", percentage: "", cgpa: "" },
        { exam_name: "SY", board_name: "", school_name: "", passing_year: "", exam_seat_no: "", total_marks: "", obtained_marks: "", percentage: "", cgpa: "" },
    ]);

    // Fetch Data from API (Auto-fill previously submitted details)
    useEffect(() => {
        const fetchEducationDetails = async () => {
            try {
                const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);
                if (response.status === 200) {
                    const receivedData = response.result.education_data || [];
                    setFormData((prevFormData) => 
                        prevFormData.map((row) => {
                            const matchedData = receivedData.find((data) => data.exam_name === row.exam_name);
                            return matchedData ? { ...row, ...matchedData } : row;
                        })
                    );
                } else {
                    alert(`${response.data.message}. Please try again.`);
                }
            } catch (error) {
                alert("Network error. Please try again later.");
            }
        };

        const authUser = JSON.parse(localStorage.getItem("authUser"));
        if (authUser && authUser.form_details.educational_details === 1) {
            fetchEducationDetails();
        }
    }, []);

    // Expose handleSubmit for parent access via ref
    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit()
    }));

    const handleSubmit = () => {
        const errors = [];
        let hasSSCData = false;
        let hasHSCData = false;

        const validFormData = formData.filter((row) => {
            const isRowStarted = Object.values(row).some(value => value !== ""); // Check if any field is filled

            if (row.exam_name === "SSC") {
                hasSSCData = isRowStarted; // SSC must be filled
            }

            if (row.exam_name === "HSC") {
                hasHSCData = isRowStarted; // HSC must be filled
            }

            if (isRowStarted) {
                // Ensure all fields in this row are completed
                const isRowComplete = row.exam_name === "SSC" || row.exam_name === "HSC"
                    ? Object.values(row).every(value => value !== "")
                    : true; // Skip validation for FY and SY
                if (!isRowComplete) {
                    errors.push(`${row.exam_name} details must be fully completed.`);
                    return false;
                }
                return true; // Include fully filled row in request
            }
            return false; // Ignore empty rows
        }).map(row => ({
            exam_name: row.exam_name,
            board_name: row.board_name,
            school_name: row.school_name,
            passing_year: row.passing_year ? parseInt(row.passing_year, 10) : "",
            exam_seat_no: row.exam_seat_no,
            total_marks: row.total_marks ? parseInt(row.total_marks, 10) : "",
            obtained_marks: row.obtained_marks ? parseInt(row.obtained_marks, 10) : "",
            percentage: row.percentage ? parseFloat(row.percentage) : "",
            cgpa: row.cgpa ? parseFloat(row.cgpa) : ""
        }));

        if (!hasSSCData) {
            errors.push("SSC details are mandatory.");
        }

        if (!hasHSCData) {
            errors.push("HSC details are mandatory.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return false; // Prevent submission
        }

        const requestObject = { 
            education_details: validFormData.filter(row => 
            Object.keys(row).some(key => key !== "exam_name" && row[key] !== "")
            ) 
        };
        console.log("Final Request Object:", requestObject);
        setEducationFormData(requestObject);
        return requestObject; // Return valid data for API submission
    };
    
    
    

    const handleInputChange = (index, field, value) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    return (
        <div className="education-details-container">
            <h5 className="section-title">Education Details</h5>
            <Table bordered className="education-details-table">
                <thead className="table-header">
                    <tr>
                        <th>Name of Examination</th>
                        <th>Name of Board</th>
                        <th>Name of School/College</th>
                        <th>Year of Passing</th>
                        <th>Examination Seat Number</th>
                        <th>Grade / Total Marks</th>
                        <th>Obt. Marks</th>
                        <th>%</th>
                        <th>CGPA</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.map((data, index) => (
                        <tr key={index} className="table-row">
                            <td className="exam-name">{data.exam_name}</td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="text"
                                    value={data.board_name}
                                    className="input-field"
                                    placeholder="Enter Board Name"
                                    onChange={(e) => handleInputChange(index, "board_name", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="text"
                                    value={data.school_name}
                                    className="input-field"
                                    placeholder="Enter School/College Name"
                                    onChange={(e) => handleInputChange(index, "school_name", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="number"
                                    value={data.passing_year}
                                    className="input-field"
                                    placeholder="YYYY"
                                    onChange={(e) => handleInputChange(index, "passing_year", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="text"
                                    value={data.exam_seat_no}
                                    className="input-field"
                                    placeholder="Enter Seat Number"
                                    onChange={(e) => handleInputChange(index, "exam_seat_no", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="number"
                                    value={data.total_marks}
                                    className="input-field"
                                    placeholder="Enter Total Marks"
                                    onChange={(e) => handleInputChange(index, "total_marks", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="number"
                                    value={data.obtained_marks}
                                    className="input-field"
                                    placeholder="Enter Obtained Marks"
                                    onChange={(e) => handleInputChange(index, "obtained_marks", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="number"
                                    value={data.percentage}
                                    className="input-field"
                                    placeholder="Enter %"
                                    onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
                                />
                            </td>
                            <td>
                                <Input
                                    disabled={disabled}
                                    type="number"
                                    value={data.cgpa}
                                    className="input-field"
                                    placeholder="Enter CGPA"
                                    onChange={(e) => handleInputChange(index, "cgpa", e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
});

export default EducationDetails;
