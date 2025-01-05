// Function to display student details
function displayStudentDetails() {
    // Get the student data from localStorage
    const data = JSON.parse(localStorage.getItem("selectedStudent"));

    if (!data) {
        alert("No student data found. Please select a student from the dashboard.");
        return;
    }

    // Populate student fields using value (for <input> elements)
    const studentName = document.querySelector("#student-name");
    const studentUSN = document.querySelector("#student-usn");
    const studentName2 = document.querySelector("#student-name2");
    const studentUSN2 = document.querySelector("#student-usn2");
    const studentNumber = document.querySelector("#student-number");
    const studentAddress = document.querySelector("#student-address");
    const studentBatch = document.querySelector("#student-batch");
    const studentEmail = document.querySelector("#student-email");
    const certifications = document.querySelector("#certifications");
    const studentMini = document.querySelector("#project-mini");
    const studentMajor = document.querySelector("#project-major");
    const special = document.querySelector("#special");
    const degreeStream = document.querySelector("#degree-stream");

    // Check if these elements exist, and if they do, populate them with the data
    if (studentName) {
        studentName.textContent = `${data.firstname} ${data.lastname || "N/A"}`;
    } else {
        console.error("Student Name element not found!");
    }

    if (studentUSN) {
        studentUSN.textContent = data.usn || "N/A";
    } else {
        console.error("Student USN element not found!");
    }

    if (studentName2) {
        studentName2.value = `${data.firstname} ${data.lastname || "N/A"}`;
    } else {
        console.error("Student Name element not found!");
    }

    if (studentUSN2) {
        studentUSN2.value = data.usn || "N/A";
    } else {
        console.error("Student USN element not found!");
    }

    if (studentMini) {
        studentMini.value = data["project-mini"] || "N/A";
    } else {
        console.error("Student Mini Project element not found!");
    }

    if (studentMajor) {
        studentMajor.value = data["project-major"] || "N/A";
    } else {
        console.error("Student Major Project element not found!");
    }

    if (certifications) {
        certifications.value = data.certifications || "N/A";
    } else {
        console.error("Certifications element not found!");
    }

    // Similarly, for other fields
    if (studentNumber) {
        studentNumber.value = data.mobile || "N/A";
    }

    if (studentAddress) {
        studentAddress.value = data.address || "N/A";
    }

    if (studentBatch) {
        studentBatch.value = data["admission-batch"] || "N/A";
    }

    if (studentEmail) {
        studentEmail.value = data.email || "N/A";
    }

    if (special) {
        special.value = data.special || "N/A";
    }

    if (degreeStream) {
        degreeStream.value = data["degree-stream"] || "N/A";
    }

    // Populate academic details (use .value for input elements)
    const sslc = document.querySelector("#sslc");
    const puc = document.querySelector("#puc");
    const degree = document.querySelector("#degree");
    const pgcet = document.querySelector("#pgcet");

    if (sslc) sslc.value = data.sslc || "N/A";
    else console.error("SSLC input element not found");

    if (puc) puc.value = data.puc || "N/A";
    else console.error("PUC input element not found");

    if (degree) degree.value = data.degree || "N/A";
    else console.error("Degree input element not found");

    if (pgcet) pgcet.value = data.pgcet || "N/A";
    else console.error("PGCET input element not found");

    // Populate areas of interest (use .value for input elements)
    const technicalInterest = document.querySelector("#interest-technical");
    const extracurricularInterest = document.querySelector("#interest-extracurricular");
    const sportsInterest = document.querySelector("#interest-sports");
    const hobbies = document.querySelector("#hobbies");

    if (technicalInterest) technicalInterest.value = data["interest-technical"] || "N/A";
    else console.error("Technical interest input element not found");

    if (extracurricularInterest) extracurricularInterest.value = data["interest-extracurricular"] || "N/A";
    else console.error("Extracurricular interest input element not found");

    if (sportsInterest) sportsInterest.value = data["interest-sports"] || "N/A";
    else console.error("Sports interest input element not found");

    if (hobbies) hobbies.value = data.hobbies || "N/A";
    else console.error("Hobbies input element not found");
}

// Function to save student data
function saveStudentData(usn) {
    // Gather all the updated data from the form fields
    const updatedData = {
        firstname: document.querySelector("#student-name2").value.split(' ')[0],
        lastname: document.querySelector("#student-name2").value.split(' ')[1] || null,
        usn: document.querySelector("#student-usn2").value,
        mobile: document.querySelector("#student-number").value,
        address: document.querySelector("#student-address").value,
        email: document.querySelector("#student-email").value,
        certifications: document.querySelector("#certifications").value,
        "project-mini": document.querySelector("#project-mini").value,
        "project-major": document.querySelector("#project-major").value,
        special: document.querySelector("#special").value,
        "degree-stream": document.querySelector("#degree-stream").value,
        sslc: document.querySelector("#sslc").value,
        puc: document.querySelector("#puc").value,
        degree: document.querySelector("#degree").value,
        pgcet: document.querySelector("#pgcet").value,
        "interest-technical": document.querySelector("#interest-technical").value,
        "interest-extracurricular": document.querySelector("#interest-extracurricular").value,
        "interest-sports": document.querySelector("#interest-sports").value,
        hobbies: document.querySelector("#hobbies").value
    };

    // Send the updated data to the server
    fetch(`https://deep72.onrender.com/update-student/${usn}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Student data updated successfully!");
        } else {
            alert("Error updating student data.");
        }
    })
    .catch(error => {
        console.error("Error updating student data:", error);
        alert("Error updating student data.");
    });
}

// Link the "Save" button to the saveStudentData function
document.getElementById("save-button").addEventListener("click", function() {
    const usn = document.querySelector("#student-usn2").value; // Get USN from the form (or use any other source)
    saveStudentData(usn);  // Call the function to save student data
});

// Call the function to display student details when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    displayStudentDetails();
});
