import { Command } from '../interfaces';
import logger from '../../app/logger';
/**
 * A builder class for constructing a sequence of release actions (commands).
 */
export class ReleaseActionsBuilder {
    private steps: Command[] = [];
    /**
     * Adds a command to the sequence of actions.
     *
     * @param {Command} c - The command to add to the builder's action sequence.
     * @returns {ReleaseActionsBuilder} The instance of the builder for chaining.
     */
    addAction(c: Command): ReleaseActionsBuilder {
        this.steps.push(c);
        return this;
    }
    /**
     * Finalizes the sequence of actions and constructs the `ReleaseActionsContainer` that contains them.
     *
     * @returns {ReleaseActionsContainer} The container with the sequence of configured commands.
     */
    build(): ReleaseActionsContainer {
        return new ReleaseActionsContainer(this.steps);
    }
}
/**
 * A container class implementing the `Command` interface that is responsible for executing
 * a sequence of commands as part of a release action.
 */
export class ReleaseActionsContainer implements Command {
    private steps: Command[] = [];
    /**
     * Creates an instance of `ReleaseActionsContainer` with a provided sequence of commands.
     *
     * @param {Command[]} actions - The array of commands to be executed.
     */
    constructor(actions: Command[]) {
        this.steps = actions;
    }
    /**
     * Executes each command in the sequence in order.
     * If any command returns `false`, it stops the execution of the subsequent commands.
     *
     * @returns {boolean} `true` if all commands execute successfully, `false` otherwise.
     */
    do(): boolean {
        logger.info(`Executing Release Actions`);
        // Use `every` to ensure that if any command returns `false`, the rest are not executed.
        return this.steps.every((step) => step.do());
    }
}
