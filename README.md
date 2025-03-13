# AWS Lambda Template [![codecov](https://codecov.io/gh/Casa/node-ts-lambda-template/branch/develop/graph/badge.svg?token=6v2mxS3W4i)](https://codecov.io/gh/Casa/node-ts-lambda-template)

This template is for building microservices on top of AWS Lambda using TypeScript, Node.js, and Postgres.

Follow the steps below to get your microservice up and running:

1. [Create new repo](#1-create-new-repo)
1. [Describe microservice package](#2-describe-microservice-package)
1. [Update repo setup](#3-update-repo-setup)
1. [Configure Terraform](#4-configure-terraform)
1. [Wrap up](#5-wrap-up)

<br />
<br />

## 1. Create new repo

1. Click the "**Use this template**" button on the top of the repo page to quickstart your new service.
1. Fill in the microservice name and create the repo.
1. Once it's created, clone the repo locally so you can start setting that up.

<br />
<br />

## 2. Describe microservice package

1. Open the `package.json` file.
1. Set the `name` field to the name of the microservice (dash-casing required).
1. Set the `description` field to briefly describe the purpose of the microservice.

<br />
<br />

## 3. Update repo setup

The codebase has a bunch of `TODO` notes where you will need to make some changes.

Generally speaking, the `TODO`s fall under the following categories:

- Updating documentation.
- Adding secrets to the repo settings (Codecov, AWS, etc).

Find and complete the `TODO`s and remove the notes as you go.

<br />
<br />

## 4. Configure Terraform

1. Clone the [infra-legacy](https://github.com/Casa/infra-legacy/) repo.
1. Duplicate the following files and name them based on your microservice:
   - `node_example_lambda.tf`
   - `node_example_rds.tf`
   - `node_example_glue.tf`
   - `node_example_sg.tf`
1. Replace all references of "node example" in these files with equivalents of your microservice name as defined in `package.json`.
1. Update the `private_api_gateway_resources.tf` file by creating a section for your microservice mimicking the "Node Example" section.
1. Update the `private_api_gateway.tf` file by adding your microservice integration similar to how it is for "node_example".
1. Update the `datadog.tf` file by adding your microservice to the `cloudwatch_log_groups` similar to how it is for "node-example".
1. Create a PR with these changes for the Infra team to review and apply the updates.

<br />
<br />

## 5. Wrap up

Almost there! There are a few small steps left before you can start building.

1. Rename `README.template.md` to `README.md` to replace the existing one.
1. Commit and push all changes to GitHub.
1. Create the `staging` and `master` branch.
1. Apply branch protection settings for `develop`, `staging`, and `master`.

<br />
<br />

## Congrats 🎉

You are all done with the setup and are now good to start building!

<br />
<br />
