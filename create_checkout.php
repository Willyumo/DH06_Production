<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$lineItems = [];
foreach (($input['items'] ?? []) as $item) {
    $id  = $item['id'] ?? '';
    $qty = max(1, min(10, (int)($item['qty'] ?? 1)));
    if (!isset(PRICES[$id])) {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown item']);
        exit;
    }
    $lineItems[] = ['price' => PRICES[$id], 'quantity' => $qty];
}
if (!$lineItems) {
    http_response_code(400);
    echo json_encode(['error' => 'Cart is empty']);
    exit;
}

try {
    $session = \Stripe\Checkout\Session::create([
        'ui_mode' => 'custom',
        'mode' => 'payment',
        'line_items' => $lineItems,
        //whenn pushing to my website, change the return_url to the actual website url DH06Production.com/complete.html
        'return_url' => 'http://localhost:3000/complete.html?session_id={CHECKOUT_SESSION_ID}',
        // For physical prints, uncomment to collect a shipping address:
        // 'shipping_address_collection' => ['allowed_countries' => ['US']],
    ]);
    echo json_encode(['clientSecret' => $session->client_secret]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not start checkout']);
}