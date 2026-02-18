const PostModel = require("../models/post.model");
const  ImageKit = require('@imagekit/nodejs');
const { toFile } = require("@imagekit/nodejs");


const imagekitInstance = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
});

async function createPostController(req, res) {
    console.log("Creating post with data:", req.body);
    console.log(req.file);
    const file = await imagekitInstance.files.upload({
        file : await toFile(Buffer.from(req.file.buffer),'file'),
        fileName : "test" //required
        
    });
    res.send(file);
}






module.exports = {
    createPostController
};