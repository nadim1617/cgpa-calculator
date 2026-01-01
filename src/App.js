import { useState, useEffect } from "react";
import React, { useState } from "react";
import "./App.css";

const gradeOptions = [
  { label: "A+ (80-100) - 4.00", value: 4.00 },
  { label: "A (75-79) - 3.75", value: 3.75 },
  { label: "A- (70-74) - 3.50", value: 3.50 },
  { label: "B+ (65-69) - 3.25", value: 3.25 },
  { label: "B (60-64) - 3.00", value: 3.00 },
  { label: "B- (55-59) - 2.75", value: 2.75 },
  { label: "C+ (50-54) - 2.50", value: 2.50 },
  { label: "C (45-49) - 2.25", value: 2.25 },
  { label: "D (40-44) - 2.00", value: 2.00 },
  { label: "F (0-39) - 0.00", value: 0.00 },
];


function App() {

const [darkMode, setDarkMode] = useState(false);
useEffect(() => {
  document.body.className = darkMode ? "dark" : "";
}, [darkMode]);

  const [courses, setCourses] = useState([{ credit: "", grade: "" }]);
  const [cgpa, setCgpa] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { credit: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    courses.forEach((c) => {
      const credit = parseFloat(c.credit);
      const grade = parseFloat(c.grade);
      if (!isNaN(credit) && !isNaN(grade)) {
        totalCredits += credit;
        weightedSum += credit * grade;
      }
    });

    const result = totalCredits ? (weightedSum / totalCredits).toFixed(2) : 0;
    setCgpa(result);
  };

  return (
    <div className="App">
      <h1>CGPA Calculator</h1>

<button
  className="dark-toggle"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>


      {courses.map((course, index) => (
        <div key={index} className="course-row">
          <input
            type="number"
            placeholder="Credit"
            name="credit"
            value={course.credit}
            onChange={(e) => handleChange(e, index)}
          />
          <select
  name="grade"
  value={course.grade}
  onChange={(e) => handleChange(e, index)}
>
  <option value="">Select Grade</option>
  {gradeOptions.map((g, i) => (
    <option key={i} value={g.value}>
      {g.label}
    </option>
  ))}
</select>

          <button className="remove-btn" onClick={() => removeCourse(index)}>
            ❌
          </button>
        </div>
      ))}
      <div className="buttons">
        <button onClick={addCourse}>➕ Add Course</button>
        <button onClick={calculateCGPA}>📊 Calculate CGPA</button>
      </div>
      {cgpa !== null && <h2>Your CGPA is: {cgpa}</h2>}

<footer className="footer">
  © {new Date().getFullYear()} Nadim Mahmud. All rights reserved.
</footer>


    </div>
  );
}

export default App;
