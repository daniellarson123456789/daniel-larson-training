import tls from 'node:tls';
import { pathToFileURL } from 'node:url';

const APPROVED_MAILBOX = 'daniel@daniellarsontraining.com';
const MAX_TOTAL_BYTES = 64 * 1024;
const MAX_LINE_BYTES = 16 * 1024;
const validCredential = value => typeof value === 'string' && /^[\x20-\x7e]{1,256}$/.test(value);
const quoted = value => `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;

function initialReport(username, password) {
  return {
    schemaVersion: 'gmail-readonly-capability-v1', status: 'not_run',
    usernameConfigured: typeof username === 'string' && username.trim().length > 0,
    passwordConfigured: typeof password === 'string' && password.length > 0,
    approvedMailboxMatches: typeof username === 'string' && username.trim().toLowerCase() === APPROVED_MAILBOX,
    connectionAttempted: false, tlsVerified: false, authenticated: false,
    inboxReadOnlyVerified: false, logoutAcknowledged: false,
    messagesFetched: false, flagsChanged: false, emailsSent: false,
  };
}

// A deliberately small fixed IMAP exchange, not a general-purpose IMAP client.
// Allowed commands: LOGIN, EXAMINE INBOX, LOGOUT. No CAPABILITY negotiation,
// SASL/base64, message FETCH, SEARCH, STORE, SELECT, CLOSE or EXPUNGE exists.
// The connector is injectable only for synthetic tests; production always
// uses Node TLS with certificate/hostname verification and one fixed host.
export async function probeMailbox({ username, password, connectImpl = tls.connect, timeoutMs = 20_000 } = {}) {
  const report = initialReport(username, password);
  if (!report.usernameConfigured || !report.passwordConfigured) return { ...report, status: 'existing_credentials_unavailable' };
  if (!report.approvedMailboxMatches) return { ...report, status: 'mailbox_identity_mismatch' };
  if (!validCredential(password)) return { ...report, status: 'credential_format_invalid' };

  return new Promise(resolve => {
    let socket, finished = false, state = 'greeting', received = 0;
    let buffer = Buffer.alloc(0), readOnlySeen = false;
    const timeout = setTimeout(() => finish('connection_or_protocol_timeout'), Math.min(20_000, Math.max(1, timeoutMs)));
    function finish(status) {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      try { socket?.destroy(); } catch {}
      resolve({ ...report, status });
    }
    function write(command) {
      try { socket.write(`${command}\r\n`); }
      catch { finish('connection_or_protocol_failure'); }
    }
    function handleLine(line) {
      if (finished) return;
      // None of the three commands needs a literal response. Refuse literals
      // instead of ever interpreting their bytes as commands or message data.
      if (/\{\d+\+?\}$/.test(line) || line.startsWith('+')) return finish('unexpected_protocol_response');
      if (state === 'greeting') {
        if (!report.tlsVerified || !/^\* OK(?: |$)/i.test(line)) return finish('unexpected_server_greeting');
        state = 'authentication';
        write(`P1 LOGIN ${quoted(APPROVED_MAILBOX)} ${quoted(password)}`);
        return;
      }
      if (/^\* BYE(?: |$)/i.test(line)) {
        if (state === 'logout') { report.logoutAcknowledged = true; return finish('imap_readonly_verified'); }
        return finish('server_closed_session');
      }
      if (state === 'authentication') {
        if (line.startsWith('* ')) return;
        if (/^P1 OK(?: |$)/i.test(line)) {
          report.authenticated = true;
          state = 'examine';
          write('P2 EXAMINE INBOX');
        } else if (/^P1 (?:NO|BAD)(?: |$)/i.test(line)) finish('authentication_denied');
        else finish('unexpected_protocol_response');
        return;
      }
      if (state === 'examine') {
        if (/\[READ-WRITE\]/i.test(line)) return finish('read_only_confirmation_missing');
        if (/\[READ-ONLY\]/i.test(line)) readOnlySeen = true;
        if (line.startsWith('* ')) return;
        if (/^P2 OK(?: |$)/i.test(line)) {
          if (!readOnlySeen) return finish('read_only_confirmation_missing');
          report.inboxReadOnlyVerified = true;
          state = 'logout';
          write('P3 LOGOUT');
        } else if (/^P2 (?:NO|BAD)(?: |$)/i.test(line)) finish('readonly_mailbox_access_denied');
        else finish('unexpected_protocol_response');
        return;
      }
      if (state === 'logout') {
        if (/^P3 OK(?: |$)/i.test(line)) { report.logoutAcknowledged = true; finish('imap_readonly_verified'); }
        else if (!line.startsWith('* ')) finish('logout_unconfirmed');
      }
    }
    try {
      report.connectionAttempted = true;
      socket = connectImpl({ host: 'imap.gmail.com', port: 993, servername: 'imap.gmail.com', rejectUnauthorized: true, minVersion: 'TLSv1.2' });
      socket.on('secureConnect', () => {
        if (socket.authorized !== true) return finish('tls_verification_failed');
        report.tlsVerified = true;
      });
      socket.on('data', chunk => {
        if (finished) return;
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        received += bytes.length;
        if (received > MAX_TOTAL_BYTES) return finish('response_size_limit');
        buffer = Buffer.concat([buffer, bytes]);
        for (;;) {
          const end = buffer.indexOf('\r\n');
          if (end < 0) {
            if (buffer.length > MAX_LINE_BYTES) finish('response_size_limit');
            return;
          }
          if (end > MAX_LINE_BYTES) return finish('response_size_limit');
          const line = buffer.subarray(0, end).toString('utf8');
          buffer = buffer.subarray(end + 2);
          handleLine(line);
          if (finished) return;
        }
      });
      socket.on('error', () => finish('connection_or_protocol_failure'));
      socket.on('close', () => finish('connection_closed_before_completion'));
    } catch { finish('connection_or_protocol_failure'); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await probeMailbox({ username: process.env.SMTP_USER, password: process.env.SMTP_APP_PASSWORD });
    console.log(JSON.stringify(report));
    process.exitCode = report.status === 'imap_readonly_verified' ? 0 : 1;
  } catch {
    console.log(JSON.stringify({ ...initialReport(), status: 'internal_probe_failure' }));
    process.exitCode = 1;
  }
}
