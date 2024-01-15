import { Release } from './interfaces';
import { StandardReleaseFactory } from './release/standard';
/**
 * `ReleaseFactory` is a factory class responsible for creating `Release` objects.
 * It provides a static method `get` to instantiate and return a `Release` object based on the specified type.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ReleaseFactory {
    /**
     * Static method that creates and returns an instance of a `Release`.
     *
     * @param {string} type - The type of release to create. This parameter can be used
     *                        to extend the behavior of the factory to return different
     *                        subclasses of `Release` based on the type.
     * @param {string} file - The file name or path associated with the release, which
     *                        will be passed to the release's constructor or factory method.
     *
     * @returns {Release} An instance of a `Release` (or its subclass) based on the specified type.
     */
    static get(type: string, file: string): Release {
        // The `default` case is currently the only implementation, which utilizes
        // `StandardReleaseFactory.create` to instantiate a standard release.
        // This switch statement allows for future expansion to support multiple types.
        switch (type) {
            case 'standard':
                return StandardReleaseFactory.create(file);
            default:
                return StandardReleaseFactory.create(file);
        }
    }
}
