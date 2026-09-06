<?php
/**
 * Contact form handler for Hostinger shared hosting.
 *
 * Shared plans have no Node runtime, so the React form posts JSON here and
 * this script mails it with PHP's mail(). Set $TO below to the real inbox.
 *
 * Protections: POST-only, JSON-only, honeypot, length caps, header-injection
 * stripping, and a 60-second per-IP throttle backed by a file in sys_get_temp_dir().
 */

declare(strict_types=1);

// ── Configure ────────────────────────────────────────────────────────────
$TO      = 'contact@akoubri.com';   // <-- change to the real recipient
$SUBJECT = 'Nouvelle demande — site Akoubri';
// On Hostinger the From address must belong to your own domain or the mail
// is rejected as spoofed. Create this mailbox in hPanel first.
$FROM    = 'no-reply@akoubri.com';
$THROTTLE_SECONDS = 60;
// ─────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail(int $code, string $msg): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Méthode non autorisée.');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    fail(413, 'Requête trop volumineuse.');
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    fail(400, 'Requête invalide.');
}

// Honeypot: real users never see this field, so any value means a bot.
if (!empty($data['company'])) {
    // Answer 200 so the bot believes it succeeded and does not retry.
    echo json_encode(['ok' => true]);
    exit;
}

// Per-IP throttle.
$ip   = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$lock = sys_get_temp_dir() . '/akoubri_' . hash('sha256', $ip) . '.lock';
if (is_file($lock) && (time() - (int) filemtime($lock)) < $THROTTLE_SECONDS) {
    fail(429, 'Merci de patienter avant un nouvel envoi.');
}
@touch($lock);

// Strip CR/LF so a submitted value cannot inject extra mail headers.
$clean = static function (?string $v, int $max): string {
    $v = trim((string) $v);
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr($v, 0, $max);
};

$name    = $clean($data['name']    ?? '', 120);
$email   = $clean($data['email']   ?? '', 180);
$phone   = $clean($data['phone']   ?? '', 60);
$mission = $clean($data['mission'] ?? '', 80);
$budget  = $clean($data['budget']  ?? '', 80);
// The message body keeps its newlines — it is not a header.
$message = mb_substr(trim((string) ($data['message'] ?? '')), 0, 5000);

if (mb_strlen($name) < 2) {
    fail(422, 'Nom manquant.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Adresse e-mail invalide.');
}
if (mb_strlen($message) < 20) {
    fail(422, 'Message trop court.');
}

$body = "Nouvelle demande depuis akoubri.com\n\n"
      . "Nom      : {$name}\n"
      . "E-mail   : {$email}\n"
      . "Téléphone: " . ($phone   ?: '—') . "\n"
      . "Mission  : " . ($mission ?: '—') . "\n"
      . "Budget   : " . ($budget  ?: '—') . "\n\n"
      . "Message :\n{$message}\n\n"
      . "---\nIP : {$ip}\nDate : " . date('c') . "\n";

$headers = implode("\r\n", [
    'From: Site Akoubri <' . $FROM . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
]);

$subject = '=?UTF-8?B?' . base64_encode($SUBJECT . ' — ' . $name) . '?=';

if (!@mail($TO, $subject, $body, $headers, '-f' . $FROM)) {
    fail(500, "L'envoi a échoué.");
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
