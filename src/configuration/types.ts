/**
 * Represents the selector prefix for environment variables that define the credentials for a repository.
 */
type Environment = {
    nameSelector: string;
};
/**
 * Describes the structure of each repository object within the configuration.
 */
type Repository = {
    name: string;
    description?: string;
    url: string;
    type: string;
    env: Environment;
    notes?: string[];
};
/**
 * Represents the specification of all repositories.
 */
type Spec = {
    repositories: Repository[];
};
/**
 * Defines the metadata structure used in release specifications.
 */
type Metadata = {
    name: string;
    description: string;
};
/**
 * Describes the complete release specification including metadata and repository specifications.
 */
export type ReleaseSpecification = {
    metadata: Metadata;
    spec: Spec;
};
/**
 * `OCIHelmRepository` interacts with an OCI Helm repositories.
 */
export class OCIHelmRepository {
    private username: string;
    private password: string;
    private repository: Repository;
    /**
     * Constructs an instance of OCIHelmRepository.
     *
     * @param repository The repository configuration to use.
     */

    constructor(repository: Repository) {
        this.repository = repository;
        const envSelector = this.repository.env.nameSelector;
        // Retrieve username and password from environment variables or default to 'username' and 'password'.
        this.username = process.env[envSelector + '_USERNAME'] || 'username';
        this.password = process.env[envSelector + '_PASSWORD'] || 'password';
    }
    /**
     * Gets the username for the repository.
     *
     * @returns The username.
     */
    public getUsername() {
        return this.username;
    }
    /**
     * Gets the password for the repository.
     *
     * @returns The password.
     */
    public getPassword() {
        return this.password;
    }
    /**
     * Gets the URL for the repository.
     *
     * @returns The full URL of the repository.
     */
    public getUrl() {
        return `${this.repository.type}://${this.repository.url}`;
    }

    public getRegistryDomain() {
        const repositoryUrl = this.repository.url.replace(
            `${this.repository.type}://`,
            '',
        );
        return repositoryUrl.split('/')[0];
    }
}
/* eslint-disable no-prototype-builtins */
export class ReleaseSpecificationManifest {
    private data: ReleaseSpecification;

    constructor(spec: ReleaseSpecification) {
        this.data = spec;
    }

    public isValid() {
        return this.validateMetadata() && this.validateSpec();
    }

    private validateMetadata() {
        return (
            this.data.metadata.hasOwnProperty('name') &&
            this.data.metadata.hasOwnProperty('description')
        );
    }
    private validateRepository(repository: Repository): boolean {
        return (
            repository.hasOwnProperty('name') &&
            repository.hasOwnProperty('url') &&
            repository.hasOwnProperty('type') &&
            repository.hasOwnProperty('env') &&
            repository.env.hasOwnProperty('nameSelector')
        );
    }
    private validateSpec() {
        return this.data.spec.repositories.every((repository) =>
            this.validateRepository(repository),
        );
    }
    public getName() {
        return this.data.metadata.name;
    }
    public getDescription() {
        return this.data.metadata.description;
    }
    public getRepositories() {
        return this.data.spec.repositories;
    }
}
/* eslint-enable no-prototype-builtins */
