import { OperatingSystemAPI } from '../lib/operating_system_api';
/**
 * The Reader interface requires a scan method that reads data and returns a string.
 */
interface Reader {
    scan(): string;
}
/**
 * Custom error class for signaling that a configuration file was not found.
 */
export class ConfigurationFileNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationFileNotFoundError';
    }
}
/**
 * Custom error class for signaling that a configuration file is empty.
 */
class ReleaseConfigurationEmptyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ReleaseFileEmptyError';
    }
}
/**
 * `ConfigReader` class implements the Reader interface, providing the ability to read
 * the contents of a configuration file from a given file path.
 */
export class ConfigReader implements Reader {
    private readonly path: string;
    /**
     * Creates a new ConfigReader instance, throws an error if the file does not exist.
     * @param {string} filePath - The path to the configuration file to be read.
     * @throws {ConfigurationFileNotFoundError} - If the file at the specified path does not exist.
     */
    constructor(filePath: string) {
        if (OperatingSystemAPI.fileExists(filePath)) {
            this.path = filePath;
        } else {
            throw new ConfigurationFileNotFoundError(`${filePath} missing`);
        }
    }
    /**
     * Reads the content of the configuration file and returns it as a string.
     * @returns {string} The content of the configuration file.
     */
    public scan(): string {
        if (OperatingSystemAPI.fileExists(this.path)) {
            const value = OperatingSystemAPI.readFile(this.path);
            if (value.length > 0) {
                return value;
            } else {
                throw new ReleaseConfigurationEmptyError(
                    `${this.path} is empty`,
                );
            }
        }
        return '';
    }
}
