var url;
if (process.env.DOCKER == 'True')
    url = 'mongodb://localhost:27017/topkook';
else
    url = 'mongodb://db:27017/topkook'

module.exports = url