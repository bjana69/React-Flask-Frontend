import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // ✅ Required for styling
import './App.css';

// MongoDB cluster Collection page address = https://cloud.mongodb.com/v2/67f7af789876603085f7016a#/metrics/replicaSet/67f7afd748d1e75c7a539b23/explorer/myDatabase/myCollection/find

const BASE_URL = "https://flask-backend-pcfm.onrender.com";

// 🏠 Home Page
const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post(`${BASE_URL}/register`, { name });
      toast.success("✅ Name Registered Successfully!");
      setName("");
    } catch (error) {
      console.error("Error adding name:", error);
      toast.error("❌ Failed to register name.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ToastContainer />
      <div style={{ backgroundColor: "gray", padding: "15px", width: "350px", borderRadius: "15px" }}>
        <h1 style={{ color: "cyan" }}>Flask + React App</h1>
        <h2 style={{ color: "goldenrod" }}>Register here:</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{ height: "30px", borderRadius: "5px", margin: "2px" }}
          />
          <button type="submit" style={{ height: "35px", borderRadius: "5px", backgroundColor: "goldenrod", color: "white" }}>
            Register
          </button>
        </form>
        <button
          onClick={() => navigate("/registered-names")}
          style={{ marginTop: "10px", height: "35px", borderRadius: "5px", width: "235px", color: "white", backgroundColor: "red" }}
        >
          Check The Registered Names
        </button>
      </div>
    </div>
  );
};

// 📜 Registered Names Page
const RegisteredNames = () => {
  const [namesList, setNamesList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${BASE_URL}/userdata`)
      .then(response => {
        setNamesList(response.data || []);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        toast.error("❌ Failed to fetch data.");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}/delete/${id}`)
      .then(() => {
        setNamesList(prev => prev.filter(item => item._id !== id));
        toast.success("🗑️ Name deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting name:", error);
        toast.error("❌ Failed to delete.");
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <ToastContainer />
      <h1 style={{ color: "orange" }}>Registered Names</h1>
      <table border="1" style={{ margin: "auto", width: "60%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "gray", color: "white" }}>
            <th>ID</th>
            <th>Name</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {namesList.length > 0 ? (
            namesList.map((item, index) => (
              <tr key={item._id || `row-${index}`}>
                <td>{item.custom_id}</td>
                <td>{item.name}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                No names registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      <Link to="/">
        <button className="home-btn">
          🏠 Back to Home
        </button>
      </Link>
    </div>
  );
};

// 🚀 App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registered-names" element={<RegisteredNames />} />
      </Routes>
    </Router>
  );
};

export default App;
