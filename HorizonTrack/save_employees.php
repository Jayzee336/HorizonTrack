<?php
header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['employees'])) {
    $employees = $data['employees'];
    $jsonFilePath = 'employees.json';

    if (file_put_contents($jsonFilePath, json_encode($employees, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Employees saved successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to write to employees.json.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid data received.']);
}
?>
