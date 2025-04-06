import * as util from 'node:util';

export class StringUtils {
    /**
     * Convert variables to string
     * @param obj
     */
    static toString(obj: unknown): string {
        switch (typeof obj) {
            default:
                return String(obj);
            case 'object':
                try {
                    return JSON.stringify(obj);
                } catch {
                    return util.inspect(obj, { depth: null });
                }
        }
    }

    /**
     * Checks if a string is blank (after trimming whitespace)
     * @param {string} str - The string to check
     * @returns {boolean} - Returns true if the string is blank, otherwise false
     */
    static isBlank(str: string): boolean {
        return str === null || str === undefined || str.trim().length === 0;
    }

    /**
     * Checks if a string is not blank (after trimming whitespace)
     * @param {string} str - The string to check
     * @returns {boolean} - Returns true if the string is not blank, otherwise false
     */
    static isNotBlank(str: string): boolean {
        return !this.isBlank(str);
    }

    /**
     * Converts a string to uppercase
     * @param {string} str - The string to convert
     * @returns {string} - The uppercase string
     */
    static upperCase(str: string): string {
        if (this.isBlank(str)) {
            return str;
        }
        return str.toUpperCase();
    }

    /**
     * Converts a string to lowercase
     * @param {string} str - The string to convert
     * @returns {string} - The lowercase string
     */
    static lowerCase(str: string): string {
        if (this.isBlank(str)) {
            return str;
        }
        return str.toLowerCase();
    }

    /**
     * Capitalizes the first letter of a string
     * @param {string} str - The string to capitalize
     * @returns {string} - The capitalized string
     */
    static capitalize(str: string): string {
        if (this.isBlank(str)) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Checks if a string contains a substring
     * @param {string} str - The original string
     * @param {string} search - The substring to search for
     * @returns {boolean} - Returns true if the string contains the substring, otherwise false
     */
    static contains(str: string, search: string): boolean {
        if (this.isBlank(str) || this.isBlank(search)) {
            return false;
        }
        return str.includes(search);
    }

    /**
     * Reverses a string
     * @param {string} str - The string to reverse
     * @returns {string} - The reversed string
     */
    static reverse(str: string): string {
        if (this.isBlank(str)) {
            return str;
        }
        return str.split('').reverse().join('');
    }

    /**
     * Checks if a string starts with a given substring
     * @param {string} str - The original string
     * @param {string} prefix - The substring to check
     * @returns {boolean} - Returns true if the string starts with the substring, otherwise false
     */
    static startsWith(str: string, prefix: string): boolean {
        if (this.isBlank(str) || this.isBlank(prefix)) {
            return false;
        }
        return str.startsWith(prefix);
    }

    /**
     * Checks if a string ends with a given substring
     * @param {string} str - The original string
     * @param {string} suffix - The substring to check
     * @returns {boolean} - Returns true if the string ends with the substring, otherwise false
     */
    static endsWith(str: string, suffix: string): boolean {
        if (this.isBlank(str) || this.isBlank(suffix)) {
            return false;
        }
        return str.endsWith(suffix);
    }

    /**
     * Converts null or undefined to a default string
     * @param {string} str - The original string
     * @param {string} [defaultStr=''] - The default string if the original string is null or undefined
     * @returns {string} - The converted string
     */
    static defaultString(str: string, defaultStr: string = ''): string {
        return str === null || str === undefined ? defaultStr : str;
    }

    /**
     * Trims whitespace from both ends of a string
     * @param {string} str - The original string
     * @returns {string} - The trimmed string
     */
    static trim(str: string): string {
        if (this.isBlank(str)) {
            return str;
        }
        return str.trim();
    }
}
