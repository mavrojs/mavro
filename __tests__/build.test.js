const { execSync } = require('child_process');

test('should build the mavro successfully', () => {
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    throw new Error('Build failed');
  }
});
