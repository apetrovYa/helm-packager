import { Service } from 'typedi';
import ApplicationManifest from './manifest';
import figlet from 'figlet';

/**
 * The main application class.
 * This class is responsible for setting up all the commands such that the user can safely call the method run.
 */
@Service()
export default class App {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private program: any;
    private commands: any;
    private globalOptions: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /**
     * Constructs the `App` class with an application manifest.
     * @param {ApplicationManifest} manifest - The application manifest containing name, version, description,
     *                                         program instance, commands, and global options definitions.
     */
    constructor(public manifest: ApplicationManifest) {
        this.program = manifest.program;
        this.program.addHelpText('beforeAll', figlet.textSync(manifest.name));
        this.program
            .name(manifest.name)
            .version(
                manifest.version,
                '-v, --version',
                'Output the tool version',
            )
            .description(manifest.description);
        this.commands = manifest.commands;
        this.globalOptions = manifest.globalOptions;

        this.setupCommands();
        this.setupGlobalOptions();
    }

    /**
     * Initializes commands for the CLI program.
     */
    private setupCommands() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.commands.forEach((command: any) => {
            this.program
                .command(command.name, command.options)
                .description(command.description)
                .action(command.act);
        });
    }
    /**
     * Initializes global options for the CLI program.
     */
    private setupGlobalOptions() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.globalOptions.forEach((option: any) => {
            this.program.option(
                option.flags,
                option.description,
                option.defaultValue || '',
            );
        });
    }
    /**
     * Parses command-line arguments and triggers the appropriate command or action.
     */
    public run() {
        this.program.parse(process.argv);
    }
}
