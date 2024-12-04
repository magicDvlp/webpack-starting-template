module.exports = function (api) {
  api.cache(true);

  const config = {
    presets: [
      [
        "@babel/preset-env",
        {
          debug: false,
          useBuiltIns: "usage",
          corejs: "3.38.0",
        },
      ],
      ["@babel/preset-typescript"],
    ],
  };

  return config;
};
