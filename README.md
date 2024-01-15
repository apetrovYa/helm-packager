# Helm Packager

---

<img title="Product Logo" alt="The logo depicts that it does all the activities that are necessary for the release of Helm charts" src="docs/files/logo.jpg" style="border-radius: 600px; width: 50%; height: auto;">

A unified tool for the management of release tasks for Helm Charts.

-   Validate the Helm Chart and outlines what needs to be fixed before packaging;
-   Generate the README.md file for the Helm Chart from an annotated values.yaml file;
-   Package the Helm Chart;
-   Upload the Helm Chart to one or more OCI Helm Chart Repository based on a JSON specification.

---

## How it works

The tool expects to receive in input a valid `release.json` file and a chart. The configuration file contains the
information about the Helm Chart and where to push it. The chart is available for the tool on the file system.

## Example release.json file

```json
{
    "metadata": {
        "name": "a-chart",
        "description": "A chart for an application"
    },
    "spec": {
        "repositories": [
            {
                "name": "development-library",
                "description": "A Helm repository for development purposes",
                "url": "oci://registry.tld.com/dev-library",
                "type": "oci",
                "env": {
                    "nameSelector": "HELM_CHARTS_DEV_LIBRARY_REGISTRY_"
                },
                "notes": [
                    "[ENVIRONMENT VARIABLES] The following suffixes are required USERNAME and PASSWORD"
                ]
            },
            {
                "name": "stable-library",
                "url": "oci://registry.tld.com/stable-library",
                "type": "oci",
                "env": {
                    "nameSelector": "HELM_CHARTS_STABLE_LIBRARY_REGISTRY_"
                }
            }
        ]
    }
}
```

## Requirements

The tool is built on top of Node.js, and it is required at least version v20.9.0.

The following software dependencies are required to be already installed on the system:

-   [helm] - https://helm.sh/docs/intro/install/;
-   [helm unit testing plugin] - `helm plugin install https://github.com/helm-unittest/helm-unittest.git --version 0.3.6`;
-   [helm schema plugin] - `helm plugin install https://github.com/losisin/helm-values-schema-json.git --version 1.1.0`;
-   [helm s3 plugin] - `helm plugin install https://github.com/hypnoglow/helm-s3.git --version 0.13.0`.

## Installation

Execute the following commands to install the tool

1. `git clone git@github.com:apetrovYa/docker-helm-packager.git`;
2. `npm run global-local-install`.

## Docker

The tool is also available as a Docker image. The image is available on the Quay Container Registry.
Ref: https://quay.io/repository/andov_go/helm-packager .

### Usage instruction

Assuming that:

1. `PWD` environment variable points at the current working directory where the chart is located;
2. `.env` file contains the environment variables required by the tool.

then

```bash
docker run -it \
  -v "$PWD:/app/chart:rw" \
  --env-file .env quay.io/andov_go/helm-packager:latest \
  -h
```

The command will print the help message. This will allow you to understand how to quickly start using the tool.
Make sure to use the [release.json](./release.json) configuration file as a starting point for the definition
of the release configuration.

For the latest container version checkout the [Quay Container Registry](https://quay.io/repository/andov_go/helm-packager?tab=tags).

## Test

[Jest](https://jestjs.io/) is the main framework in use for testing. To execute tests run
the `npm run test` command.

## Lint and Format

The tool uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to lint and format the code.

To execute the linting the `npm run lint` command. To execute the formatting the `npm run format` command.

## Usage

```
 _          _                                  _
 | |__   ___| |_ __ ___        _ __   __ _  ___| | ____ _  __ _  ___ _ __
 | '_ \ / _ \ | '_ ` _ \ _____| '_ \ / _` |/ __| |/ / _` |/ _` |/ _ \ '__|
 | | | |  __/ | | | | | |_____| |_) | (_| | (__|   < (_| | (_| |  __/ |
 |_| |_|\___|_|_| |_| |_|     | .__/ \__,_|\___|_|\_\__,_|\__, |\___|_|
                              |_|                         |___/
Usage: helm-packager [options] [command]

A command line utility to manufacture OCI formatted Helm charts

Options:
  -v, --version                Output the tool version
  -c, --config [file]          Provide a release configuration file to use (default: "release.json")
  -l, --chart-location [path]  Provide the path to the chart to be packaged (default: ".")
  -h, --help                   display help for command

Commands:
  release                      Execute the release
  pre-release-checks           Verify if the content of the Helm chart is ready for release
  validate                     Validate the release configuration file
  help [command]               display help for command
```

## Licence

Licensed under the Apache License, Version 2.0 (the "License").

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
language governing permissions and limitations under the License.
