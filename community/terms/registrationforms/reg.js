// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    // Event listener for form submission
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Validate form inputs
      if (validateForm()) {
        alert("Registration Successful!"); // Display success message
        form.reset(); // Reset the form fields
      }
    });
  
    // Validate the form fields
    function validateForm() {
      const inputs = document.querySelectorAll(".input-box input");
      let valid = true;
  
      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          alert(`${input.previousElementSibling.textContent} is required.`);
          input.focus();
          valid = false;
          return false; // Exit loop on invalid input
        }
      });
  
      return valid;
    }
  });
  