import { Command } from '../interfaces';
import {
    RemoveAnyExistingTgzFile,
    UpdateHelmDocs,
    UpdateHelmValuesSchema,
    LintHelmChart,
    RunHelmUnitTests,
    PackageHelmChart,
    UploadHelmChart,
} from '../commands/standard';
import { OCIHelmRepository } from '../../configuration/types';
import logger from '../../app/logger';
/**
 * Represents a sequence of commands to prepare for a release of the desired Helm Chart.
 */
export class PreparationActions implements Command {
    steps: Command[] = [];

    constructor() {
        this.steps.push(new RemoveAnyExistingTgzFile());
        this.steps.push(new UpdateHelmValuesSchema());
        this.steps.push(new UpdateHelmDocs());
    }
    /**
     * Executes all preparation steps in order.
     *
     * @returns {boolean} `true` if all steps executed successfully, `false` otherwise.
     */
    do(): boolean {
        logger.info(`Executing Preparation Actions`);
        return this.steps.every((step) => step.do());
    }
}
/**
 * Represents a sequence of commands to perform continuous integration checks on the desired Helm Chart.
 */
export class ContinuousIntegrationActions implements Command {
    steps: Command[] = [];

    constructor() {
        this.steps.push(new LintHelmChart());
        this.steps.push(new RunHelmUnitTests());
    }
    /**
     * Executes all continuous integration checks in order.
     *
     * @returns {boolean} `true` if all checks executed successfully, `false` otherwise.
     */
    do(): boolean {
        logger.info(`Executing Continuous Integration Checks`);
        return this.steps.every((step) => step.do());
    }
}
/**
 * Represents a sequence of commands to publish the Helm Chart.
 */
export class PublishingActions implements Command {
    steps: Command[] = [];
    constructor(repositories: OCIHelmRepository[]) {
        this.steps.push(new PackageHelmChart());
        this.steps.push(new UploadHelmChart(repositories));
    }
    /**
     * Executes all publishing steps in order.
     *
     * @returns {boolean} `true` if all steps executed successfully, `false` otherwise.
     */
    do(): boolean {
        logger.info(`Executing Publishing Actions`);
        return this.steps.every((step) => step.do());
    }
}
