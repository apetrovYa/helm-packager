import { Release } from '../interfaces';
import {
    ContinuousIntegrationActions,
    PreparationActions,
    PublishingActions,
} from '../composite_commands/standard';
import { ReleaseActionsBuilder, ReleaseActionsContainer } from './actions';
import ApplicationConfigurationProvider from '../../configuration/provider';
/**
 * A factory class for creating instances of `StandardRelease`.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StandardReleaseFactory {
    /**
     * Creates an instance of `StandardRelease` with predefined actions.
     *
     * @param {string} configurationFile - The path to the configuration file for the release.
     * @returns {StandardRelease} An instance of `StandardRelease` with the necessary actions set up.
     */
    public static create(configurationFile: string): StandardRelease {
        const configurationProvider = new ApplicationConfigurationProvider(
            configurationFile,
        );

        const builder = new ReleaseActionsBuilder();
        builder.addAction(new PreparationActions());
        builder.addAction(new ContinuousIntegrationActions());
        builder.addAction(
            new PublishingActions(
                configurationProvider.getReleaseRepositories(),
            ),
        );
        const releaseActions = builder.build();

        return new StandardRelease(releaseActions);
    }
}

/**
 * A service class that represents a standard release process and implements the `Release` interface.
 */
export class StandardRelease implements Release {
    actions: ReleaseActionsContainer;
    /**
     * Constructs a `StandardRelease` with a container of release actions.
     *
     * @param {ReleaseActionsContainer} steps - The container with all the actions that make up the release.
     */
    constructor(steps: ReleaseActionsContainer) {
        this.actions = steps;
    }
    execute(): boolean {
        return this.actions.do();
    }
}
