<?php
/**
 * A minimal SMTP client — just enough to hand one message to Gmail.
 *
 * PHP's mail() cannot authenticate, so on shared hosting it sends as the
 * server and Gmail treats the result as spoofed: spam folder at best, a
 * silent drop at worst. Speaking SMTP ourselves with an app password means
 * the mail leaves as a genuine Gmail send and actually arrives.
 *
 * No Composer here — shared plans have no vendor dir — so this is written
 * against the handful of verbs one message needs: EHLO, STARTTLS, AUTH
 * LOGIN, MAIL FROM, RCPT TO, DATA, QUIT.
 */

declare(strict_types=1);

final class SmtpError extends RuntimeException {}

final class Smtp
{
    /** @var resource */
    private $conn;

    private function __construct($conn)
    {
        $this->conn = $conn;
    }

    /**
     * Open a session and authenticate. Port 465 wraps the whole connection
     * in TLS; 587 opens in clear and upgrades with STARTTLS.
     */
    public static function connect(
        string $host,
        int $port,
        string $user,
        string $pass,
        int $timeout = 15
    ): self {
        $transport = $port === 465 ? "ssl://{$host}:{$port}" : "tcp://{$host}:{$port}";

        $conn = @stream_socket_client(
            $transport,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            stream_context_create([
                'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true],
            ])
        );

        if (!$conn) {
            throw new SmtpError("Connexion SMTP impossible ({$errno} {$errstr}).");
        }

        stream_set_timeout($conn, $timeout);
        $smtp = new self($conn);

        $smtp->expect(220);
        $smtp->command("EHLO {$host}", 250);

        if ($port !== 465) {
            $smtp->command('STARTTLS', 220);
            if (!@stream_socket_enable_crypto($conn, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new SmtpError('Passage en TLS refusé.');
            }
            // The handshake resets what the server told us, so greet again.
            $smtp->command("EHLO {$host}", 250);
        }

        $smtp->command('AUTH LOGIN', 334);
        $smtp->command(base64_encode($user), 334);
        // 235 = authenticated. A 535 here means the app password is wrong
        // or was revoked.
        $smtp->command(base64_encode($pass), 235);

        return $smtp;
    }

    /**
     * @param string $envelopeFrom bare address used for MAIL FROM
     * @param string $to           bare recipient address
     * @param string $headers      CRLF-joined header block
     */
    public function send(string $envelopeFrom, string $to, string $headers, string $body): void
    {
        $this->command("MAIL FROM:<{$envelopeFrom}>", 250);
        $this->command("RCPT TO:<{$to}>", 250);
        $this->command('DATA', 354);

        // A lone "." on a line would end DATA early, so any such line gets
        // an extra dot the server strips back off.
        $message = $headers . "\r\n\r\n" . $body;
        $message = preg_replace('/^\./m', '..', str_replace(["\r\n", "\r", "\n"], "\r\n", $message));

        $this->write($message . "\r\n.");
        $this->expect(250);
    }

    public function quit(): void
    {
        // Best effort: the mail is already accepted by this point.
        @$this->write('QUIT');
        @fclose($this->conn);
    }

    private function command(string $line, int $expected): string
    {
        $this->write($line);
        return $this->expect($expected);
    }

    private function write(string $line): void
    {
        if (@fwrite($this->conn, $line . "\r\n") === false) {
            throw new SmtpError('Écriture SMTP interrompue.');
        }
    }

    /** Read one reply, following multi-line continuations ("250-"). */
    private function expect(int $code): string
    {
        $reply = '';
        do {
            $line = @fgets($this->conn, 515);
            if ($line === false) {
                throw new SmtpError('Réponse SMTP absente (délai dépassé).');
            }
            $reply .= $line;
        } while (isset($line[3]) && $line[3] === '-');

        if ((int) substr($reply, 0, 3) !== $code) {
            throw new SmtpError('SMTP a répondu : ' . trim($reply));
        }

        return $reply;
    }
}
