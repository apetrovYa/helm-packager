/**
 * This file contains the application manifest which is used to define commands and options for the CLI.
 * This is the main configuration block. Add here new commands and options.
 */
import { Service } from 'typedi';
import { Command } from 'commander';
import ApplicationConfigurationProvider from '../configuration/provider';
import ReleaseStandardChecks from '../checker/controls';
import { HelmPackager } from '../packager/main';
import logger from './logger';
/**
 * The `ApplicationManifest` class holds the configuration for the command-line interface,
 * including all the commands, options, and the metadata associated with the application.
 * It uses the command pattern to encapsulate the information needed to perform actions
 * or trigger events in the application.
 */
@Service()
export default class ApplicationManifest {
    program = new Command();
    name = 'helm-packager';
    version = '1.0.0';
    description =
        'A command line utility to manufacture OCI formatted Helm charts';
    commands = [
        {
            name: 'release',
            options: {
                isDefault: false,
                hidden: false,
            },
            description: 'Execute the release',
            act: () => {
                const opts = this.program.opts();
                const packager = new HelmPackager(opts.config);
                if (!packager.execute()) {
                    logger.error(`Release failed ❌ `);
                    process.exit(1);
                }
                process.exit(0);
            },
        },
        {
            name: 'pre-release-checks',
            options: {
                isDefault: false,
                hidden: false,
            },
            description:
                'Verify if the content of the Helm chart is ready for release',
            act: () => {
                const opts = this.program.opts();
                process.chdir(`${process.cwd()}/${opts.chartLocation}`);
                const standardChecks = new ReleaseStandardChecks();

                if (!standardChecks.pass()) {
                    logger.error(`Helm chart is not ready ❌ `);
                    process.exit(1);
                }
                console.log(`Helm chart is ready ✅ `);
                process.exit(0);
            },
        },
        {
            name: 'validate',
            options: {
                isDefault: false,
                hidden: false,
            },
            description: 'Validate the release configuration file',
            act: () => {
                const opts = this.program.opts();
                const manifest = new ApplicationConfigurationProvider(
                    `${opts.config}`,
                );
                if (manifest.spec.isValid()) {
                    logger.info(
                        `Configuration file ${opts.config} is valid ✅ `,
                    );
                }
                process.exit(0);
            },
        },
    ];
    globalOptions = [
        {
            flags: '-c, --config [file]',
            description: 'Provide a release configuration file to use',
            defaultValue: 'release.json',
        },
        {
            flags: '-l, --chart-location [path]',
            description: 'Provide the path to the chart to be packaged',
            defaultValue: '.',
        },
    ];
}
