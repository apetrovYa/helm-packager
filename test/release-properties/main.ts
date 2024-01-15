import ReleaseStandardCheck from '../../src/checker/controls';
describe('Tests for the assurance of a Helm chart', () => {
    describe('Integration | Release Standard Checks', () => {
        it('the helm chart is not ready because of missing artifacts', () => {
            const standardChecks = new ReleaseStandardCheck();
            expect(standardChecks.pass()).toBeFalsy();
        })
        it('the helm chart is ready because all the necessary artifacts are present', () => {
            process.chdir('test/release-properties/necessary-files');
            const standardChecks = new ReleaseStandardCheck();
            expect(standardChecks.pass()).toBeTruthy();
        })
    })
})