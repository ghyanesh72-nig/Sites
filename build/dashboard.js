
let students = [];
let currentPage = 1;  // Track the current page
const rowsPerPage = 8;  // Number of rows per page

// Function to get and display the total number of students
function displayTotalStudents() {
  const totalStudents = students.length;
  const totalStudentsDisplay = document.querySelector(".totalStudents");

  if (totalStudentsDisplay) {
    totalStudentsDisplay.textContent = `Total Students: ${totalStudents}`;
  }
}

// Function to calculate the total percentage of students who filled the form
function calculateTotalPercentage() {
  const totalStudents = students.length;

  // Define the number of students who filled the form (e.g., 200 students filled the form)
  const studentsFilledForm = 200;

  // Calculate the percentage
  const percentage = totalStudents === 0 ? 0 : (totalStudents / studentsFilledForm) * 100;

  // Update the HTML element to display the percentage
  const totalPercentageDisplay = document.querySelector(".totalperc");

  if (totalPercentageDisplay) {
    totalPercentageDisplay.textContent = `Students yet to fill: ${percentage.toFixed(2)}%`;
  }
}

// Function to display the count of students in each batch
function displayBatchCounts() {
  const batch2025_2027Count = students.filter(student => student["admission-batch"] === "2025-2027").length;
  const batch2023_2025Count = students.filter(student => student["admission-batch"] === "2023-2025").length;

  // Get the <h5> elements for each batch
  const batch2025_2027Element = document.getElementById("batch2025-2027");
  const batch2023_2025Element = document.getElementById("batch2023-2025");

  // Update the text content with the count of students in each batch
  if (batch2025_2027Element) {
    batch2025_2027Element.textContent = `Total Students in 2025-2027: ${batch2025_2027Count}`;
  }

  if (batch2023_2025Element) {
    batch2023_2025Element.textContent = `Total Students in 2023-2025: ${batch2023_2025Count}`;
  }
}

// Fetch student details from the API
function fetchStudentDetails() {
  console.log("Fetching data from API...");
  fetch('https://deep72.onrender.com/students')  // Ensure this endpoint works in the backend
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      return response.json();
    })
    .then(data => {
      students = data;  // Store fetched students data
      displayStudents();  // Display the students for the first page
      displayTotalStudents();  // Display the total number of students
      displayBatchCounts();  // Display the batch-specific counts
      calculateTotalPercentage(); // Calculate the percentage
    })
    .catch(error => {
      console.error("Error fetching student details:", error);
      alert("Failed to load student details. Please try again.");
    });
}

// Display students for the current page
function displayStudents() {
  const studentBody = document.getElementById("student-body");
  const totalStudents = students.length;
  
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;

  studentBody.innerHTML = "";  // Clear the existing rows

  if (totalStudents === 0) {
    const noDataRow = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 4;
    noDataCell.textContent = "No students found";
    noDataRow.appendChild(noDataCell);
    studentBody.appendChild(noDataRow);
    return;
  }

  // Slice the students array to get the students for the current page
  const studentsToDisplay = students.slice(startIdx, endIdx);

  studentsToDisplay.forEach(student => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = `${student.firstname} ${student.lastname}`;
    row.appendChild(nameCell);

    const usnCell = document.createElement("td");
    usnCell.textContent = student.usn;
    row.appendChild(usnCell);

    const techSkillCell = document.createElement("td");
    techSkillCell.textContent = student["interest-technical"];
    row.appendChild(techSkillCell);

    const actionsCell = document.createElement("td");
    actionsCell.classList.add("text-center");

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("text-blue-500", "hover:underline");
    viewButton.onclick = () => viewStudentDetails(student.usn);
    actionsCell.appendChild(viewButton);
    row.appendChild(actionsCell);

    studentBody.appendChild(row);
  });

  updatePaginationControls(totalStudents);
}

// Update the pagination controls based on the current page
function updatePaginationControls(totalStudents) {
  const totalPages = Math.ceil(totalStudents / rowsPerPage);
  const pageInfo = document.getElementById("pageInfo");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// Handle "Prev" button click
document.getElementById("prevPage")?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayStudents();
  }
});

// Handle "Next" button click
document.getElementById("nextPage")?.addEventListener("click", () => {
  const totalPages = Math.ceil(students.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayStudents();
  }
});

// Initialize the page by fetching student details
document.addEventListener("DOMContentLoaded", function() {
  fetchStudentDetails();
});

// View student details in the studentdetails page
function viewStudentDetails(usn) {
  fetch(`https://deep72.onrender.com/students/${usn}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem("selectedStudent", JSON.stringify(data));  // Save selected student details
      window.location.href = "./pages/profile.html";  // Redirect to profile page
    })
    .catch(error => {
      console.error("Error fetching student details:", error);
      alert("Failed to load student details. Please try again.");
    });
}

// Search bar functionality
document.getElementById('usnSearch').addEventListener('input', function(event) {
  const query = event.target.value.trim().toLowerCase();
  const suggestionsContainer = document.getElementById('suggestions');

  if (query.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  // Filter students by name or USN, with checks for undefined or null values
  const filteredStudents = students.filter(student => 
    (student.firstname && student.firstname.toLowerCase().includes(query)) || 
    (student.lastname && student.lastname.toLowerCase().includes(query)) ||
    (student.usn && student.usn.toLowerCase().includes(query))
  );

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  // Show the matching students
  filteredStudents.forEach(student => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = `${student.firstname} ${student.lastname} (${student.usn})`;
    suggestionItem.onclick = function() {
      selectStudent(student);
    };
    suggestionsContainer.appendChild(suggestionItem);
  });

  // Display the dropdown
  suggestionsContainer.style.display = filteredStudents.length > 0 ? 'block' : 'none';
});

function selectStudent(student) {
  // Store selected student in localStorage and redirect to profile
  localStorage.setItem("selectedStudent", JSON.stringify(student));
  window.location.href = "./pages/profile.html";
}

// Handle USN search on Enter key press
document.getElementById('usnSearch').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const usn = event.target.value.trim();
    if (usn) {
      searchStudentByUSN(usn);
    }
  }
});

function searchStudentByUSN(usn) {
  const student = students.find(student => student.usn === usn);
  if (student) {
    localStorage.setItem("selectedStudent", JSON.stringify(student));  // Store the student in localStorage
    window.location.href = "./pages/profile.html";  // Redirect to profile page
  } else {
    alert("Student not found!");
  }
}

// Add event listener for the logout button
document.getElementById('logOutBtn').addEventListener('click', function() {
  // Clear any user-related data from localStorage or sessionStorage
  localStorage.removeItem('selectedStudent');
  localStorage.removeItem('userToken');  // if you're storing a token for authentication, clear it

  // Optionally, you could also clear sessionStorage if you're using it
  // sessionStorage.removeItem('userSessionData');

  // Redirect to the sign-in page
  window.location.href = './pages/sign-in.html';  // Replace 'login.html' with the actual path to your sign-in page
});
