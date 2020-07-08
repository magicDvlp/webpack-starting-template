module.exports = function(api) {
  api.cache(true);

  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          'debug': false,
          'useBuiltIns': 'usage',
          'corejs': '3.4.1',
        },
      ],
      // "@babel/preset-react"
    ],
    // ignore: ["/core-js/"],
  };

  return config;
};
