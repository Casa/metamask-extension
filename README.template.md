<!-- TODO: Replace MICRO_SERVICE_NAME with the name as entered in package.json -->
<!-- TODO: Replace MICRO_SERVICE_REPO with the name of the repo -->
<!-- TODO: Replace CODECOV_BADGE_TOKEN with the badge token from Codecov repo settings -->

# MICRO_SERVICE_NAME [![codecov](https://codecov.io/gh/Casa/MICRO_SERVICE_REPO/branch/develop/graph/badge.svg?token=CODECOV_BADGE_TOKEN)](https://codecov.io/gh/Casa/MICRO_SERVICE_REPO)

<!-- TODO: Replace MICROSERVICE_DESCRIPTION with the description as entered in package.json -->

MICROSERVICE_DESCRIPTION

1. [Get started](#-get-started)
1. [Develop and test](#-develop-and-test)
1. [Lint and format](#-lint-and-format)
1. [Build and deploy](#-build-and-deploy)

<br />
<br />

## 🔢 Get started

> 💡 Reminder, you can list out all the commands available by running `yarn run`.

### 1. Database

<!-- TODO: Remove the "Database" section if this microservice doesn't need one -->

This microservice uses Postgres as its database. Before you can do anything with it, you need to:

1. Download and install Postgres: https://www.postgresql.org/download/
1. Download and install Postico\* (optional): https://eggerapps.at/postico/

\* Postico is free to set up but requires a license after a trial period. If you don't already have one, you can request it from our Finance/Ops team.

After the installation completes, run:

1. `yarn db:init` to set up the database
1. `yarn db:migrate` to run all migrations

Once the migrations are done, you need to:

1. Launch Postgres
1. Create a new Server if needed (just give a name and leave the rest)
1. _**Set the port to 5678**_ (the default Postgres port is forwarded through to our SSH jumphosts)
1. Start the new Server

You can then use Postico to view the database.

### 2. Environment variables

🚨🚨 **Before moving forward, make sure you have the correct environment variables set up.** 🚨🚨

Start by copying the `.env.template` to `.env`.

Based on the environment you want to set up, you can set the appropriate variables. Leaving variables commented out sets them to the presumed default value.

For empty values, check our shared [1Password Vaults](https://team-casainc.1password.com/) or ask other devs to share them with you.

### 3. Dependencies

Ensure you're using the correct Node version based on the `engines` field in the `package.json` file and the `.nvmrc` file. You can switch between Node versions by using [`n`](https://github.com/tj/n) (or [`nvm`](https://github.com/nvm-sh/nvm)).

Make sure you have [Yarn](https://yarnpkg.com/) installed as well.

Once all that is done, install the dependencies by running:

```bash
yarn install
```

### 4. Verification

To make sure everything has been set up correctly, run the following command:

```bash
yarn test:summary
```

If all tests are passing, you are good to go!

<br />
<br />

## 🧪 Develop and test

👉👉 Before writing any code, it is important to understand how this microservice is architected.

### Directory structure

Code is organized into the following directories:

1. **`src/routes`** – entry point for API requests
1. **`src/singletons`** – singular instances of objects/classes, such as the db
1. **`src/services`** – helper methods for acting upon API requests
1. **`src/models`** – model definitions of db tables
1. **`src/utils`** – utility methods to share across modules
1. **`src/types`** – type definitions for API routes and run-time validations
1. **`src/constants`** – static values, enums, and generic types

_**NOTE: The directory order has meaning!**_

A file in a certain directory should only import from files in directories below it or within the same directory. Maintaining this directory hierarchy avoids running into circular dependencies, aids in dependency injection, and keeps things well organized.

For example, these are valid:

- ☑️ `routes` importing `singletons`
- ☑️ `services` importing `models`
- ☑️ `services` importing other `services`

But these are invalid:

- ✖️ `types` importing `services`
- ✖️ `services` importing `routes`
- ✖️ `services` importing `singletons`\*

\* There are scenarios where a service method needs a singleton. This must be done using dependency injection as described below. 👇

### Dependency injection

The bulk of logic lives within service methods and therefore it needs to be simple to test all branches of code. As a codebase grows, this becomes harder to do because service methods can end up relying on a lot of dependencies.

This is where dependency injection comes in.

Whenever service methods are interacting with 3rd party dependencies, the dependencies should be passed in by the respective route handlers. In doing so, we can simplify unit tests by passing in mocked versions of the dependencies.

The same applies for service methods that need singletons. We can create and tear down instances of singletons within tests so that they run in isolation without building up state that affects other tests.

👉👉 To enable dependency injection, we use the "[Reader monad](https://fsharpforfunandprofit.com/posts/dependencies-3/)" convention in methods. Take a look at `example.service.ts` and `logger.service.ts` to see examples of how this is done.

### Development

Given our current tooling, we cannot run lambda servers locally. Instead, we rely on writing tests based on specs and getting those to pass.

We use [Jest](https://jestjs.io) as our test runner. The test files live within the `tests` directory and end with `.test.ts`.

There are two types of tests:

- **Unit tests**:
  - Test independent methods in isolation.
  - Import the method and test it directly.
- **Integration tests**:
  - Test how a client request to the microservice is received and responded to.
  - Construct a request and pass it to the lambda handler.

You can run the tests in several ways:

```bash
# runs the entire test suite
yarn test

# runs one test file
yarn test tests/units/services/example.service.test.ts

# runs all files matching the glob pattern
yarn test tests/units/services/*.ts
```

You can also run variations of the command above by swapping out `yarn test` with:

- `yarn test:summary` – to disable logging
- `yarn test:coverage` – to get code coverage stats

You can also view code coverage stats more interactively in your browser by running `yarn test:coverage:open`.

### Migrations and seeders

<!-- TODO: Remove the "Migrations and seeders" section if this microservice doesn't have a database -->

Migration files live within the `src/migrations` directory.

Whenever a model schema changes, a new migration file should be created. There are examples in the directory on how you can create new tables, add/remove columns, etc.

_**NOTE: Migration files are sorted by ascending date so that they run in the correct order.**_

Seeder files live within the `src/seeders` directory. These can be used to seed the database with initial data for local development or testing.

Generally speaking, there will not be much need for creating one of these.

<br />
<br />

## ✨ Lint and format

Files are linted & formatted using 2 different packages: [ESLint](https://eslint.org) and [Prettier](https://prettier.io). While ESLint is a linter that helps avoid typical JavaScript “gotchas”, Prettier is more of an opinionated formatter that can format your code for you on every file save.

👉👉 _**It is HIGHLY recommended**_ that you set up Prettier with your text editor to auto-format on file save: https://prettier.io/docs/en/editors.html

You can lint all files by running:

```bash
yarn lint
```

You can automatically fix many linting issues by running:

```bash
yarn lint:fix
```

<br />
<br />

## 🚢 Build and deploy

You can build a bundle for production distribution by running:

```bash
yarn build
```

This command:

1. Verifies the build types with TypeScript,
1. Transpiles the TypeScript source into optimized JavaScript with [esbuild](https://esbuild.github.io/),
1. Zips the JavaScript files along with the sourcemaps.

The zip file is then deployed to AWS through GitHub Actions.
