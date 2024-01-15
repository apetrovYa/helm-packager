import { ReleaseSpecification } from './types';
import * as YAML from 'js-yaml';
import path from 'path';
/**
 * The Parser interface declares a parse method that must be implemented to
 * return a ReleaseSpecification object from a string input.
 */
export interface Parser {
    parse(content: string): ReleaseSpecification;
}

/**
 * Custom error class for signaling that the release configuration JSON object is empty.
 */
class EmptyJSONError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmptyJSONError';
    }
}
/**
 * The JsonParser class implements the Parser interface for JSON content.
 */
export class JsonParser implements Parser {
    /**
     * Parses a JSON string to a ReleaseSpecification object.
     * @param {string} content - The JSON string to be parsed.
     * @returns {ReleaseSpecification} - The resulting ReleaseSpecification object.
     */
    parse(content: string): ReleaseSpecification {
        const jsonObject = JSON.parse(content);
        if (Object.keys(jsonObject).length === 0) {
            throw new EmptyJSONError(
                'The provided input for the release configuration is an empty JSON object',
            );
        }
        return jsonObject;
    }
}
/**
 * The YamlParser class implements the Parser interface for YAML content.
 */
export class YamlParser implements Parser {
    /**
     * Parses a YAML string to a ReleaseSpecification object.
     * @param {string} content - The YAML string to be parsed.
     * @returns {ReleaseSpecification} - The resulting ReleaseSpecification object.
     */
    parse(content: string): ReleaseSpecification {
        return <ReleaseSpecification>YAML.load(content);
    }
}
/**
 * The UnsupportedFormatError class extends the JavaScript Error object to
 * provide error instances specifically related to unsupported file formats
 * for parsing.
 */
class UnsupportedFormatError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnsupportedFormatError';
    }
}
/**
 * `ParserFactory` class provides a static method to get a parser instance
 * based on the file extension of the provided file path.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ParserFactory {
    /**
     * Gets a Parser instance suitable for the given file extension.
     * @param {string} filePath - The path of the file to determine the parser for.
     * @returns {Parser} - An instance of a Parser suitable for the file format.
     * @throws {UnsupportedFormatError} - Throws if the file format is not supported.
     */
    public static getParser(filePath: string): Parser {
        const format = path.extname(filePath).toLowerCase();
        switch (format) {
            case '.json':
                return new JsonParser();
            case '.yaml' || '.yml':
                return new YamlParser();
            default:
                throw new UnsupportedFormatError(
                    `Unsupported format ${format}`,
                );
        }
    }
}
