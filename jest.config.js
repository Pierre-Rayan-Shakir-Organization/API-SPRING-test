module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}', // Inclure tous les fichiers TypeScript
        '!src/**/*.d.ts',   // Exclure les définitions de type
        '!src/**/index.ts', // Facultatif : exclure les fichiers d'index
    ],
    coverageDirectory: 'coverage', // Répertoire où Jest place les fichiers de couverture
};
