document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const totalPages = 4;
  
    // Show the first page initially
    showPage(currentPage);
  
    // Function to show a page
    function showPage(page) {
      const pages = document.querySelectorAll('.form-page');
      pages.forEach((pageElement, index) => {
        pageElement.style.display = (index + 1 === page) ? 'block' : 'none';
      });
  
      // Handle button visibility
      document.getElementById('prevButton').style.display = (page === 1) ? 'none' : 'inline-block';
      document.getElementById('nextButton').style.display = (page === totalPages) ? 'none' : 'inline-block';
      document.getElementById('submitButton').style.display = (page === totalPages) ? 'inline-block' : 'none';
    }
  
    // Function to handle form navigation
    document.getElementById('nextButton').addEventListener('click', function() {
      if (validatePage(currentPage)) {
        if (currentPage < totalPages) {
          currentPage++;
          showPage(currentPage);
        }
      }
    });
  
    document.getElementById('prevButton').addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
      }
    });
  
    // Validate the current page before moving to the next one
    async function validatePage(page) {
      let isValid = true;
  
      const inputs = document.querySelectorAll(`#page-${page} input, #page-${page} textarea`);
      inputs.forEach(input => {
        if (input.value.trim() === '') {
          isValid = false;
          alert(`Please fill out the ${input.placeholder} field.`);
        }
      });
  
      // Additional validation for USN
      if (page === 1) {
        const usn = document.getElementById('usn').value;
        if (usn && !/^[a-zA-Z0-9]{10}$/.test(usn)) {
          isValid = false;
          alert('USN must be exactly 10 alphanumeric characters.');
        }

        // Check if the USN already exists in the database before proceeding to the next page
        if (isValid) {
          const usnExists = await checkIfUSNExists(usn);
          if (usnExists) {
            isValid = false; // Prevent moving to the next page if USN exists
            alert('USN already exists! Please enter a different one.');
          }
        }
      }
  
      // Additional validation for Mobile
      const mobile = document.getElementById('mobile').value;
      if (mobile && !/^\d{10}$/.test(mobile)) {
        isValid = false;
        alert('Mobile number must be exactly 10 numeric characters.');
      }
  
      return isValid;
    }

    // Function to check if USN already exists
    async function checkIfUSNExists(usn) {
      try {
        const response = await fetch(`https://deepz.onrender.com/check-usn/${usn}`);
        const data = await response.json();
        return data.exists; // Returns true if USN exists, false otherwise
      } catch (error) {
        console.error('Error checking USN:', error);
        alert('There was an error checking the USN.');
        return false;
      }
    }
  
    // Handle form submission
    document.getElementById('studentForm').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent actual form submission
  
      if (await validatePage(currentPage)) {
        // Collect form data explicitly by ID
        const formObject = {
            firstname: document.querySelector("#firstname").value,
            lastname: document.querySelector("#lastname").value,
            usn: document.querySelector("#usn").value,
            mobile: document.querySelector("#mobile").value,
            address: document.querySelector("#address").value,
            email: document.querySelector("#email").value,
            certifications: document.querySelector("#certifications").value,
            "project-mini": document.querySelector("#miniProject").value,
            "project-major": document.querySelector("#majorProject").value,
            special: document.querySelector("#researchPapers").value,
            "degree-stream": document.querySelector("#degreeStream").value,
            sslc: document.querySelector("#sslc").value,
            puc: document.querySelector("#puc").value,
            degree: document.querySelector("#degree").value,
            pgcet: document.querySelector("#managementPgcet").value,
            "interest-technical": document.querySelector("#interestTechnical").value,
            "interest-extracurricular": document.querySelector("#interestExtracurricular").value,
            "interest-sports": document.querySelector("#interestSports").value,
            hobbies: document.querySelector("#hobbies").value
        };

        // Send form data to the backend using a POST request
        try {
          const response = await fetch('https://deepz.onrender.com/submit-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject), // Send the form data as JSON
          });

          const result = await response.json();
          if (response.ok) {
            alert('Form submitted successfully!');
            // Optionally, clear the form or redirect the user
          } else {
            alert('Error submitting form: ' + result.message);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('There was an error submitting the form.');
        }
      }
    });
});
