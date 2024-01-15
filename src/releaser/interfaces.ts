/**
 * Represents the contract for all commands used in a release process.
 * Each command should implement the `do` method that performs an action and returns a boolean.
 */
export interface Command {
    /**
     * Executes the command's action.
     *
     * @returns {boolean} A boolean value representing the success (`true`) or failure (`false`) of the command.
     */
    do(): boolean;
}

/**
 * Represents the contract for a release.
 * Each release should implement the `execute` method that triggers the release process and returns a boolean.
 */
export interface Release {
    /**
     * Executes the release process.
     *
     * @returns {boolean} A boolean value representing the success (`true`) or failure (`false`) of the release execution.
     */
    execute(): boolean;
}
