import { OperatingSystemAPI } from '../../lib/operating_system_api';
import { Command } from '../interfaces';
import { OCIHelmRepository } from '../../configuration/types';
import logger from '../../app/logger';
/**
 * Implements the Command interface for removing any existing '.tgz' files in the current directory.
 */
export class RemoveAnyExistingTgzFile implements Command {
    /**
     * Executes the removal command for the first '.tgz' file found.
     * @returns {boolean} - True if the file was successfully removed, false if no files were found or the removal failed.
     */
    do(): boolean {
        const files = OperatingSystemAPI.findTgzFile();
        if (files.length > 0) {
            const file = files[0];
            return OperatingSystemAPI.executeSyncCommand(`rm ${file}`);
        }
        return true;
    }
}
/**
 * Implements the Command interface for updating Helm documentation.
 */
export class UpdateHelmDocs implements Command {
    /**
     * Generates Helm documentation using a readme generator.
     * @returns {boolean} - True if the documentation was successfully generated, false otherwise.
     */
    do(): boolean {
        logger.info(`Generating Helm docs`);
        return OperatingSystemAPI.executeSyncCommand(
            'readme-generator -v values.yaml -r README.md -s values.schema.json',
        );
    }
}
/**
 * Implements the Command interface for generating a JSON schema for Helm chart values.
 */
export class UpdateHelmValuesSchema implements Command {
    /**
     * Generates a JSON schema for 'values.yaml'.
     * @returns {boolean} - True if the schema was successfully generated, false otherwise.
     */
    do(): boolean {
        logger.info(`Generating JSON schema for values.yaml`);
        return OperatingSystemAPI.executeSyncCommand(
            'helm schema -input values.yaml -output values.schema.json',
        );
    }
}
/**
 * Implements the Command interface for running Helm unit tests.
 */
export class RunHelmUnitTests implements Command {
    /**
     * Executes Helm unit tests.
     * @returns {boolean} - True if the tests were successfully executed, false otherwise.
     */
    do(): boolean {
        logger.info(`Running Helm unit tests`);
        return OperatingSystemAPI.executeSyncCommand(
            'helm unittest -f "tests/*/*.yaml" .',
        );
    }
}
/**
 * Implements the Command interface for linting a Helm chart.
 */
export class LintHelmChart implements Command {
    /**
     * Lints the Helm chart to verify its quality.
     * @returns {boolean} - True if linting was successful, false otherwise.
     */
    do(): boolean {
        logger.info(`Linting Helm chart`);
        return OperatingSystemAPI.executeSyncCommand('helm lint');
    }
}
/**
 * Implements the Command interface for packaging a Helm chart.
 */
export class PackageHelmChart implements Command {
    /**
     * Packages the Helm chart into a '.tgz' file.
     * @returns {boolean} - True if the chart was successfully packaged, false otherwise.
     */
    do(): boolean {
        logger.info(`Packaging Helm chart`);
        return OperatingSystemAPI.executeSyncCommand('helm package .');
    }
}

/**
 * Implements the Command interface for uploading a Helm chart to one or more OCI repositories.
 */
export class UploadHelmChart implements Command {
    repos: OCIHelmRepository[];
    constructor(repositories: OCIHelmRepository[]) {
        this.repos = repositories;
    }
    /**
     * Uploads the Helm chart to configured OCI repositories.
     * @returns {boolean} - True if the chart was successfully uploaded to all repositories, false otherwise.
     */
    do(): boolean {
        logger.info(`Uploading Helm chart`);
        if (this.repos.length === 0) {
            logger.error(`No repositories were configured to push to`);
            return false;
        }

        let allSucceeded = true;

        for (const repo of this.repos) {
            const loggedIn = OperatingSystemAPI.executeSyncCommand(
                `helm registry login --username ${repo.getUsername()} --password ${repo.getPassword()} ${repo.getRegistryDomain()}`,
            );
            if (!loggedIn) {
                logger.error(
                    `Failed to log in to registry: ${repo.getRegistryDomain()}`,
                );
                allSucceeded = false;
                continue; // Skip pushing if login failed
            }

            const files = OperatingSystemAPI.findTgzFile();
            let file;
            if (!files.length) {
                logger.error(`No .tgz file found to push`);
                allSucceeded = false;
                continue; // Skip pushing if no file found
            } else {
                file = files[0]; // If multiple files found, push the first one
            }
            const pushed = OperatingSystemAPI.executeSyncCommand(
                `helm push ${file} ${repo.getUrl()}`,
            );
            if (!pushed) {
                logger.error(`Failed to push to: ${repo.getUrl()}`);
                allSucceeded = false;
            }
        }

        return allSucceeded;
    }
}
