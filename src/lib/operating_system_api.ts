import { execSync } from 'node:child_process';
import fs from 'fs';
import logger from '../app/logger';

function removeFromStringLines(data: string, pattern: string) {
    const lines = data.split('\n');
    const filteredLines = lines.filter((line) => !line.includes(pattern));
    return filteredLines.join('\n');
}

/**
 * The OperatingSystemAPI class provides static methods to perform operating system level operations.
 * It is used as a utility class.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OperatingSystemAPI {
    /**
     * Executes a shell command synchronously and silences the output.
     *
     * @param {string} command - The command to be executed in the shell.
     * @returns {boolean} - Returns true if the command was executed successfully, false if an error occurred.
     */
    public static executeSyncCommand(command: string): boolean {
        try {
            const nullDevice =
                process.platform === 'win32' ? 'NUL' : '/dev/null';
            const stdout = execSync(`${command} 2>${nullDevice} `);
            const output = removeFromStringLines(stdout.toString(), 'trim');
            logger.info(output);
            return true;
        } catch (error) {
            logger.info(`${error}`);
            return false;
        }
    }
    /**
     * Finds all files with a '.tgz' extension in the current directory.
     *
     * @returns {string[]} - An array of filenames ending with '.tgz'.
     */
    public static findTgzFile() {
        return fs
            .readdirSync('./')
            .filter((file: string) => file.endsWith('.tgz'));
    }
    /**
     * Checks whether a file exists at the specified file path.
     *
     * @param {string} filePath - The path to the file to check for existence.
     * @returns {boolean} - Returns true if the file exists, false otherwise.
     */
    public static fileExists(filePath: string) {
        return fs.existsSync(filePath);
    }
    /**
     * Reads the content of a file and returns it as a string.
     * @returns {string} The content of the configuration file.
     */
    public static readFile(filePath: string) {
        return fs.readFileSync(filePath, 'utf8');
    }
}
