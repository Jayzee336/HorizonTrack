<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit;
}

$users = json_decode(file_get_contents('users.json'), true);
if (!$users) {
    $users = ['users' => []];
}

if (isset($users['users'][$username])) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$users['users'][$username] = $hashedPassword;
file_put_contents('users.json', json_encode($users, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'User registered successfully']);
?>
