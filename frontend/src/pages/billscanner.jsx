import { useState } from "react";
import axios from "axios";

const BillScanner = ({ refreshData }) => {

    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState([]);


    const handleImage = (e) => {

        const file = e.target.files[0];

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };


   const uploadBill = async () => {

    if (!image) {

        alert("Select image first");

        return;
    }

    const formData = new FormData();

    formData.append(
        "file",
        image
    );

    try {

        setLoading(true);

        const res = await axios.post(

            "http://127.0.0.1:8000/transactions/scan-bill",

            formData,

            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        // DEBUG RESPONSE
        console.log(res.data);

        // CHECK SUCCESS
        if (
        res.data.transactions &&
        res.data.transactions.length > 0
    ) {

        setResult(
            res.data.transactions
        );

        alert(
            "Bill scanned successfully"
        );

        refreshData();

    } else {

        console.log(
            "FULL RESPONSE:",
            res.data
        );

        alert(
            "No transactions detected"
        );
    }

    } catch (err) {

        console.log(err);

        alert("Upload failed");

    } finally {

        setLoading(false);
    }
};


    return (

        <div className="bill-scanner">

            <h2>
                AI Bill Scanner
            </h2>

            <p>
                Upload your receipt and extract expense details automatically
            </p>


            <div className="upload-section">

                {/* GALLERY */}
                <label className="upload-box">

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    <div>

                        <h3>
                            📁 Upload From Gallery
                        </h3>

                        <span>
                            Choose receipt image
                        </span>

                    </div>

                </label>


                {/* CAMERA */}
                <label className="upload-box">

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImage}
                    />

                    <div>

                        <h3>
                            📷 Capture From Camera
                        </h3>

                        <span>
                            Scan live bill image
                        </span>

                    </div>

                </label>

            </div>


            {/* IMAGE PREVIEW */}
            {
                preview && (

                    <img
                        src={preview}
                        alt="Preview"
                        className="preview-image"
                    />
                )
            }


            {/* SCAN BUTTON */}
            <button
                className="scan-btn"
                onClick={uploadBill}
            >

                {
                    loading
                    ? "Scanning..."
                    : "Scan Bill"
                }

            </button>


            {/* OCR RESULT */}
            {
                result.length > 0 && (

                    <div className="result-box">

                        <h3>
                            Scanned Transactions
                        </h3>

                        {
                            result.map((item, index) => (

                                <div
                                    key={index}
                                    className="result-item"
                                >

                                    <div>

                                        <strong>
                                            Description:
                                        </strong>

                                        {" "}

                                        {item.description}

                                    </div>


                                    <div>

                                        <strong>
                                            Amount:
                                        </strong>

                                        {" "}

                                        ₹{item.amount}

                                    </div>


                                    <div>

                                        <strong>
                                            Category:
                                        </strong>

                                        {" "}

                                        {item.category}

                                    </div>

                                </div>
                            ))
                        }

                    </div>
                )
            }

        </div>
    );
};

export default BillScanner;