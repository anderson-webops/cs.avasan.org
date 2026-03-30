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

For classes mail, use `back-end/.env.EXAMPLE` as the source-of-truth template. Production mail should send with `MDMAIL_FROM_PRIMARY=classes@jacobdanderson.net`, retry once with `MDMAIL_FROM_FALLBACK=jacobdanderson@gmail.com` only when the SMTP server rejects the sender identity, and keep `SMTP_SERVERNAME=mail.stridewithus.co`. The legacy `MDMAIL_FROM` setting is still accepted as the primary sender if `MDMAIL_FROM_PRIMARY` is unset.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
