import React, { useState } from "react";

import API from "../api/api";

const TransactionList = ({
    transactions,
    refreshData
}) => {

    // EDIT STATE
    const [editId, setEditId] = useState(null);

    const [editForm, setEditForm] = useState({
        amount: "",
        description: ""
    });

    // DELETE TRANSACTION
    const handleDelete = async (id) => {

        try {

            await API.delete(
                `/transactions/${id}`
            );

            refreshData();

        } catch (error) {

            console.log(error);

        }
    };

    // START EDIT
    const startEdit = (t) => {

        setEditId(t.id);

        setEditForm({
            amount: t.amount,
            description: t.description
        });
    };

    // UPDATE TRANSACTION
    const handleUpdate = async (id) => {

        try {

            await API.put(
                `/transactions/${id}`,
                {
                    amount: parseFloat(
                        editForm.amount
                    ),

                    description:
                        editForm.description
                }
            );

            // CLOSE EDIT MODE
            setEditId(null);

            refreshData();

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="card">

            <h2>Transactions</h2>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {transactions.map((t) => (

                            <tr key={t.id}>

                                {/* ID */}
                                <td>{t.id}</td>

                                {/* AMOUNT */}
                                <td>

                                    {editId === t.id ? (

                                        <input
                                            type="number"

                                            value={editForm.amount}

                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    amount:
                                                        e.target.value
                                                })
                                            }
                                        />

                                    ) : (

                                        `₹ ${t.amount}`

                                    )}

                                </td>

                                {/* CATEGORY */}
                                <td>{t.category}</td>

                                {/* DESCRIPTION */}
                                <td>

                                    {editId === t.id ? (

                                        <input
                                            type="text"

                                            value={
                                                editForm.description
                                            }

                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    description:
                                                        e.target.value
                                                })
                                            }
                                        />

                                    ) : (

                                        t.description

                                    )}

                                </td>

                                {/* STATUS */}
                                <td>{t.status}</td>

                                {/* ACTION BUTTONS */}
                                <td className="action-buttons">

                                    {editId === t.id ? (

                                        <button 
                                            onClick={() =>
                                                handleUpdate(t.id)
                                            }
                                        >
                                            Save
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                startEdit(t)
                                            }
                                        >
                                            Edit
                                        </button>

                                    )}

                                    <button
                                        onClick={() =>
                                            handleDelete(t.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
};

export default TransactionList;