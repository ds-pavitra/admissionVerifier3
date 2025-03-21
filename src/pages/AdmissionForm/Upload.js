import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { apiBaseUrl, apiRequestAsync, StorageUrl } from "../../common/data/userData";
import { Form, Label, Input, Row, Col, Button, FormFeedback, Spinner } from "reactstrap";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const Upload = forwardRef(({ setUploadsFormData, disabled }, ref) => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({
        photo: null,
        signature: null,
        aadharCard: null,
        casteCertificate: null,
        hscMarksheet: null,
        sscMarksheet: null,
        hscLeavingCertificate: null,
        universityPreEnrollmentForm: null,
    });

    const [errors, setErrors] = useState({});
    const [documents, setDocuments] = useState([]);

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit()
    }));

    useEffect(() => {
        const fetchUploadedDocuments = async () => {
            try {
                const response = await apiRequestAsync("get", `${apiBaseUrl}/applicant`, null);

                if (response.status === 200) {
                    const data = response.result;

                    if (data) {
                        const { document_details, personal_data } = data;

                        // Fetch profile & signature as Base64
                        const profileBase64 = await fetchImageAsBase64(`${StorageUrl}${personal_data.profile}`);
                        const signatureBase64 = await fetchImageAsBase64(`${StorageUrl}${personal_data.signature}`);

                        // Convert other document URLs to base64
                        const documentsBase64 = await Promise.all(
                            document_details.map(async (doc) => {
                                const base64 = await fetchImageAsBase64(`${StorageUrl}${doc.document_path}`);
                                return {
                                    document_id: doc.document_id,
                                    document: base64.data.split(',')[1], // Base64 string
                                    mime: base64.mime.split("/")[1], // Extracted MIME type
                                };
                            })
                        );

                        // Update Documents State
                        const updatedDocuments = {
                            profile: [{ profile: profileBase64.data.split(',')[1], mime: profileBase64.mime.split("/")[1] }],
                            signature: [{ signature: signatureBase64.data.split(',')[1], mime: signatureBase64.mime.split("/")[1] }],
                            documents: documentsBase64,
                        };
                        setDocuments(updatedDocuments);

                        // Update Files State
                        setFiles((prevFiles) => {
                            const updatedFiles = {
                                ...prevFiles,
                                photo: `${StorageUrl}${personal_data.profile}`,
                                signature: `${StorageUrl}${personal_data.signature}`,
                            };

                            // Mapping for known document types
                            const documentMapping = {
                                "Aadhar Card": "aadharCard",
                                "Caste Certificate": "casteCertificate",
                                "HSC Marksheet": "hscMarksheet",
                                "SSC Marksheet": "sscMarksheet",
                                "HSC Leaving Certificate": "hscLeavingCertificate",
                                "University Pre Enrollment Form": "universityPreEnrollmentForm",
                            };

                            // Iterate through document details and assign the latest path for each type
                            document_details.forEach((doc) => {
                                const fileKey = documentMapping[doc.document_name];
                                if (fileKey) {
                                    updatedFiles[fileKey] = `${StorageUrl}${doc.document_path}`;
                                }
                            });

                            return updatedFiles;
                        });

                    }
                } else {
                    alert(`${response.data.message}. Please try again.`);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
                alert("Network error. Please try again later.");
            }
        };


        const fetchImageAsBase64 = async (url) => {
            try {
                const response = await fetch(url, { mode: "cors" });
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

                const blob = await response.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64String = reader.result;
                        const mimeType = base64String.match(/^data:(.*?);base64,/)[1] || "application/octet-stream";
                        resolve({ data: base64String, mime: mimeType });
                    };
                });
            } catch (error) {
                console.error("Error converting image to Base64:", error);
                return { data: null, mime: "application/octet-stream" };
            }
        };



        const authUser = JSON.parse(localStorage.getItem("authUser"));
        if (authUser?.form_details?.document_details === 1) {
            fetchUploadedDocuments();
        }
    }, []);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file); // Read file as an ArrayBuffer
            reader.onload = () => {
                const bytes = new Uint8Array(reader.result); // Convert buffer to byte array
                const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), ""); // Convert to binary string
                const base64String = btoa(binary); // Encode using btoa()

                const fileType = file.type.split("/")[1]; // Get file extension (e.g., "png", "pdf")

                resolve({
                    mimeType: fileType, // Returns "png", "pdf", etc.
                    base64: base64String, // Correct Base64 encoding like base64.guru
                });
            };
            reader.onerror = (error) => reject(error);
        });
    };




    // const getMimeTypeFromBase64 = (base64String) => {
    //     const match = base64String.match(/^data:(.*?);base64,/);
    //     if (match) {
    //         const mimeType = match[1]; // e.g., "image/jpeg"
    //         return mimeType.split("/")[1]; // Extracts "jpeg" from "image/jpeg"
    //     }
    //     return "unknown"; // Default fallback if no match found
    // };

    // const getBase64Value = (base64String) => {
    //     return base64String.split(";base64,")[1] || ""; // Extracts only the base64 content
    // };

    const handleFileChange = async (e) => {
        setLoading(true);
        const { name, files: selectedFiles, dataset } = e.target;
        const documentId = dataset.documentId || null;
        let error = "";

        if (selectedFiles && selectedFiles[0]) {
            const file = selectedFiles[0];
            const isImage = file.type.startsWith("image/");
            const isPDF = file.type === "application/pdf";

            if (name === "photo" || name === "signature") {
                if (!isImage) {
                    error = "Only image files (jpg, jpeg, png) are allowed.";
                } else if (file.size > MAX_FILE_SIZE) {
                    error = "File size should be less than 1MB.";
                }
            } else {
                if (!isPDF) {
                    error = "Only PDF files are allowed.";
                } else if (file.size > MAX_FILE_SIZE) {
                    error = "File size should be less than 1MB.";
                }
            }

            if (!error) {
                try {
                    const fileUrl = URL.createObjectURL(file);
                    const { mimeType, base64 } = await convertToBase64(file);

                    setFiles((prevFiles) => ({
                        ...prevFiles,
                        [name]: { file, url: fileUrl, name: file.name, base64 },
                    }));

                    setDocuments((prevDocs) => {
                        if (name === "photo") {
                            return {
                                ...prevDocs,
                                profile: [{ profile: base64, mime: mimeType }]
                            };
                        } else if (name === "signature") {
                            return {
                                ...prevDocs,
                                signature: [{ signature: base64, mime: mimeType }]
                            };
                        } else {
                            // Replace the document with the same document_id
                            const updatedDocuments = prevDocs.documents
                                ? prevDocs.documents.map((doc) =>
                                    doc.document_id === Number(documentId)
                                        ? { document_id: Number(documentId), document: base64, mime: mimeType }
                                        : doc
                                )
                                : [];

                            // If no matching document_id exists, add it as a new entry
                            if (!updatedDocuments.some(doc => doc.document_id === Number(documentId))) {
                                updatedDocuments.push({
                                    document_id: Number(documentId),
                                    document: base64,
                                    mime: mimeType,
                                });
                            }

                            return {
                                ...prevDocs,
                                documents: updatedDocuments
                            };
                        }
                    });

                } catch (err) {
                    console.error("Error processing file:", err);
                    error = "Error processing file. Please try again.";
                } finally {
                    setLoading(false); // Hide spinner once done
                }
            }
        } else {
            error = "This field is required.";
            setLoading(false);
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleDelete = (name) => {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [name]: null,
        }));

        setDocuments((prevDocs) => {
            if (name === "photo" || name === "signature") {
                return { ...prevDocs, [name]: null };
            } else {
                return {
                    ...prevDocs,
                    documents: prevDocs.documents?.filter((doc) => doc.document_id !== name),
                };
            }
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        let error = false;
        let errorMessages = {};

        const requiredFields = Object.keys(files);

        requiredFields.forEach((field) => {
            if (!files[field]) {
                error = true;
                errorMessages[field] = `${field} is required.`;
            }
        });

        if (!error) {
            console.log("Structured Form Data:", JSON.stringify(documents, null, 2));
            setUploadsFormData(documents);
            return documents;
        } else {
            console.log("Validation Errors:", errorMessages);
            setErrors(errorMessages);
        }
        setLoading(false);
    };

    const renderFileView = (file, name) => {

        if (file && (file || file.base64)) {

            return (
                <div className="d-flex align-items-center mt-2">
                    <a
                        href={file.base64 || file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-2"
                    >
                        View
                    </a>
                    <Button size="sm" color="danger" onClick={() => handleDelete(name)}>X</Button>
                </div>
            );
        }
        return null;
    };





    return (
        <Form>
            <h5 className="mb-3">Upload Documents</h5>

            <Row>
                {Object.keys(files).map((key, index) => {
                    const isDocument = key !== "photo" && key !== "signature"; // Exclude photo & signature
                    return (
                        <Col lg="6" key={index}>
                            <div className="mb-3">
                                <Label htmlFor={key}>
                                    {key.replace(/([A-Z])/g, " $1").trim()} <span className="requireField">*</span>
                                </Label>
                                <Input
                                    disabled={disabled}
                                    type="file"
                                    id={key}
                                    name={key}
                                    data-document-id={isDocument ? index - 1 : ""} // Start from 1 for documents
                                    onChange={handleFileChange}
                                    invalid={!!errors[key]}
                                />
                                {renderFileView(files[key], key)}
                                <FormFeedback>{errors[key]}</FormFeedback>
                            </div>
                        </Col>
                    );
                })}
            </Row>


            <div className="d-flex align-items-center">
                {loading && <Spinner className="me-2" color="primary" />}
                {/* <Button disabled={loading || disabled} type="button" color="primary" onClick={handleSubmit}>
                    {loading ? "Submitting..." : "Submit"}
                </Button> */}
            </div>
        </Form>
    );
});

export default Upload;
