const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    config.optimization = {
      sideEffects: true,
      runtimeChunk: "single",
      minimize: true,
      minimizer: [],
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 200000,
        maxSize: 250000,
      },
    };

    return config;
  },
});
