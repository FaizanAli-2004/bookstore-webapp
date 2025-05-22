// Get the menu button and navigation menu
let menuButton = document.querySelector(".menu-toggle");
let navMenu = document.querySelector(".nav-links");

// When the menu button is clicked, show or hide the menu
menuButton.onclick = function() {
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none"; // Hide menu if visible
    } else {
        navMenu.style.display = "block"; // Show menu if hidden
    }
};

// Make all Pay buttons go to payment page
document.querySelectorAll('.pay-button').forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'pay.html'; // Go to payment page
    });
});



// Function to check form inputs are correct by using regular expression
function validateForm(cardRaw, expMonth, expYear, cvv) {
    const now = new Date();  // Get the current date and time
    const errors = []; // Create an empty list to store error messages

    // Get the input fields for card number, expiration month, year, and CVV from the webpage
    const cardInput = document.getElementById('cardnumber');
    const monthInput = document.getElementById('expMonth');
    const yearInput = document.getElementById('expYear');
    const cvvInput = document.getElementById('cvv');

    // Validate card number, expiration date and CVV using regular expression
    // Check if the card number contains only digits, start with 51-55 and exactly 16 digits, 
    // If not, add an error message and highlight the card input field
    if (!/^\d+$/.test(cardRaw)) { 
        errors.push("Card number must contain only numbers (no letters or symbols).");
        cardInput.classList.add('error');
    } else if (!/^\d{16}$/.test(cardRaw)) {
        errors.push("Card number must be exactly 16 digits.");
        cardInput.classList.add('error');
    } else if (!/^5[1-5]/.test(cardRaw)) {
        errors.push("Card must start with 51–55 (MasterCard).");
        cardInput.classList.add('error');
    }

    // Validate expiration,Check if the expiration date has already passed,
    // If expired, add an error message and highlight the month and year input fields
    if (isNaN(expMonth) || isNaN(expYear)) {
        errors.push("Please select a valid expiration date.");
        monthInput.classList.add('error');
        yearInput.classList.add('error');
    } else {
        if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth <= now.getMonth() + 1)) {
            errors.push("Card has expired.");
            monthInput.classList.add('error');
            yearInput.classList.add('error');
        }
    }

    //Check if the CVV contains only numbers and must be 3 or 4 digits, 
    //If not, add an error message and highlight the CVV input field
    if (!/^\d+$/.test(cvv)) {
        errors.push("Card number must contain only numbers (no letters or symbols).");
        cvvInput.classList.add('error');
    }
     else if (!/^\d{3,4}$/.test(cvv)) {
        errors.push("CVV must be 3 or 4 digits.");
        cvvInput.classList.add('error');
    }

    return errors;   // Return the list of error messages (if any)
}



// Function to clear all error states from the input fields
function clearErrorStates() {
        document.querySelectorAll('.payment-container input').forEach(input => {  // Select all input fields within the payment container
            input.classList.remove('error'); // Remove the 'error' class from each input field
        });
    }

    
// When HTML page loads, run this code
document.addEventListener('DOMContentLoaded', () => {
    // Fill months and years dropdown
    const monthSelect = document.getElementById('expMonth');
    const yearSelect = document.getElementById('expYear');
    const now = new Date(); // Get current date

    for (let i = 1; i <= 12; i++) { // Add months 01-12 to dropdown
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i.toString().padStart(2, '0'); // Makes 1 show as 01
        monthSelect.appendChild(opt);
    }

    for (let i = 0; i < 10; i++) {  // Add current year + next 9 years to dropdown
        const year = now.getFullYear() + i;
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        yearSelect.appendChild(opt);
    }
    
    // Get payment form and feedback area
    const form = document.getElementById('paymentForm');
    const feedback = document.getElementById('payment-feedback');

    // When form is submitted
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop form from reloading page
        feedback.innerHTML = ''; // Clear any old messages
        clearErrorStates(); 
 
        // Get form inputs
        const cardRaw = document.getElementById('cardnumber').value.trim();
        const expMonth = parseInt(monthSelect.value, 10);
        const expYear = parseInt(yearSelect.value, 10);
        const cvv = document.getElementById('cvv').value.trim();

        const errors = validateForm(cardRaw, expMonth, expYear, cvv); // Check for errors

        if (errors.length > 0) { // If there are errors, show them
            feedback.innerHTML = `<ul style="color: red;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
            return;
        }

        // Prepare data to send to server
        const payload = {
            master_card: Number(cardRaw),
            exp_year: expYear,
            exp_month: expMonth,
            cvv_code: cvv
        };
        
        try {
            // Send data to the server
            const res = await fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
 
            const contentType = res.headers.get("Content-Type") || "";   // Check response type
            let data = {};

             // Check if the response is in JSON format, if not then read as text
            if (contentType.includes("application/json")) {
                try {
                    data = await res.json();
                } catch (jsonError) {
                    feedback.innerHTML = `<p style="color:red;">Error parsing server response as JSON.</p>`;
                    return;
                }
            } else {
                // Handle plain text or unexpected response format if not json
                data.message = await res.text();
            }

            // If server response is not OK, show error
            if (!res.ok) {
                const errorMessage = data.message || data.error || "An error occurred. Please try again.";
                feedback.innerHTML = `<p style="color:red;">${errorMessage}</p>`;
                return;
            }

            // If payment worked, Save last four digits of card and success message
            sessionStorage.setItem("lastFour", cardRaw.slice(-4));
            sessionStorage.setItem("paymentMessage", data.message || "Payment successful!");
            window.location.href = "success.html"; // Go to the success page

        } catch (err) {
            feedback.innerHTML = `<p style="color:red;">Network error. Please try again.</p>`;
        }
    });
});



// Show last four digits and payment message,when success page
document.addEventListener('DOMContentLoaded', () => {
    // Get saved payment info
    const lastFour = sessionStorage.getItem('lastFour') || 'XXXX';
    const message = sessionStorage.getItem('paymentMessage') || 'Thank you.';
  
    // Show last four digits
    document.getElementById('lastFourDisplay').innerHTML = `
      <p>Your credit card numbers end in “**** **** **** <strong>${lastFour}</strong>”</p>
    `;

    // Show payment message
    document.getElementById('message').innerHTML = `
      <p>${message}</p>
    `;
});
