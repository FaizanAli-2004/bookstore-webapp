# Responsive Bookstore Payment Application

## Overview
This project is a responsive multi-page web application for a bookstore. It features a homepage listing books for sale, a payment page with client-side credit card validation, 
and a success page confirming the payment.

The project demonstrates:
- Responsive design adapting to desktop, tablet, and mobile screens.
- Credit card validation with JavaScript, including checks for card number length, Mastercard prefixes, expiration date, and CVV code.
- Integration with a backend API to simulate payment processing.
- User-friendly feedback messages and error handling.

## Pages
### 1. Homepage (`index.html`)
- Displays a navigation bar with links to Home,(About Us and Contact Us pages dont have pages).
- Shows a list of at least four books, each with a cover image, short description, and a "Pay" button.
- Layout switches between two-column on desktop and single-column on tablets and smartphones.
### 2. Payment Page (`pay.html`)
- Allows users to enter credit card details (card number, expiry date, CVV).
- Validates inputs using JavaScript:
  - Card number must be 16 digits.
  - Card number must start with 51, 52, 53, 54, or 55. (mastercard in this case)
  - Card must not be expired.
  - CVV must be 3 or 4 digits.
- Sends payment data via a POST request to the API endpoint: `mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard`.
- Handles server errors and displays feedback messages.
### 3. Success Page (`success.html`)
- Displays a success message upon payment completion.
- Shows the last four digits of the credit card used.


## Technologies Used
- HTML5
- CSS3 (including media queries for responsiveness)
- JavaScript (for validation and API communication)
- Fetch API for POST requests

## How to Run
1. Clone this repository:
   ```bash
   git clone https://github.com/FaizanAli-2004/responsive-bookstore-payment.git

   Or download the ZIP folder from GitHub, then unzip it on your computer.

##Folder Structure
/ (root)
|-- index.html
|-- pay.html
|-- success.html
|-- CSS/
|    |-- style.css
|-- Javascript/
|    |-- site.js
|-- images/
|    |-- logo, mastercard, etc.
