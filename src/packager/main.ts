import { Release } from '../releaser/interfaces';
import { ReleaseFactory } from '../releaser/releaser';

/**
 * The `HelmPackager` class is responsible for creating a Helm chart package.
 * It utilizes a factory pattern to obtain a `Release` object based on the type
 * of release specified. This release object encapsulates the details required
 * to package the Helm chart.
 */
export class HelmPackager {
    private release: Release;
    /**
     * Constructs a `HelmPackager` instance by obtaining a `Release` object
     * from the `ReleaseFactory`.
     *
     * @param {string} configurationFile - The path to the configuration file
     *         that contains the details necessary for generating the Release object.
     * @param {string} [releaseType='standard'] - The type of release to be obtained,
     *         which corresponds to the method of release the user intends to use.
     *         Defaults to 'standard' if not specified.
     */
    constructor(configurationFile: string, releaseType: string = 'standard') {
        this.release = ReleaseFactory.get(releaseType, configurationFile);
    }

    execute(): boolean {
        return this.release.execute();
    }
}
