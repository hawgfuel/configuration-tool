module.exports = {
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-jest',
    // eslint-disable-next-line max-len
    '\\.(jpg|jpeg|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|webmanifest|xml)$':
        '<rootDir>/jest/fileTransformer.js',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
};
