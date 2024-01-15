import assert = require("node:assert");
import { Parser, JsonParser} from '../../src/configuration/parser';
import { OCIHelmRepository, ReleaseSpecification, ReleaseSpecificationManifest } from '../../src/configuration/types';
import ApplicationConfigurationProvider from "../../src/configuration/provider";
import {ConfigReader} from "../../src/configuration/reader";

const data1 = `
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
`

const data2 = `
{
  "metadata": {
    "description": "A chart for an application"
  },
  "spec": {
    "repositories": []
  }
}
`

describe('Tests for the processing of the release configuration file', () => {
    describe('Unit | Parser', () => {
        it('able to detect a valid input', () => {
            const parser : Parser = new JsonParser();
            const specValidator = new ReleaseSpecificationManifest(parser.parse(data1));
            assert(specValidator.isValid());
        })
        it('able to detect a not valid input', () =>{
            const parser : Parser = new JsonParser();
            const data: ReleaseSpecification = parser.parse(data2);
            const specValidator = new ReleaseSpecificationManifest(parser.parse(data2));
            assert(!specValidator.isValid());
        })
    })

    describe('Unit | Reader', () => {
            process.chdir('test/configuration')
            it('launches an exception', () => {
                expect(() => {
                    new ConfigReader('missing.json');
                }).toThrow('missing.json missing');
            })
            it('able to read a release specification file from disk', () => {
                expect(() => {
                    new ConfigReader('release.json').scan();
                }).not.toThrow()
            })
            it('throws a custom error when the release specification file is empty', () => {
                expect(() => {
                    new ConfigReader('release-empty.json').scan();
                }).toThrow()
            })
            it('throws a custom error when the release specification file is an empty JSON document', () => {
                expect(() => {
                    new JsonParser().parse(new ConfigReader('release-empty-json-file.json').scan());
                }).toThrow()
            })
    })

    describe('Unit | OCIHelmRepository', () => {
        it('does not fail if the URL of the repo contains another protocol', () => {
            let conf = {
                name: "test",
                    description: "test",
                    url: "s3://registry.tld.com/dev-library",
                    type: "oci",
                    env: {
                    nameSelector: "HELM_CHARTS_DEV_LIBRARY_REGISTRY_"
                }}
            let repo = new OCIHelmRepository(conf);
            expect(() => {
                repo.getUrl()
            }).not.toEqual(conf.url);
        })
        it('reads environment variables from the context, uses defaults if no environment variable set', () => {
            let conf = {
                name: "test",
                description: "test",
                url: "registry.tld.com/dev-library",
                type: "oci",
                env: {
                    nameSelector: "HELM_CHARTS_DEV_LIBRARY_REGISTRY"
                }}
            let repo = new OCIHelmRepository(conf);
            expect(repo.getUsername()).toEqual('username');
            expect(repo.getPassword()).toEqual('password');
        })
        it('reads environment variables from the context', () => {
            process.env.HELM_CHARTS_DEV_LIBRARY_REGISTRY_USERNAME = 'ci+bot';
            process.env.HELM_CHARTS_DEV_LIBRARY_REGISTRY_PASSWORD = 'asdafajfniueq819210381adafaefr213523rqwdasgt';
            let conf = {
                name: "test",
                description: "test",
                url: "registry.tld.com/dev-library",
                type: "oci",
                env: {
                    nameSelector: "HELM_CHARTS_DEV_LIBRARY_REGISTRY"
                }}

            let repo = new OCIHelmRepository(conf);
            expect(repo.getUsername()).toEqual(process.env["HELM_CHARTS_DEV_LIBRARY_REGISTRY_USERNAME"]);
            expect(repo.getPassword()).toEqual(process.env["HELM_CHARTS_DEV_LIBRARY_REGISTRY_PASSWORD"]);
        })
    })

    describe('Integration | Module', () => {
        it('able to generate a runtime model from the spec', () => {
            expect(() => {
                new ApplicationConfigurationProvider("release.json")
            }).not.toThrow();
        })
        it('able to throw an exception when the configuration input is missing', () => {
            expect(() => {
                new ApplicationConfigurationProvider("not-valid-release.json")
            }).toThrow();
        })
        it('able to return the name of the release', () => {
            const manifest = new ApplicationConfigurationProvider("release.json");
            expect(manifest.getReleaseName()).toEqual('a-chart');
        })
        it('able to return the description of the release', () => {
            const manifest = new ApplicationConfigurationProvider("release.json");
            expect(manifest.getReleaseDescription()).toEqual('A chart for an application');
        })
        it('able to return the repositories that are linked with the release', () => {
            const manifest = new ApplicationConfigurationProvider("release.json");
            expect(manifest.getReleaseRepositories().length).toEqual(2);
        })
    })
})