import { ConfigReader } from './reader';
import { ParserFactory } from './parser';
import { ReleaseSpecificationManifest, OCIHelmRepository } from './types';
import { Service } from 'typedi';
/**
 * Custom error class representing errors that occur when the application configuration is not valid.
 */
export class ApplicationConfigurationNotValidError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApplicationConfigurationNotValidError';
        console.log('Example of a valid configuration file:');
        console.log(`
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
                  }
                ]
              }
            }
        `);
    }
}

/**
 * `ApplicationConfigurationProvider` class provides functionality to read and validate
 * the application's configuration file, and to retrieve various pieces of configuration data.
 */
@Service()
export default class ApplicationConfigurationProvider {
    spec: ReleaseSpecificationManifest;
    /**
     * Constructs an ApplicationConfigurationProvider instance.
     * It reads the configuration file, parses it, and validates the resulting ReleaseSpecificationManifest.
     * @param {string} filePath - The file path to the configuration file that needs to be read and parsed.
     * @throws {ApplicationConfigurationNotValidError} - If the parsed configuration is not valid.
     */
    constructor(filePath: string) {
        const parser = ParserFactory.getParser(filePath);
        const reader = new ConfigReader(filePath);
        this.spec = new ReleaseSpecificationManifest(
            parser.parse(reader.scan()),
        );

        if (!this.spec.isValid()) {
            throw new ApplicationConfigurationNotValidError(
                `${filePath} is not valid`,
            );
        }
    }
    /**
     * Retrieves the release name from the specification manifest.
     * @returns {string} The name of the release.
     */
    public getReleaseName(): string {
        return this.spec.getName();
    }
    /**
     * Retrieves the release description from the specification manifest.
     * @returns {string} The description of the release.
     */
    public getReleaseDescription(): string {
        return this.spec.getDescription();
    }
    /**
     * Retrieves the list of OCI Helm repositories from the specification manifest.
     * Each repository configuration is wrapped in an OCIHelmRepository instance.
     * @returns {OCIHelmRepository[]} An array of OCIHelmRepository instances.
     */
    public getReleaseRepositories(): OCIHelmRepository[] {
        return this.spec
            .getRepositories()
            .map((repo) => new OCIHelmRepository(repo));
    }
}
