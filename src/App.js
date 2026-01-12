import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  /* ---------------- STATE & PERSISTENCE ---------------- */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("user-dark-mode") === "true";
  });
  
  const [selectedUniversity, setSelectedUniversity] = useState(() => {
    return localStorage.getItem("user-university") || null;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("user-courses");
    return saved ? JSON.parse(saved) : [{ credit: "", grade: "" }];
  });

  const [cgpa, setCgpa] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);

  /* ---------------- SIDE EFFECTS ---------------- */
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("user-dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (selectedUniversity) {
      localStorage.setItem("user-university", selectedUniversity);
    } else {
      localStorage.removeItem("user-university");
    }
    localStorage.setItem("user-courses", JSON.stringify(courses));
  }, [selectedUniversity, courses]);

  /* ---------------- UNIVERSITY DATA ---------------- */
  const universities = [
    { id: "diu", name: "Daffodil International University", logo: "/logos/diu.png" },
    { id: "aiub", name: "American International University-Bangladesh", logo: "/logos/aiub.png" },
    { id: "brac", name: "BRAC University", logo: "/logos/brac.png" },
    { id: "nsu", name: "North South University", logo: "/logos/nsu.png" },
    { id: "ewu", name: "East West University", logo: "/logos/ewu.png" },
    { id: "uiu", name: "United International University", logo: "/logos/uiu.png" },
  ];

  const gradeTables = {
    diu: { "A+": 4.0, "A": 3.75, "A-": 3.5, "B+": 3.25, "B": 3.0, "B-": 2.75, "C+": 2.5, "C": 2.25, "D": 2.0, "F": 0.0 },
    aiub: { "A+": 4.0, "A": 3.75, "B+": 3.5, "B": 3.25, "C+": 3.0, "C": 2.75, "D+": 2.5, "D": 2.25, "F": 0.0 },
    brac: { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0 },
    nsu: { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 },
    ewu: { "A+": 4.0, "A": 3.75, "A-": 3.5, "B+": 3.25, "B": 3.0, "B-": 2.75, "C+": 2.5, "C": 2.25, "D": 2.0, "F": 0.0 },
    uiu: { "A": 4.0, "A-": 3.67, "B+": 3.33, "B": 3.0, "B-": 2.67, "C+": 2.33, "C": 2.0, "C-": 1.67, "D+": 1.33, "D": 1.0, "F": 0.0 },
  };

  /* ---------------- FUNCTIONS ---------------- */
  const handleChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { credit: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated.length ? updated : [{ credit: "", grade: "" }]);
  };

  const calculateCGPA = () => {
    let credits = 0;
    let points = 0;
    const gradePoints = gradeTables[selectedUniversity];

    courses.forEach((course) => {
      const credit = parseFloat(course.credit);
      if (credit > 0 && course.grade) {
        credits += credit;
        points += credit * gradePoints[course.grade];
      }
    });

    setTotalCredits(credits);
    if (credits === 0) return "0.00";
    return (points / credits).toFixed(2);
  };

  const resetAll = () => {
    if (window.confirm("Reset all entries?")) {
      setCourses([{ credit: "", grade: "" }]);
      setCgpa(null);
      setTotalCredits(0);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="app-root">
      {!selectedUniversity && (
        <div className="university-page">
          <h1 className="university-title">BD CGPA Calculator</h1>
          <p className="university-subtitle">Select Your University</p>
          <button className="dark-toggle-btn inline-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
          <div className="university-grid">
            {universities.map((uni, index) => (
              <div key={uni.id} className="university-card" onClick={() => setSelectedUniversity(uni.id)}>
                <span className="uni-card-serial">{index + 1}.</span>
                <div className="university-logo-wrapper">
                  <img src={uni.logo} alt={uni.name} className="university-logo" />
                </div>
                <div className="university-name">{uni.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedUniversity && (
        <div className="App">
          <h1>CGPA Calculator BD</h1>
          <p className="subheading">CGPA Calculator for University Students in Bangladesh</p>
          <p className="uni-display-name">Selected: {universities.find(u => u.id === selectedUniversity)?.name}</p>
          
          <div className="top-action-row">
            <button className="change-uni-btn" onClick={() => setSelectedUniversity(null)}>Change University</button>
            <button className="dark-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          
          {courses.map((course, index) => (
            <div key={index} className="course-row">
              <span className="serial">{index + 1}.</span>
              <input type="number" placeholder="Credit" value={course.credit} onChange={(e) => handleChange(index, "credit", e.target.value)} />
              <select value={course.grade} onChange={(e) => handleChange(index, "grade", e.target.value)}>
                <option value="">Select Grade</option>
                {Object.entries(gradeTables[selectedUniversity]).map(([grade, point]) => (
                  <option key={grade} value={grade}>{grade} ({point.toFixed(2)})</option>
                ))}
              </select>
              <button className="remove-btn" onClick={() => removeCourse(index)}>Remove</button>
            </div>
          ))}
          
          <div className="buttons-row">
            <button className="add-btn" onClick={addCourse}>Add Course</button>
            <button className="calculate-btn" onClick={() => setCgpa(calculateCGPA())}>Calculate CGPA</button>
            <button className="reset-btn" onClick={resetAll}>Reset</button>
          </div>
          
          {cgpa && (
            <div className="result-box">
              <h2 className="cgpa-display">CGPA: {cgpa}</h2>
              <p className="total-credit">Total Credits: {totalCredits}</p>
            </div>
          )}
          <footer className="footer">© 2026 Md Nadim Mahmud. All rights reserved.</footer>
        </div>
      )}
    </div>
  );
}

export default App;