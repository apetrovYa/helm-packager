import { OperatingSystemAPI } from '../../src/lib/operating_system_api';

import {
    LintHelmChart, PackageHelmChart,
    RemoveAnyExistingTgzFile,
    RunHelmUnitTests,
    UpdateHelmDocs,
    UpdateHelmValuesSchema, UploadHelmChart,
} from '../../src/releaser/commands/standard';
import { OCIHelmRepository } from '../../src/configuration/types';

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe('Helm chart related commands', () => {
    describe('Unit | RemoveAnyExistingTgzFile', () => {

        it('not able to remove the archive because there is no one generated yet', () => {
            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const findTgzFileSpy = jest.spyOn(OperatingSystemAPI, 'findTgzFile');
            findTgzFileSpy.mockImplementation(() => ['helm-chart.tgz']);

            const action = new RemoveAnyExistingTgzFile();

            const result = action.do();

            expect(executeSyncCommandSpy).toHaveBeenCalledWith('rm helm-chart.tgz');
        })
    })

    describe('Unit | UpdateHelmDocs', () => {

        it('not able to update the helm docs because readme-generator tool is not installed', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new UpdateHelmDocs();

            const result = action.do();

            expect(result).toBe(false);
        })
    })

    describe('Unit | UpdateHelmValuesSchema', () => {

        it('not able to update the schema file of the values.yaml because the schema-gen plugin is not installed', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new UpdateHelmValuesSchema();

            const result = action.do();

            expect(result).toBe(false);
            expect(executeSyncCommandSpy).toHaveBeenCalledWith('helm schema -input values.yaml -output values.schema.json');
        })
    })

    describe('Unit | RunHelmUnitTests', () => {

        it('not able to run the unit tests of the Helm chart because the unittest plugin is not installed', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new RunHelmUnitTests();

            const result = action.do();

            expect(result).toBe(false);
            expect(executeSyncCommandSpy).toHaveBeenCalledWith('helm unittest -f \"tests/*/*.yaml\" .');
        })
    })

    describe('Unit | LintHelmChart', () => {

        it('not able to lint the Helm chart because the schema.values.yaml is missing', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new LintHelmChart();

            const result = action.do();

            expect(result).toBe(false);
            expect(executeSyncCommandSpy).toHaveBeenCalledWith('helm lint');
        })
    })

    describe('Unit | PackageHelmChart', () => {

        it('not able to package the Helm chart because of an issue with Helm tool', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new PackageHelmChart();

            const result = action.do();

            expect(result).toBe(false);
            expect(executeSyncCommandSpy).toHaveBeenCalledWith('helm package .');
        })
    })

    describe('Unit | UploadHelmChart', () => {

        it('not able to upload a Helm chart because there is no OCIHelmRepository configuration given', () => {

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand');
            executeSyncCommandSpy.mockImplementation(() => false );

            const action = new UploadHelmChart([]);

            const result = action.do();

            expect(result).toBe(false);
        })

        it('not able to upload a Helm chart because cannot login into the Helm registry', () => {
            process.chdir("test/helm-commands/chart");

            const executeSyncCommandSpy = jest.spyOn(OperatingSystemAPI, 'executeSyncCommand').mockImplementation(() => false );
            const findTgzFileSpy = jest.spyOn(OperatingSystemAPI, 'findTgzFile').mockImplementation(() => [] );

            const repos = [];
            const repo = new OCIHelmRepository({
                "name": "test-chart",
                "url": "registry.tld.io",
                "type": "oci",
                "env": {
                    "nameSelector": "HELM_CHART"
                }
            })
            repos.push(repo)

            const action = new UploadHelmChart(repos);
            const username = repo.getUsername();
            const password = repo.getPassword();

            const result = action.do();

            expect(result).toBe(false);
            expect(username).toMatch("username");
            expect(password).toMatch("password");
        })

    })
})