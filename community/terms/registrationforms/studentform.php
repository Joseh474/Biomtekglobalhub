<?php
// Database connection details
$servername = "de-s1.serverpanel.com";
$username = "root";
$password = "";
$dbname = "biomtekg_studentregistration";

// Establish connection
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
$institution_name = $_POST['institution_name'];
$adm_number = $_POST['adm_number'];
$year_of_study = $_POST['year_of_study'];
$home_address = $_POST['home_address'];
$postal_code = $_POST['postal_code'];

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO users (
    first_name, second_name, surname, username, id_number, email, phone_number, 
    alt_phone_number, gender, institution_name, adm_number, year_of_study, 
    home_address, postal_code
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssssssssssssss", 
    $first_name, $second_name, $surname, $username, $id_number, $email, 
    $phone_number, $alt_phone_number, $gender, $institution_name, 
    $adm_number, $year_of_study, $home_address, $postal_code
);

// Execute the query
if ($stmt->execute()) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

// Close connections
$stmt->close();
$conn->close();
?>
