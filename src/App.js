import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([{ credit: "", grade: "" }]);
  const [darkMode, setDarkMode] = useState(false);
  const [cgpa, setCgpa] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const gradePoints = {
    "A+": 4.00,
    "A": 3.75,
    "A-": 3.50,
    "B+": 3.25,
    "B": 3.00,
    "B-": 2.75,
    "C+": 2.50,
    "C": 2.25,
    "D": 2.00,
    "F": 0.00,
  };

  const handleChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { credit: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const credit = parseFloat(course.credit);
      if (credit > 0 && course.grade) {
        totalCredits += credit;
        totalPoints += credit * gradePoints[course.grade];
      }
    });

    if (totalCredits === 0) return "0.00";
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleCalculateClick = () => {
    setCgpa(calculateCGPA());
  };

  return (
    <div className="App">
      <h1>CGPA Calculator BD</h1>

<p>CGPA Calculator for University Students in Bangladesh</p>


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
            step="0.1"
            min="0"
            placeholder="Credit"
            value={course.credit}
            onChange={(e) =>
              handleChange(index, "credit", e.target.value)
            }
          />

          <select
            value={course.grade}
            onChange={(e) =>
              handleChange(index, "grade", e.target.value)
            }
          >
            <option value="">Select Grade</option>
            {Object.entries(gradePoints).map(([grade, point]) => (
              <option key={grade} value={grade}>
                {grade} ({point.toFixed(2)})
              </option>
            ))}
          </select>

          <button className="remove-btn" onClick={() => removeCourse(index)}>
            Remove
          </button>
        </div>
      ))}

      <div className="buttons-row">
        <button className="add-btn" onClick={addCourse}>
          Add Course
        </button>

        <button className="calculate-btn" onClick={handleCalculateClick}>
          Calculate CGPA
        </button>
      </div>

      {cgpa !== null && <h2 className="cgpa-display">CGPA: {cgpa}</h2>}

      <footer className="footer">
        © {new Date().getFullYear()} Md Nadim Mahmud. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
