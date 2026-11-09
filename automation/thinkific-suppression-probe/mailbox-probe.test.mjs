import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { probeMailbox } from './mailbox-probe.mjs';

const username = 'daniel@daniellarsontraining.com';
const password = 'synthetic-password';
class FakeSocket extends EventEmitter {
  authorized = true;
  writes = [];
  destroyed = false;
  write(value) { this.writes.push(value); }
  destroy() { this.destroyed = true; }
  data(value) { this.emit('data', Buffer.from(value)); }
}
function setup(overrides = {}) {
  const socket = new FakeSocket();
  let options;
  const promise = probeMailbox({ username, password, connectImpl: value => { options = value; return socket; }, ...overrides });
  return { socket, promise, get options() { return options; } };
}
function authenticate(socket) {
  socket.emit('secureConnect'); socket.data('* OK ready\r\n'); socket.data('P1 OK authenticated\r\n');
}

test('missing secrets and mailbox mismatch never connect or disclose the supplied identity', async () => {
  let connections = 0;
  const connectImpl = () => { connections++; throw new Error('must not connect'); };
  const missing = await probeMailbox({ username, connectImpl });
  const mismatch = await probeMailbox({ username: 'other@example.invalid', password, connectImpl });
  assert.equal(connections, 0);
  assert.equal(missing.status, 'existing_credentials_unavailable');
  assert.equal(mismatch.status, 'mailbox_identity_mismatch');
  assert.equal(mismatch.approvedMailboxMatches, false);
  assert.equal(JSON.stringify(mismatch).includes('other@example.invalid'), false);
});
test('verified TLS allows only LOGIN, EXAMINE and LOGOUT with split response frames', async () => {
  const s = setup();
  assert.equal(s.options.host, 'imap.gmail.com'); assert.equal(s.options.port, 993);
  assert.equal(s.options.rejectUnauthorized, true); assert.equal(s.options.servername, 'imap.gmail.com');
  s.socket.emit('secureConnect'); s.socket.data('* OK read'); s.socket.data('y\r\n');
  s.socket.data('P1 OK authenticated\r\n* 7 EXISTS\r\n');
  s.socket.data('P2 OK [READ-ONLY] selected\r\n');
  s.socket.data('* BYE logout\r\nP3 OK done\r\n');
  const report = await s.promise;
  assert.deepEqual(s.socket.writes.map(x => x.split(' ')[1]), ['LOGIN', 'EXAMINE', 'LOGOUT\r\n']);
  assert.equal(s.socket.writes[1], 'P2 EXAMINE INBOX\r\n');
  assert.equal(report.status, 'imap_readonly_verified');
  assert.equal(report.inboxReadOnlyVerified, true); assert.equal(report.logoutAcknowledged, true);
  assert.equal(report.messagesFetched, false); assert.equal(report.flagsChanged, false);
  assert.equal(s.socket.destroyed, true);
  for (const secret of [username, password, '7 EXISTS', 'authenticated\r\n']) assert.equal(JSON.stringify(report).includes(secret), false);
});
test('unverified TLS and preauthenticated greetings cannot bypass identity verification', async () => {
  const tls = setup(); tls.socket.authorized = false; tls.socket.emit('secureConnect');
  assert.equal((await tls.promise).status, 'tls_verification_failed'); assert.equal(tls.socket.writes.length, 0);
  const preauth = setup(); preauth.socket.emit('secureConnect'); preauth.socket.data('* PREAUTH already signed in\r\n');
  assert.equal((await preauth.promise).status, 'unexpected_server_greeting'); assert.equal(preauth.socket.writes.length, 0);
});
test('authentication refusal hides server text and does not examine the mailbox', async () => {
  const s = setup(); s.socket.emit('secureConnect'); s.socket.data('* OK ready\r\n');
  s.socket.data(`P1 NO ${password} person@example.invalid\r\n`);
  const report = await s.promise;
  assert.equal(report.status, 'authentication_denied'); assert.equal(s.socket.writes.length, 1);
  assert.equal(JSON.stringify(report).includes(password), false);
});
test('EXAMINE must confirm read-only and never falls back to SELECT', async () => {
  for (const line of ['P2 OK selected\r\n', 'P2 OK [READ-WRITE] selected\r\n']) {
    const s = setup(); authenticate(s.socket); s.socket.data(line);
    assert.equal((await s.promise).status, 'read_only_confirmation_missing');
    assert.equal(s.socket.writes.length, 2);
  }
});
test('literal responses, long lines and excessive aggregate bytes stop immediately', async () => {
  for (const value of ['* OK {999999}\r\n', '* OK ' + 'x'.repeat(17 * 1024), '* OK ' + 'x'.repeat(65 * 1024)]) {
    const s = setup(); s.socket.emit('secureConnect'); s.socket.data(value);
    assert.ok(['unexpected_protocol_response', 'response_size_limit'].includes((await s.promise).status));
    assert.equal(s.socket.writes.length, 0);
  }
});
test('hard total timeout makes one connection and leaks no exception details', async () => {
  const s = setup({ timeoutMs: 5 });
  assert.equal((await s.promise).status, 'connection_or_protocol_timeout');
  assert.equal(s.socket.destroyed, true);
  const failed = setup(); failed.socket.emit('error', new Error(`${password} private@example.invalid`));
  const report = await failed.promise;
  assert.equal(report.status, 'connection_or_protocol_failure');
  assert.equal(JSON.stringify(report).includes(password), false);
});
test('credential control characters are refused before connecting', async () => {
  const s = setup({ password: 'test\r\nP9 STORE 1 +FLAGS (\\Seen)' });
  const report = await s.promise;
  assert.equal(report.status, 'credential_format_invalid');
  assert.equal(s.options, undefined);
});
