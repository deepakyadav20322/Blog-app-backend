const Post = require("../db/postSchema"); //

// Create a new post---------------
const createPost = async (req, res) => {
  try {
    const { title, description, content, author, tags } = req.body;

    const post = new Post({ title, description, content, author, tags });

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Could not create post" });
  }
};

// Get all posts ----------------------
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author").populate("likes");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Could not fetch posts" });
  }
};

// Get a post by ID -----------------------------
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    // Increment the view count
    post.viewCount += 1;

    // Save the updated post with the incremented view count
    await post.save();

    // Populate other related data as needed (author, likes, comments, etc.)
    await post
      .populate("author")
      .populate("likes")
      .populate({
        path: "comments.author",
        model: "User",
      })
      .execPopulate();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Could not fetch post" });
  }
};

// Update a post by ID ----------------------------------
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, content, tags } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { title, description, content, tags },
      { new: true }
    );

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Could not update post" });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndRemove(postId);

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    res.status(200).send(); // No content response
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Could not delete post" });
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  getPostById,
};
