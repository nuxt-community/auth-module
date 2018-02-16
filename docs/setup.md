# Setup

Install with yarn:

```bash
yarn add @nuxtjs/auth @nuxtjs/axios
```

Install with npm:

```bash
npm install @nuxtjs/auth @nuxtjs/axios
```

Edit `nuxt.config.js`:

```js
{
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
 ],

 auth: {
   // Options
 }
```

👉 You can now optionaly configure [Auth Middleware](middleware.md) and some [Strategies](strategies/README.md)
