
// Suppress console warnings globally
if (process.env.NODE_ENV === 'development') {
  console.warn = () => {};
}

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};


// // // Suppress console warnings globally
// // if (process.env.NODE_ENV === 'development') {
// //   console.warn = () => {};
// // }

// // module.exports = {
// //   webpack: (config, { webpack }) => {
// //     config.plugins.push(new webpack.EnvironmentPlugin(process.env));

// //     config.experiments = {
// //       asyncWebAssembly: true,
// //     };

// //     return config;
// //   },
// //   async rewrites() {
// //     return [
// //       {
// //         source: '/api/:path*',
// //         destination: '/api/:path*',
// //       },
// //     ];
// //   },
// // };
// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	reactStrictMode: true,
// 	webpack: function (config, options) {
// 	  config.experiments = {
// 		asyncWebAssembly: true,
// 	  };
// 	  return config;
// 	},
//   };
//   module.exports = nextConfig;
  