import React,{ useState} from "react";
import API from "../api/api";

const AddTransaction = ({ refreshData }) => {
    const [form,setform] = useState({
        amount : "",
        description : ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/transactions/", {
                amount:parseFloat(form.amount),
                description: form.description
            });
            alert("Transaction Added");
            setform({
                amount : "",
                description : ""
            });
            refreshData();
        } catch (error) {
            console.log(error);
        }
    };

    return(
        <div className="card">
            <h2>Add Transactions</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Enter Amount"
                value={form.amount}
                onChange={(e) =>
                    setform({
                        ...form,
                        amount : e.target.value
                    })
                }/>

                <input type="text"
                placeholder="Enter Description"
                value={form.description}
                onChange={(e) => 
                    setform({
                        ...form,
                        description: e.target.value
                    })
                } />

                <button type="submit">Add</button>
            </form>

        </div>
    );
};

export default AddTransaction;