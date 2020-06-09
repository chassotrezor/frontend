# Chassotrezor (chassotrezor)

Treasure hunt based on QR-Codes

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Run unit tests with majestic
```bash
yarn test:unit:ui
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### Mocking firebase in tests
Firebase auth logic is kept in one file: `src/components/authentication/firebaseAuth.js`.
The components will only access it through the alias `@firebaseAuth`.
The alias is configured in `quasar.conf.js`:
```
build: {
  extendWebpack (cfg) {
    cfg.module.rules.push({
      enforce: 'pre',
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    })

    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      '@firebaseAuth': path.resolve(__dirname, './src/components/authentication/firebaseAuth.js')
    }
  }
}
```
This file is mocked by redefining this alias for jest in `jest.config.js`:
```
moduleNameMapper: {
  '@firebaseAuth': '<rootDir>/test/jest/utils/mockFirebaseAuth.js'
```
`mockFirebaseAuth.js` provides mocks and setters for the Firebase auth logic
