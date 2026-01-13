import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("user-dark-mode") === "true");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universityData, setUniversityData] = useState(() => {
    const saved = localStorage.getItem("all-university-courses");
    return saved ? JSON.parse(saved) : {};
  });

  const [cgpa, setCgpa] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentCourses = selectedUniversity && universityData[selectedUniversity] 
    ? universityData[selectedUniversity] : [{ credit: "", grade: "" }];

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("user-dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("all-university-courses", JSON.stringify(universityData));
  }, [universityData]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const updateCourses = (newCourses) => setUniversityData({ ...universityData, [selectedUniversity]: newCourses });

  const calculateCGPA = () => {
    let credits = 0, points = 0;
    const gradePoints = gradeTables[selectedUniversity];
    currentCourses.forEach((c) => {
      const cr = parseFloat(c.credit);
      if (cr > 0 && c.grade) { credits += cr; points += cr * gradePoints[c.grade]; }
    });
    setTotalCredits(credits);
    return credits === 0 ? "0.00" : (points / credits).toFixed(2);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="app-root">
      {!selectedUniversity ? (
        <div className="university-page">
          <h1 className="university-title">BD CGPA Calculator</h1>
          <p className="university-subtitle">Select Your University</p>
          <button className="dark-toggle-btn inline-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
          <div className="university-grid">
            {universities.map((uni, index) => (
              <div key={uni.id} className="university-card" onClick={() => { setSelectedUniversity(uni.id); setCgpa(null); }}>
                <span className="uni-card-serial">{index + 1}.</span>
                <div className="university-logo-wrapper"><img src={uni.logo} alt={uni.name} className="university-logo" /></div>
                <div className="university-name">{uni.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="App">
          <h1>CGPA Calculator BD</h1>
          <p className="subheading">CGPA Calculator for University Students in Bangladesh</p>
          <p className="uni-display-name">Selected: {universities.find(u => u.id === selectedUniversity)?.name}</p>
          
          <div className="top-action-row">
            <button className="change-uni-btn" onClick={() => setSelectedUniversity(null)}>Change University</button>
            <button className="dark-toggle-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}</button>
          </div>

          <div className="course-container">
            {currentCourses.map((course, index) => (
              <div key={index} className="course-row">
                <span className="serial">{index + 1}.</span>
                <input type="number" placeholder="Credit" value={course.credit} onChange={(e) => {
                    const updated = [...currentCourses];
                    updated[index].credit = e.target.value;
                    updateCourses(updated);
                }} />
                <select value={course.grade} onChange={(e) => {
                    const updated = [...currentCourses];
                    updated[index].grade = e.target.value;
                    updateCourses(updated);
                }}>
                  <option value="">Select Grade</option>
                  {Object.entries(gradeTables[selectedUniversity]).map(([g, p]) => <option key={g} value={g}>{g} ({p.toFixed(2)})</option>)}
                </select>
                <button className="remove-btn" onClick={() => {
                  const updated = currentCourses.filter((_, i) => i !== index);
                  updateCourses(updated.length ? updated : [{ credit: "", grade: "" }]);
                }}>Remove</button>
              </div>
            ))}
          </div>

          {/* Result box with fade-in animation */}
          {cgpa && (
            <div className="result-box">
              <h2 className="cgpa-display">CGPA: {cgpa}</h2>
              <p className="total-credit">Total Credits: {totalCredits}</p>
            </div>
          )}

          <div className="sticky-bar">
            <button className="add-btn" onClick={() => updateCourses([...currentCourses, { credit: "", grade: "" }])}>Add Course</button>
            <button className="calculate-btn" onClick={() => setCgpa(calculateCGPA())}>Calculate CGPA</button>
            <button className="reset-btn" onClick={() => { if(window.confirm("Reset?")) { updateCourses([{ credit: "", grade: "" }]); setCgpa(null); } }}>Reset</button>
          </div>

          {showScrollTop && (
            <button className="scroll-top-btn" onClick={scrollToTop}>↑</button>
          )}

          <footer className="footer">© 2026 Md Nadim Mahmud. All rights reserved.</footer>
        </div>
      )}
    </div>
  );
}

export default App;