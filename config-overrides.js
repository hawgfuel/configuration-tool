module.exports = (config, env) => {

 // Disable file chunking
 config.optimization.runtimeChunk = false;
 config.optimization.splitChunks = {
   cacheGroups: {
     default: false,
   },
 };

 // Change js output to remove hash from filename
 config.output.filename = 'static/js/[name].js';
 
 // Change css output to remove hash from file name
 config.plugins[5].options.filename = 'static/css/[name].css';

 return config;
};
