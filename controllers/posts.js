const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const Post = require('../model/post');
const User = require('../model/user');

const posts = {
  async getPosts(req, res) {
    // asc 遞增(由小到大，由舊到新) >> "createdAt"
    // desc 遞減(由大到小、由新到舊) >> "-createdAt"
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"; 
    const q = req.query.keyword !== undefined ? { "content": new RegExp(req.query.keyword) } : {};
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, allPosts);
  },
  async createdPosts(req, res) {
    try {
      const { body } = req;
      if (body.content) {
        const newPost = await Post.create(
          {
            user: body.user,
            content: body.content,
            image: body.image
          }
        );
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch(error) {
      handleError(res, error);
    }
  },
  async deletePost(req, res ) {
      if (req.originalUrl === '/posts/') {
        handleError(res);
      } else {
        await Post.deleteMany({});
        handleSuccess(res, []);
      }
  },
  async deleteOnePost(req, res) {
    try {
      const id = req.params.id;
      const delPost = await Post.findByIdAndDelete(id);
      if (delPost) {
        const posts = await Post.find();
        handleSuccess(res, posts);
      } else {
        handleError(res);
      }
    } catch(error) {
      handleError(res, error);
    }
  },
  async updatePost(req, res) {
    try {
      const id = req.params.id;
      const { body } = req;
      if (body.content) {
        await Post.findByIdAndUpdate(id, body);
        const updatePost = await Post.find().populate({
          path: 'user',
          select: 'name photo'
        });
        handleSuccess(res, updatePost);
      } else {
        handleError(res);
      }
    } catch(error) {
      handleError(res, error);
    }
  }
}

module.exports = posts;