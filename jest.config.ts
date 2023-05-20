import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { Config } from 'jest';

const COVERAGE_FILE_SUFFIX = [
  'service',
  'controller',
  'handler',
  'util',
  'provider',
  'schema',
  'guard',
  'validation',
  'interceptor',
  'middleware',
];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default async (): Promise<Config> => {
  return {
    rootDir: '.',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [`**/*.(${COVERAGE_FILE_SUFFIX.join('|')}).ts`],
    coverageDirectory: './coverage',
    // setupFilesAfterEnv: ['<rootDir>/test/env.setup.js'],
    testEnvironment: 'node',
    // Helps to use aliases in tsconfig (@module/*)
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
  };
};
