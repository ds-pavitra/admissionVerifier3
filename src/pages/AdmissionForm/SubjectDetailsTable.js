import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { apiBaseUrl, apiRequestAsync } from "../../common/data/userData";

const SubjectDetailsTable = forwardRef(({ setSubjectDetailsTable }, ref) => {

  const [data, setData] = useState([]);

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit()
  }));

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await apiRequestAsync("get", `${apiBaseUrl}/subject`, null);

      if (response.status === 200) {
        console.log(response);
        setData(response.result);
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

  // Handle Submit: Format and set subjectDetailsTable
  const handleSubmit = () => {
    const formattedData = {
      subject_details: data.map((item) => ({
        group_id: item.group_id,
        subject_id: item.id
      }))
    };

    setSubjectDetailsTable(formattedData);
    console.log("Formatted Data Submitted:", formattedData);
    return formattedData ;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h4 style={{ marginBottom: "10px" }}>7. Subject Details Section</h4>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid black" }}>
            <th style={thTdStyle}>Sr. No.</th>
            <th style={thTdStyle}>Group Name</th>
            <th style={thTdStyle}>Subject Name</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid black" }}>
                <td style={thTdStyle}>{index + 1}</td>
                <td style={thTdStyle}>{item.group_name}</td>
                <td style={thTdStyle}>{item.subject_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <button
        disabled={disabled}
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
        }}
        className="btn btn-primary"
      >
        Submit
      </button> */}
    </div>
  );
});

// Common table cell style
const thTdStyle = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "left",
};

export default SubjectDetailsTable;
