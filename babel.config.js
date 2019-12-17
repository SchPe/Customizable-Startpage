module.exports = function (api) {
    api.cache(true);
    const presets = [
      [
        '@babel/preset-env',
        {
          modules: "auto",
          useBuiltIns: 'usage'
        }
      ]
    ];
    const plugins= [];
    return {
      presets,
      plugins
    }
}