const path = require('path');

module.exports = {
  preset: path.join(__dirname, 'node_modules', 'jest-expo'),
  testMatch: ['**/src/components/**/*.test.tsx'],
};

