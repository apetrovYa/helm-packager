import { OperatingSystemAPI } from '../lib/operating_system_api';
import logger from '../app/logger';
/**
 * The HelmChartArtifact interface represents an abstraction for a Helm chart artifact.
 * Implementations of this interface are responsible for checking the existence
 * of specific Helm chart details.
 */
interface HelmChartArtifact {
    /**
     * Determines if the Helm chart artifact exists.
     * @returns {boolean} True if the artifact exists, false otherwise.
     */
    exists(): boolean;
}
/**
 * Checks for the existence of a .helmignore file in the working directory.
 */
class HelmIgnoreExists implements HelmChartArtifact {
    /**
     * Verifies the presence of the .helmignore file.
     * Logs an error and returns false if the file is missing.
     * @returns {boolean} True if the file exists, otherwise false.
     */
    exists(): boolean {
        if (!OperatingSystemAPI.fileExists(`${process.cwd()}/.helmignore`)) {
            logger.error(`${process.cwd()}/.helmignore missing ❌ `);
            return false;
        }
        return true;
    }
}
/**
 * Checks for the existence of a release.json file in the working directory.
 */
class ReleaseFileExists implements HelmChartArtifact {
    /**
     * Verifies the presence of the release.json file.
     * Logs an error and returns false if the file is missing.
     * @returns {boolean} True if the file exists, otherwise false.
     */
    exists(): boolean {
        if (!OperatingSystemAPI.fileExists(`${process.cwd()}/release.json`)) {
            logger.error(`${process.cwd()}/release.json missing ❌ `);
            return false;
        }
        return true;
    }
}
/**
 * Checks for the existence of a values.schema.json file in the working directory.
 */
class ValuesSchemaExists implements HelmChartArtifact {
    /**
     * Verifies the presence of the values.schema.json file.
     * Logs an error and returns false if the file is missing.
     * @returns {boolean} True if the file exists, otherwise false.
     */
    exists(): boolean {
        if (
            !OperatingSystemAPI.fileExists(
                `${process.cwd()}/values.schema.json`,
            )
        ) {
            logger.error(`${process.cwd()}/values.schema.json missing ❌ `);
            return false;
        }
        return true;
    }
}
/**
 * Checks for the existence of a values.yaml file in the working directory.
 */
class ValuesYamlExists implements HelmChartArtifact {
    /**
     * Verifies the presence of the values.yaml file.
     * Logs an error and returns false if the file is missing.
     * @returns {boolean} True if the file exists, otherwise false.
     */
    exists(): boolean {
        if (!OperatingSystemAPI.fileExists(`${process.cwd()}/values.yaml`)) {
            logger.error(`${process.cwd()}/values.yaml missing ❌ `);
            return false;
        }
        return true;
    }
}
/**
 * Checks for the existence of a README.md file in the working directory.
 */
class ReadmeExists implements HelmChartArtifact {
    /**
     * Verifies the presence of the README.md file.
     * Logs an error and returns false if the file is missing.
     * @returns {boolean} True if the file exists, otherwise false.
     */
    exists(): boolean {
        if (!OperatingSystemAPI.fileExists(`${process.cwd()}/README.md`)) {
            logger.error(`${process.cwd()}/README.md missing ❌ `);
            return false;
        }
        return true;
    }
}
/**
 * Composite class that combines multiple HelmChartArtifact checks.
 * This allows for a single exists() method call to validate the presence
 * of all required Helm chart artifacts.
 */
class HelmChartArtifactComposite implements HelmChartArtifact {
    private properties: HelmChartArtifact[];
    /**
     * Constructs the composite with an array of HelmChartArtifact instances.
     * @param {HelmChartArtifact[]} properties - The artifacts to be checked.
     */
    constructor(properties: HelmChartArtifact[]) {
        this.properties = properties;
    }
    /**
     * Checks the existence of all artifacts in the composite.
     * @returns {boolean} True if all artifacts exist, false otherwise.
     */
    exists(): boolean {
        return this.properties.every((property) => property.exists());
    }
}
/**
 * Builder class for creating a HelmChartArtifactComposite.
 * Follows the builder pattern to allow for fluent chaining of artifact additions.
 */
class HelmChartArtifactBuilder {
    private properties: HelmChartArtifact[] = [];
    /**
     * Adds a new HelmChartArtifact to the builder.
     * @param {HelmChartArtifact} property - The artifact to be added.
     * @returns {HelmChartArtifactBuilder} The builder instance for chaining.
     */
    public add(property: HelmChartArtifact): HelmChartArtifactBuilder {
        this.properties.push(property);
        return this;
    }
    /**
     * Creates and returns a `HelmChartArtifactComposite` with the artifacts added.
     * @returns {HelmChartArtifactComposite} The composite instance.
     * */
    public build(): HelmChartArtifactComposite {
        return new HelmChartArtifactComposite(this.properties);
    }
}

/**
 * `ReleaseStandardCheck` checks if the Helm chart contains all necessary artifacts.
 * */
export default class ReleaseStandardChecks {
    private properties: HelmChartArtifactComposite;
    /**
     * Initializes a new `HelmChartArtifactBuilder`, adds all necessary artifact checks, and builds the composite.
     * */
    constructor() {
        const builder = new HelmChartArtifactBuilder();
        builder
            .add(new HelmIgnoreExists())
            .add(new ReleaseFileExists())
            .add(new ValuesSchemaExists())
            .add(new ValuesYamlExists())
            .add(new ReadmeExists());
        this.properties = builder.build();
    }
    /**
     * Delegates the existence check to the `HelmChartArtifactComposite` instance.
     * returns {boolean} True if all artifacts exist, false otherwise.
     * */
    pass(): boolean {
        return this.properties.exists();
    }
}
