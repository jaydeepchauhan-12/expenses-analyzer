import React, {useState,useEffect} from "react";
import API from "./api/api";
import AddTransaction from "./pages/addtransaction";
import TransactionList from "./pages/transactionlist";
import Dashboard from "./pages/dashboard";
import BillScanner from "./pages/billscanner";



const App = () => {
  const [transactions,settransactions] = useState([]);

  const fetchtransactions = async () => {
    try {
      const res = await API.get("/transactions/");
      settransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchtransactions();
  }, []);

  return(
    <div className="container">
      <h1>Expense Analyzer</h1>
      <AddTransaction
        refreshData={fetchtransactions}
      />

      <BillScanner 
        refreshData={fetchtransactions}
      />  

      <TransactionList
        transactions={transactions}
        refreshData={fetchtransactions}
      />

      <Dashboard
        transactions={transactions}
      />
    </div>
  );
};

export default App;