import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token) {
      getIncomes();
      getExpenses();
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}Login`, {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshtoken);
      Navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        console.error("Error logging in:", error.response.data);
        setError(error.response.data.error || "Invalid email or password");
      } else {
        console.error("Error logging in:", error.message);
        setError("Network Error");
      }
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}addUser`, {
        name,
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      Navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Error signing up:", error.response.data);
        setError(error.response.data.error || "Error signing up");
      } else {
        console.error("Error signing up:", error.message);
        setError("Network Error");
      }
    }
  };

  const fetchWithToken = async (url, method = "GET", data = null) => {
    try {
      const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data,
      };
      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data.message : "Server Error");
      throw err;
    }
  };

  const addIncome = async (income) => {
    await fetchWithToken("addIncome", "POST", income);
    await getIncomes();
  };

  const getIncomes = async () => {
    const data = await fetchWithToken("getIncomes");
    setIncomes(data);
    console.log(data);
  };

  const deleteIncome = async (id) => {
    await fetchWithToken(`deleteIncome/${id}`, "DELETE");
    await getIncomes();
  };

  const totalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  const addExpense = async (expense) => {
    await fetchWithToken("addExpense", "POST", expense);
    await getExpenses();
  };

  const getExpenses = async () => {
    const data = await fetchWithToken("getExpenses");
    setExpenses(data);
    console.log(data);
  };

  const deleteExpense = async (id) => {
    await fetchWithToken(`deleteExpense/${id}`, "DELETE");
    await getExpenses();
  };

  const totalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
        handleLogin,
        handleSignup,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
