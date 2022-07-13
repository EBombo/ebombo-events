const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    /**
    if (isProd)
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
    **/

    return config;
  },
  async headers() {
    return [
      {
        source: "/:all*(jpg|jpeg|gif|png|svg|ico)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:all*(eot|otf|ttf|ttc|woff|font.css)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:all*(js|css|json)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/terms",
        destination: isProd
          ? "https://storage.googleapis.com/ebombo-events.appspot.com/resources/terms-conditions-ebombo.pdf"
          : "https://storage.googleapis.com/ebombo-events-dev.appspot.com/resources/terms-conditions-ebombo.pdf",
      },
      {
        source: "/privacypolicy",
        destination: isProd
          ? "https://storage.googleapis.com/ebombo-events.appspot.com/resources/privacy-policy-ebombo.pdf"
          : "https://storage.googleapis.com/ebombo-events-dev.appspot.com/resources/privacy-policy-ebombo.pdf",
      },
    ];
  },
});
