import React from "react";

import { Bar } from "react-chartjs-2";

import "chart.js/auto";

const Dashboard = ({ transactions }) => {

    // ALL AVAILABLE CATEGORIES
    const allCategories = [

        "Food",
        "Travel",
        "Shopping",
        "Entertainment",
        "Bills",
        "Healthcare",
        "Education",
        "Salary",
        "Investment",
        "Rent",
        "EMI",
        "Insurance",
        "Fitness",
        "Pets",
        "Donations"
    ];

    // INITIALIZE CATEGORY TOTALS
    const categoryMap = {};

    allCategories.forEach((category) => {

        categoryMap[category] = 0;

    });

    // ADD TRANSACTION AMOUNTS
    transactions.forEach((t) => {

        if (t.category) {

            categoryMap[t.category] +=
                Number(t.amount);

        }
    });

    // COLORS
    const colors = [

        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#E74C3C",
        "#2ECC71",
        "#27AE60",
        "#8E44AD",
        "#D35400",
        "#C0392B",
        "#2980B9",
        "#16A085",
        "#F39C12",
        "#7F8C8D"
    ];

    // CHART DATA
    const chartData = {

        labels: allCategories,

        datasets: [
            {
                label: "Expenses by Category",

                data: allCategories.map(
                    (category) =>
                        categoryMap[category]
                ),

                backgroundColor: colors,

                borderRadius: 8,

                borderWidth: 1
            }
        ]
    };

    // CHART OPTIONS
    const options = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            }
        },

        scales: {

            // X AXIS
            x: {

                ticks: {

                    color: "#333",

                    font: {
                        size: 12,
                        weight: "bold"
                    },

                    maxRotation: 45,

                    minRotation: 45
                },

                grid: {
                    display: false
                }
            },

            // Y AXIS
            y: {

                beginAtZero: true,

                ticks: {

                    color: "#333",

                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (

        <div className="card">

            <h2>Expense Analytics</h2>

            <div className="chart-container">

                <Bar
                    data={chartData}
                    options={options}
                />

            </div>

        </div>
    );
};

export default Dashboard;