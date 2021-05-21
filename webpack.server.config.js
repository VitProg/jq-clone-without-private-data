const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript').default;
const dotenv = require('dotenv');

const isDevelopment = process.env.NODE_ENV !== 'production'

dotenv.config({
  path: '.env'
});

console.log('Mode: ', isDevelopment ? 'development' : 'production');

module.exports = function(options) {
  return {
    ...(options ? options : {}),
      plugins: [
       ...(options && options.plugins ? options.plugins : []),
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'development',
          FORUM_AVATAR_BASE_URL: '',
          FORUM_GALLERY_BASE_URL: '',
          FORUM_ATTACHMENTS_BASE_URL: '',
          FORUM_USER_LINK_PATTERN: '',
          FORUM_DEFAULT_AVATAR: '',
          SEO_BASE_TITLE: '',
          SEO_BASE_DESCRIPTION: '',
          SEO_BASE_KEYWORDS: '',
          FORUM_MESSAGE_PAGE_SIZE: '',
          FORUM_TOPIC_PAGE_SIZE: '',
          FORUM_USER_PAGE_SIZE: '',
        }),
        new webpack.DefinePlugin({
          PRODUCTION: JSON.stringify(!isDevelopment),
          DEVELOPMENT: JSON.stringify(isDevelopment),
        })
      ].filter(Boolean),
  }
};
