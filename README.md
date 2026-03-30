# classes

## Project setup

```
npm install
```

### Compiles and loads the back-end for development

```
npm run server
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint-fix
```

## Mail Environment

For classes mail, use `back-end/.env.EXAMPLE` as the source-of-truth template. The backend now prefers a primary local Postfix transport (`SMTP_PRIMARY_HOST=127.0.0.1`, `SMTP_PRIMARY_PORT=25`, `SMTP_PRIMARY_SERVERNAME=mail.stridewithus.co`) with `MDMAIL_PRIMARY_FROM=classes@jacobdanderson.net`. If that primary transport fails for a transport-level reason, it retries once through the Gmail fallback transport (`SMTP_FALLBACK_HOST=smtp.gmail.com`, `SMTP_FALLBACK_PORT=587`, `SMTP_FALLBACK_SERVERNAME=smtp.gmail.com`). Only if the fallback transport rejects the domain sender does it retry once more with `MDMAIL_FALLBACK_FROM=jacobdanderson@gmail.com`.

After a successful send, the backend also attempts a best-effort IMAP append into the sender mailbox's sent folder using `IMAP_APPEND_HOST`, `IMAP_APPEND_PORT`, `IMAP_APPEND_USER`, `IMAP_APPEND_PASS`, and `IMAP_SENT_MAILBOX`. IMAP append failures are logged as warnings and do not fail the email send response.

Legacy `MDMAIL_FROM_PRIMARY`, `MDMAIL_FROM_FALLBACK`, `MDMAIL_FROM`, and single-transport `SMTP_*` settings are still read for backwards compatibility.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
