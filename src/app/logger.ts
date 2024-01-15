import pino from 'pino';
/**
 * The Logger class encapsulates the `pino` logger functionality.
 * It provides a simplified interface for logging with methods for various log levels.
 */
class Logger {
    private logger: pino.Logger;

    constructor() {
        this.logger = pino({
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                },
            },
        });
    }
    /**
     * Logs a message at the 'info' level.
     * @param {string} message - The message to log at the 'info' level.
     */
    public info(message: string): void {
        this.logger.info(message);
    }
    /**
     * Logs a message at the 'error' level.
     * @param {string} message - The message to log at the 'error' level.
     */
    public error(message: string): void {
        this.logger.error(message);
    }
    /**
     * Logs a message at the 'debug' level.
     * @param {string} message - The message to log at the 'debug' level.
     */
    public debug(message: string): void {
        this.logger.debug(message);
    }
    /**
     * Logs a message at the 'warn' level.
     * @param {string} message - The message to log at the 'warn' level.
     */
    public warn(message: string): void {
        this.logger.warn(message);
    }
}

export default new Logger();
