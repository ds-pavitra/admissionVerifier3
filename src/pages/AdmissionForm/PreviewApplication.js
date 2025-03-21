import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import universityLogo from "../../assets/images/print/universityLogo.png";
// import profilePhoto from "../../assets/images/print/profilePhoto.png";
// import signature from "../../assets/images/print/signature.png";
import { apiBaseUrl, apiRequestAsync, StorageUrl, customformatDate } from "../../common/data/userData";


Modal.setAppElement("#root"); // Needed for accessibility

const PreviewApplication = ({disabled}) => {

    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();
    const [signature, setSignature] = useState();

    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);

            if (response.status === 200) {
                console.log(response);
                setData(response.result);
                setProfile(`${StorageUrl}${response.result.personal_data.profile}`);
                setSignature(`${StorageUrl}${response.result.personal_data.signature}`);
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
        fetchData();
    }, []);



    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const footerStyle = {
        textAlign: "right",
        fontSize: "12px",
        marginTop: "10px",
    };

    return (
        <div>
            <button
                onClick={openModal}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                disabled={disabled}
            >
                Preview Form
            </button>

            {/* Modal for Preview */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Print Preview"
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                    content: {
                        width: "80%",
                        height: "80%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                    },
                }}
            >
                <h2 style={{ textAlign: "center" }}>Application Form Preview</h2>

                <div id="printable-form">
                    <style>
                        {`
                             table {
                                border-collapse: collapse;
                                border: 1px solid black;
                                color: black;
                                width: 100%;
                                font-size: 12px;
                            }

                            td {
                                border: 1px solid black;
                                padding: 5px 5px 5px 10px;
                            }

                            .bold {
                                font-weight: bold;
                            }

                            .center {
                                text-align: center;
                            }

                            .bt-none {
                                border-top: none;
                            }

                            .b-none {
                                border: none;
                            }
                            .spinner {
                                border: 4px solid rgba(255, 255, 255, 0.3);
                                border-top: 4px solid #3498db;
                                border-radius: 50%;
                                width: 50px;
                                height: 50px;
                                animation: spin 1s linear infinite;
                            }

                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>

                    <div id="loader" style={{
                        display: 'none',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div className="spinner"></div>
                    </div>
                    <table id="table1">
                        <tbody>
                            <tr>
                                <td rowSpan="2" width="154" style={{ textAlign: "center" }}>
                                    <img src={universityLogo} width="154" alt='university logo' />
                                </td>
                                <td rowSpan="2" width="402" className="center bold">
                                    VIDYAVARDHINI'S A.V. COLLEGE<br />
                                    ARTS, K.M. COLLEGE OF COMMERCE & E.S. ANDRADES COLLEGE OF SCIENCE<br />
                                    (Affiliated to the University of Mumbai NAAC Accredited B+ Grade)<br /><br />
                                    NAVGHAR ROAD, BESIDE VASAI ROAD RAILWAY STATION, VASAI (W), DIST. PALGHAR(MS) 401202<br />
                                    <b>UNIVERSITY OF MUMBAI</b>
                                </td>
                                <td width="121" className="center bold">College Code: 361</td>
                                <td rowSpan="2" width="142" style={{ textAlign: "center" }}>
                                    <img src={profile} width="142" alt='profile' />
                                </td>
                            </tr>
                            <tr>
                                <td width="121" className="center bold">
                                    Application No. {data?.personal_data?.application_no?.toUpperCase() || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan="3" width="154" className="bold">For College use only</td>
                                <td> <b>Course Applied For:</b> {data?.personal_data?.course_name?.toUpperCase() || "N/A"}</td>
                                <td rowSpan="3" width="121" className="center bold">Registration No. 2980916</td>
                                <td rowSpan="3" width="142" style={{ textAlign: "center" }}>
                                    <img src={signature} width="142" height="80" alt='signature' />
                                </td>
                            </tr>
                            <tr>
                                <td><b>Medium:</b> ENGLISH MEDIUM</td>
                            </tr>
                            <tr>
                                <td><b>Registration Date:</b> {customformatDate(new Date(), 'dd-mm-yyyy', '/')}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table2" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="4" className="bold bt-none">1. Personal Information Section</td>
                            </tr>
                            <tr>
                                <td width="175"></td>
                                <td width="174" className="bold">Last Name</td>
                                <td width="167" className="bold">First Name</td>
                                <td width="206" className="bold">Middle Name</td>
                            </tr>
                            <tr>
                                <td width="175" className="bold">Name of Student</td>
                                <td width="174">{data?.personal_data?.last_name?.toUpperCase() || "N/A"}</td>
                                <td width="167">{data?.personal_data?.first_name?.toUpperCase() || "N/A"}</td>
                                <td width="206">{data?.personal_data?.middle_name?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="175" className="bold">Father's Name</td>
                                <td width="174">{data?.personal_data?.father_last_name?.toUpperCase() || "N/A"}</td>
                                <td width="167">{data?.personal_data?.father_first_name?.toUpperCase() || "N/A"}</td>
                                <td width="206">{data?.personal_data?.father_middle_name?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="175" className="bold">Name as per Aadhar:</td>
                                <td colSpan="3" width="547">{data?.personal_data?.name_as_per_aadhar?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table3" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="2" width="429" className="bt-none"><b>Mother's Name:</b> {data?.personal_data?.mother_name?.toUpperCase() || "N/A"}</td>
                                <td colSpan="2" width="347" className="bt-none">
                                    <b>In-House Student:</b> {data?.personal_data?.in_house_student === 1 ? "YES" : "NO"}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" width="429"><b>Marital Status:</b> {data?.personal_data?.marital_status?.toUpperCase() || "N/A"}</td>
                                <td colSpan="2" width="347"><b>ABC ID No. :</b> {data?.personal_data?.abc_id_no?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" width="429"><b>Date of Birth:</b> {data?.personal_data?.dob?.toUpperCase() || "N/A"}</td>
                                <td colSpan="2" width="347"><b>Gender:</b> {data?.personal_data?.gender?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" width="429"><b>Place of Birth:</b> {data?.personal_data?.birth_place?.toUpperCase() || "N/A"}</td>
                                <td colSpan="2" width="347"><b>Blood Group:</b> {data?.personal_data?.blood_group?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table width="819" id="table4" className="bt-none">
                        <tbody>
                            <tr>
                                <td width="332" className="bt-none"><b>Native Place:</b> {data?.personal_data?.native_place?.toUpperCase() || "N/A"}</td>
                                <td width="336" className="bt-none"><b>Organ Donor:</b> {data?.personal_data?.organ_donor === 1 ? "YES" : "NO"}</td>
                                <td width="243" className="bt-none"><b>Transaction Type:</b> {data?.personal_data?.transaction_type?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><b>Religion:</b> {data?.personal_data?.religion?.toUpperCase() || "N/A"}</td>
                                <td><b>Nationality:</b> {data?.personal_data?.nationality?.toUpperCase() || "N/A"}</td>
                                <td><b>UDISE No.</b> {data?.personal_data?.udise_no?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><b>Aadhaar card No.:</b> {data?.personal_data?.aadhar_no?.toUpperCase() || "N/A"}</td>
                                <td><b>University Pre Registration No.:</b> {data?.personal_data?.university_preregistration_no?.toUpperCase() || "N/A"}</td>
                                <td><b>Eligibility No.:</b> {data?.personal_data?.eligibility_no?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table5" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="4" width="715" className="bold bt-none">2. Address Details</td>
                            </tr>
                            <tr>
                                <td width="220" className="bold">Address of Correspondence:</td>
                                <td width="332" colSpan="2">{data?.address_data?.correspondence_address?.toUpperCase() || "N/A"}</td>
                                <td width="180"><b>Pin Code:</b> {data?.address_data?.correspondence_pincode || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="220"><b>State:</b> {data?.address_data?.correspondence_state?.toUpperCase() || "N/A"}</td>
                                <td width="166"><b>District:</b> {data?.address_data?.correspondence_district?.toUpperCase() || "N/A"}</td>
                                <td width="166"> <b>Tehsil:</b> {data?.address_data?.correspondence_tehsil?.toUpperCase() || "N/A"}</td>
                                <td width="180"><b>City:</b> {data?.address_data?.correspondence_city?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="220" className="bold">Permanent Address:</td>
                                <td width="332" colSpan="2">{data?.address_data?.permanent_address?.toUpperCase() || "N/A"}</td>
                                <td width="180"><b>Pin Code:</b> {data?.address_data?.permanent_pincode || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="220"><b>State:</b> {data?.address_data?.permanent_state?.toUpperCase() || "N/A"}</td>
                                <td width="166"><b>District:</b> {data?.address_data?.permanent_district?.toUpperCase() || "N/A"}</td>
                                <td width="166"><b>Tehsil:</b> {data?.address_data?.permanent_tehsil?.toUpperCase() || "N/A"}</td>
                                <td width="180"><b>City:</b> {data?.address_data?.permanent_city?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table6" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="2" width="819" className="bold bt-none">3. Contact Details</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Student Mobile No.:</b> {data?.personal_data?.phone?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Alternate Contact Number:</b> {data?.personal_data?.alternate_no?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Student Email Id:</b> {data?.personal_data?.email?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Parent phone:</b> {data?.personal_data?.parent_phone?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table7" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="2" width="819" className="bold bt-none">4. Legal Reservation Information Section</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Domicile state:</b> {data?.legal_reservation_data?.domicile_state?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Admission Category:</b> {data?.legal_reservation_data?.admission_category?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Caste Category:</b> {data?.legal_reservation_data?.caste_category?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Social Reservation: </b> {data?.legal_reservation_data?.social_reservation?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Caste: </b> {data?.legal_reservation_data?.caste?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Phy. Handicapped:</b> {data?.legal_reservation_data?.phy_handicapped === 1 ? "YES" : "NO"}</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Learning Disability No.:</b> {data?.legal_reservation_data?.learning_disability_no?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>HANDICAP PRECENTAGE:</b> {data?.legal_reservation_data?.handicap_percentage?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td width="410"><b>Mother Tongue:</b> {data?.legal_reservation_data?.mother_tongue?.toUpperCase() || "N/A"}</td>
                                <td width="410"><b>Do you wish to join NCC / NSS:</b> {data?.legal_reservation_data?.ncc_nss === 1 ? "YES" : "NO"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table8" width="819">
                        <tbody>
                            <tr>
                                <td colSpan="11" width="819" className="b-none"><b>5. Examination Details Section</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td rowSpan="5" className="b-none"> </td>
                                <td><b>Name of Examination</b></td>
                                <td><b>Name of Board</b></td>
                                <td><b>Name of school/College</b></td>
                                <td width="50"><b>YEAR of Passing</b></td>
                                <td><b>Examination Seat Number</b></td>
                                <td><b>Grade/Total Marks</b></td>
                                <td><b>Obt. Marks</b></td>
                                <td><b>%</b></td>
                                <td><b>CGPA</b></td>
                                <td rowSpan="5" className="b-none"> </td>
                            </tr>
                            {/* Dynamic Rows */}
                            {data?.education_data?.map((item, index) => (
                                <tr key={index} style={{ textAlign: "center", border: "1px solid black", textTransform: "uppercase" }}>
                                    <td>{item.exam_name}</td>
                                    <td>{item.board_name}</td>
                                    <td>{item.school_name}</td>
                                    <td>{item.passing_year}</td>
                                    <td>{item.exam_seat_no}</td>
                                    <td>{item.total_marks}</td>
                                    <td>{item.obtained_marks}</td>
                                    <td>{item.percentage}</td>
                                    <td>{item.cgpa}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="9" className="b-none"> </td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="table9" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="10" width="819" className="bt-none b-none"><b>6. Qualifying Exam Details Section<br />
                                    QUALIFYING EXAM NAME: {data?.qualifying_exam_data?.exam_name?.toUpperCase() || "N/A"}</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td rowSpan="3" className="b-none"> </td>
                                <td><b>College/School Attended</b></td>
                                <td><b>Board/university</b></td>
                                <td><b>Passing Year</b></td>
                                <td><b>Marks Obt.</b></td>
                                <td><b>Total Marks</b></td>
                                <td><b>Percentage</b></td>
                                <td><b>Arts/Com/Sci</b></td>
                                <td><b>Education Gap</b></td>
                                <td rowSpan="3" className="b-none"> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>{data?.qualifying_exam_data?.college_attended?.toUpperCase() || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.board_university?.toUpperCase() || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.passing_year || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.obtained_marks || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.total_marks || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.percentage || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.stream?.toUpperCase() || "N/A"}</td>
                                <td>{data?.qualifying_exam_data?.education_gap === 1 ? "YES" : "NO"}</td>
                            </tr>
                            <tr>
                                <td colSpan="8" className="b-none"> </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table10" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="5" width="819" className="b-none"><b>7. Subject Details Section</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td rowSpan="6" className="b-none"> </td>
                                <td width="50"><b>Sr. No.</b></td>
                                <td width="80"><b>Group Name</b></td>
                                <td><b>Subject Name</b></td>
                                <td rowSpan="6" className="b-none"> </td>
                            </tr>
                            {data?.subject_data?.map((item, index) => (
                                <tr key={index} style={{ textAlign: "center", textTransform: "uppercase" }}>
                                    <td>{index + 1}</td>
                                    <td>{item.group_name}</td>
                                    <td>{item.subject_name}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3" className="b-none"> </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table11" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="4" width="819" className="b-none"><b>8. Attached Documents</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td rowSpan="8" className="b-none"> </td>
                                <td><b>Sr No.</b></td>
                                <td><b>Name of Documents/Certificate</b></td>
                                <td rowSpan="8" className="b-none"> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>1</td>
                                <td>AADHAR CARD</td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>2</td>
                                <td>CASTE CERTIFICATE</td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>3</td>
                                <td>H.S.C MARKSHEET</td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>4</td>
                                <td>S.S.C MARKSHEET</td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>5</td>
                                <td>HSC LEAVING CERTIFICATE</td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>6</td>
                                <td>UNIVERSITY PRE ENROLLMENT FORM BCOM</td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="b-none"> </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table12" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="2" width="819" className="bt-none"><b>9. Guardian / Parent Information Section</b></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><b>Guardian's/ Parent's Name:</b> {data?.parent_data?.parent_name?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><b>Occupation of the Guardian/Parent:</b> {data?.parent_data?.occupation?.toUpperCase() || "N/A"}</td>
                                <td><b>Annual Income of the guardian/Parent:</b> {data?.parent_data?.annual_income || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><b>Relationship of Guardian with applicant:</b> {data?.parent_data?.relation_with_applicant?.toUpperCase() || "N/A"}</td>
                                <td><b>Guardian/Parent Phone No.:</b> {data?.parent_data?.parent_phone?.toUpperCase() || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table13" width="819" className="bt-none">
                        <tbody>
                            <tr>
                                <td colSpan="2" width="819" className="bt-none"><b>10. Other Information Section</b></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><b>Employment Status:</b> {data?.other_data?.employement_status === 1 ? "YES" : "NO"}</td>
                            </tr>
                            <tr>
                                <td colSpan="2"><b>Hobbies, Proficiency and Other interests:</b> {data?.other_data?.hobbies?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td colSpan="2"><b>Games and sports participation:</b> {data?.other_data?.sports_participation?.toUpperCase() || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><b>Identification Mark 1:</b> {data?.other_data?.identification_mark1?.toUpperCase() || ""}</td>
                                <td><b>Identification Mark 2:</b> {data?.other_data?.identification_mark2?.toUpperCase() || ""}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table14" width="819">
                        <tbody>
                            <tr>
                                <td width="819" className="bt-none"><b>11. Declaration by Student</b></td>
                            </tr>
                            <tr>
                                <td style={{ paddingLeft: "100px", paddingRight: "100px", textAlign: "justify" }} width="854">                       I hereby declare that, I have read the rules related to admission
                                    and the information. filled in by me in this form is accurate and true to the best of my knowledge.
                                    I will be responsible for any discrepancy, arising out of the form signed by me and I undertake
                                    that, in absence of any document the final admission not be granted and/or admission will stand
                                    cancel.<br /><br />Place:<br /><br />Date:
                                    <img className="signatureDeclaration" style={{ marginLeft: "75%" }} width="142" height="80" src={signature} alt="signature" />
                                    <br /><br />
                                    <b style={{ float: "right", marginRight: "85px" }}>Signature of Student</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>12. GROUP INSURANCE FORM</b>:</td>
                            </tr>
                            <tr>
                                <td width="819" style={{ textAlign: "center", border: "none" }}>GROUP INSURANCE FORM ATTACHED WITH ADMISSION
                                    FORM<br /><br /><b>VIDYAVARDHINI'S<br />A.V.COLLEGE
                                        OF ARTS, K.M. COLLEGE OF COMMERCE AND E.S.A. COLLEGE OF SCIENCE, VASAI ROAD, DIST. PALGHAR,
                                        401</b>
                                    202<br /><br />"YUVA RAKSHA"<br />(Group Insurance Scheme for Students)<br />STUDENT'S REGISTRATION
                                    FORM<br />(Copy to be submitted alongwith the Admission Form)</td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>1) Name of Insured (Student)
                                    <span style={{ marginLeft: "12%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>2) Class
                                    <span style={{ marginLeft: "22.8%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>3) Residential Address
                                    <span style={{ marginLeft: "15.3%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>4) Mobile No./Contact No.
                                    <span style={{ marginLeft: "13.8%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>5) Blood Group
                                    <span style={{ marginLeft: "19.2%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>6) Name of Guardian
                                    <span style={{ marginLeft: "16.3%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }}>7) Guardian Mobile No
                                    <span style={{ marginLeft: "15.3%" }}>:______________________________________________________</span></td>
                            </tr>
                            <tr>
                                <td style={{ border: "none" }}> </td>
                            </tr>
                            <tr>
                                <td style={{ border: "none", paddingLeft: "100px" }} width="854">8) Amount of Premium Paid in  <span style={{ marginLeft: "10.8%" }}>:   Rs. 40/- (Rupees Forty
                                    only)</span><br /><br /><b>Note:
                                        Subject
                                        to be changed as per the Insurance is circular, claim will be start form the actual payment of
                                        premium to insurance company not from the date of
                                        Admission.</b><br /><br /><br /><br />
                                    <img width="142" height="80" style={{ marginLeft: "42%" }} className="signaturePremium" src={signature} alt="signature" /><br />
                                    <br />                      <b>Parent's/Guardian
                                        Signature</b>                                                                            <b>Student's
                                            Signature</b><br /><br /><b>FOR
                                                OFFICE USE ONLY:</b>-<br /><br />Received from student
                                    (Name____________________________of________________ course)<br /><br />Premium Rs. 40/- against the
                                    Receipt No.____________________dated__________________
                                    <br />
                                    <br /><br /><br />
                                    <b style={{ marginLeft: "75%" }}>Head</b><br />
                                    <b style={{ marginLeft: "62%" }}>Institute/Department/College Seal/Stamp with Signature</b><br /><br />(College to preserve the
                                    slip
                                    along with Admission form)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table15" width="819">
                        <tbody>
                            <tr>
                                <td width="819" className="bt-none"><b>13. ANTI-RAGGING AND UDERTAKING FORM:</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td width="819" style={{ border: "none" }}>VIDYAVARDHINI'S<br />A.V.COLLEGE OF ARTS, K.M. COLLEGE OF COMMERCE AND E.S.A. COLLEGE OF
                                    SCIENCE, VASAI ROAD, DIST. PALGHAR, 401 202<br /><br /><b>ANTI RAGGING UNDERTAKINGS (AFFIDAVITS) BY
                                        STUDENTS
                                        AND PARENTS/GUARDIANS</b><br /><br />TO BE FILLED BY A STUDENT (Online &amp; submit printout
                                    along
                                    with
                                    admission form) www.amanmovement.org Fields marker with are compulsory.</td>
                            </tr>
                            <tr>
                                <td width="819" style={{ padding: "15px 120px", border: "none" }}>★ If you do not have an Email address please create on
                                    before you fill in this
                                    form.<br />★ If your mother or father or guardian does not have a phone or a mobile phone or email
                                    then please give the numbers/email of their friends or relations or neighbors.<br />★ If you do not
                                    have a mobile number, then please give the mobile number of your friend in the college.<br />A
                                    filling this form successfully you will receive the Student's Anti Ragging Undertaking (Affidavit)
                                    and the Parents Anti Ragging Undertaking (Affidavit) in you Email. Please print both the
                                    Undertakings (Affidavit). Sign them yourself, request your parents to read the details and request
                                    them to sign their undertaking (Affidavit) and then present both at your college at the time of
                                    registration each year.</td>
                            </tr>
                            <tr>
                                <td width="819" style={{ border: "none", paddingLeft: "10%" }}><b>Students Personal Details:</b><br /><b style={{ marginRight: "10%" }}>Name    </b>:
                                    ____________________________________________________________________________________<br />
                                    <span style={{ marginLeft: "17%" }}>(Surname)</span><span style={{ marginLeft: "5%" }}>(Students Name)</span><span style={{ marginLeft: "5%" }}> (Father
                                        Name)</span><span style={{ marginLeft: "5%" }}>(Mother Name)</span><br /><br /><b style={{ marginRight: "10%" }}>Gender</b> :
                                    Male,
                                    Female   Nationality :  ______________<br /><br /><b style={{ marginRight: "4.3%" }}>Student's Mob. No.</b>
                                    :____________________
                                    Incase of Emergency contact Mob. No. : _________________<br /><br /><b style={{ marginRight: "4.2%" }}>Student's Email
                                        ID </b>
                                    :___________________________________________________ Landline No. : ________________________________<br /><br /><b style={{ marginRight: "3.5%" }}>Permanent
                                        Address </b>
                                    :_______________________________________________________________________<br />
                                    <br />
                                    <span style={{ marginLeft: "14.2%" }}>_______________________________________________________________________</span><br /><br /><b>Parent/Guardian
                                        Details:</b><br /><br /><b style={{ marginRight: "3.5%" }}>Parent/Guardian Name </b>
                                    :_______________________________________________________________________<br /><br /><b style={{ marginRight: "0.7%" }}>Parent/Guardian
                                        Occupation</b> : _______________________ Parent/Guardian Mob. No.
                                    ______________________<br /><br /><b style={{ marginRight: "1.9%" }}>Parent/Guardian Address  </b>
                                    :_______________________________________________________________________<br /><br />
                                    <span style={{ marginLeft: "15.8%" }}>_______________________________________________________________________</span><br /><br />State in which
                                    College is:<b> Maharashtra</b><br />Is it a professional or general College:<b>
                                        General</b><br />Name of the
                                    College : <b>Vidyavardhini's A.V.College of Arts, K.M. College of Commerce &amp;
                                        E.S.A.<br />                                    College of Science, Vasai Road, (W). Dist.
                                        Palghar.</b><br />Name of Affiliating University: <b>Mumbai University</b><br />Is it deemed
                                    University:
                                    <b>No</b><br />Principal Name: <b>Dr. Arvind W. Ubale College Phone No.
                                        0250-2332017</b><br />College Email
                                    ID:<br />Nearest Police Station Name &amp; Address:<b> Manikpur Police Station, Ambadi Road, Vasai
                                        Road
                                        (w)</b><br /><br /><br /><b>Course Details:</b><br />Under Graduate of Post Graduate:
                                    <b>Undergraduate</b><br />Note:
                                    <b> Online Registration of this form is compulsory for all the students.</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>14. Declaration by Guardian / Parent</b></td>
                            </tr>
                            <tr>
                                <td width="819" style={{ paddingLeft: "100px", paddingRight: "100px" }}>                              I have permitted my son / daughter / ward to join your
                                    college. The information supplied by him/her is correct to the best of my knowledge. I have
                                    acquainted myself with the rules and fees, dues to my son/daughter/ward and see that he/she
                                    observes.<br /><br />Place:<br /><br />Date:
                                    <span style={{ float: "right" }}>Signature of the Guardian/Parent</span>
                                    <br />
                                    <br />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table16" width="819" style={{marginBottom:"20px"}}>
                        <tbody>
                            <tr>
                                <td colSpan="3" width="819" className="bt-none"><b>15. For College / Institute Use Only</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td><b>Designation</b></td>
                                <td><b>Remarks/Particular / Recommendation</b></td>
                                <td><b>Signature and Date</b></td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>Admission Clerk</td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>Admission Committee</td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>Accountant/cashier</td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>Registrar/Office superintendent</td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td>Transaction Details</td>
                                <td style={{fontSize:"10px"}}>Payment Mode: ONLINE         Cash Received: 150       Transaction ID: FUUPIU862682C4F22</td>
                                <td> </td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table17" width="819">
                        <tbody width="819">
                            <tr style={{ textAlign: "center" }}>
                                <td colSpan="3" width="819" className="b-none"><b>REMARK OF THE ADMISSION COMMITTEE</b></td>
                            </tr>
                            <tr width="819">
                                <td style={{ paddingLeft: "10%", paddingRight: "10%" }} colSpan="3" width="819" className="bt-none">          <br /> May                     be          admitted
                                    to
                                    Class_______________________________________________________________  Section__________________<br /><br />
                                    May be Rejected_________________________________________________________________________________<br /><br />
                                    Last date of payment of fees______________________________________________________________________<br /><br />
                                    Admission may be cancelled if the fees are not paid by this date.<br /><br />
                                    Principal
                                    <span style={{ float: "right", marginRight: "85px" }}>Signature of Admission Committee</span><br /><br /> Date:                    <br /><br /> </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={footerStyle}>
                    <p>Print Date : {new Date().toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PreviewApplication;
