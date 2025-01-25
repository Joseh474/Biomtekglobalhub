<?php
// Database connection details
$servername = "de-s1.serverpanel.com";
$username = "root";
$password = "";
$dbname = "biomtekg_proffessionaltregistration";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve form data
$first_name = $_POST['first_name'];
$second_name = $_POST['second_name'];
$surname = $_POST['surname'];
$username = $_POST['username'];
$id_number = $_POST['id_number'];
$email = $_POST['email'];
$phone_number = $_POST['phone_number'];
$alt_phone_number = $_POST['alt_phone_number'] ?? NULL;
$gender = $_POST['gender'];
$employed = $_POST['employed'] ?? NULL;
$company_name = $_POST['company_name'] ?? NULL;
$profession = $_POST['proffession'] ?? NULL;
$owns_business = $_POST['owns_business'] ?? NULL;
$home_address = $_POST['home_address'];
$postal_code = $_POST['postal_code'];

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO users (
    first_name, second_name, surname, username, id_number, email, phone_number, 
    alt_phone_number, gender, employed, company_name, profession, 
    owns_business, home_address, postal_code
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "sssssssssssssss", 
    $first_name, $second_name, $surname, $username, $id_number, $email, 
    $phone_number, $alt_phone_number, $gender, $employed, $company_name, 
    $profession, $owns_business, $home_address, $postal_code
);

// Execute the query
if ($stmt->execute()) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
