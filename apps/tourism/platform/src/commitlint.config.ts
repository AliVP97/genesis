module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72], // Enforce 72 characters limit on the title
    'body-max-length': [2, 'always', 100], // Enforce 200 characters limit on the total body
    'body-max-line-length': [0], // Disable the default 100 characters per line limit
  },
};
