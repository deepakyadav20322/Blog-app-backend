const { default: mongoose } = require("mongoose");
const Post = require("../db/postSchema"); 
const userAllData = require("../db/userSchema"); 


// Create a new post---------------
const createPost = async (req, res) => {
  try {
    console.log( req.user._id)
    
    const { title, description, content,tags } = req.body;
     const author = req.user._id;
    const post = new Post({ title, description, content, author, tags });

    await post.save();
       console.log('POST save Data=>',post)
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Could not create post" });
  }
};

// Get all posts ------------------------------------------------------
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author")
    // const posts = await Post.find().populate("author").populate("likes");

    res.status(200).json({data:posts,message:"All post successfulluy retrive"});
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(400).json({ error: "Could not fetch posts" });
  }
};

// Get a post by ID -----------------------------
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = id
    console.log("single post",postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Find the post by ID
    const post = await Post.findById(postId).populate("author").populate("comments.author");

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    // Increment the view count
    post.viewCount += 1;

    // Save the updated post with the incremented view count
    await post.save();

    // Populate other related data as needed (author, likes, comments, etc.)
    // await post
    //   .populate("author")
    //   .populate(
    //     "comments.author"
    //     )
        // .populate("likes")
      // .execPopulate();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Could not fetch post" });
  }
};

// Update a post by ID ----------------------------------
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = id;
    const { title, description, content, tags } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { title, description, content, tags },
      { new: true }
    );

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    res.status(200).json({data:post,message:'post updated successfully...'});
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

// -------------------------------------------------------------------------------------------
// Get a post by ID for updating the post because we are not increase the view count when updating -----------------------------
const getPostByIdForUpdating = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = id
    console.log("single post",postId);

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    await post.save();

    // Populate other related data as needed (author, likes, comments, etc.)
    await post
      .populate("author")
     

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Could not fetch post" });
  }
};



// Get all posts of a specific user ------------------------------------------------------
const getAllPostsOfUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = id;

    // Find all posts where the 'author' field matches the provided user ID
    const userPosts = await Post.find({ author: userId });

    if (!userPosts) {
      // If no posts are found, return an appropriate response
      return res.status(404).json({ error: 'No posts found for this user' });
    }

    // Return the user's posts as a JSON response
    res.status(200).json({ data: userPosts, message: 'User posts retrieved successfully' });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Could not fetch user posts' });
  }
};


const addCommentToPost = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const postId = id;
  const { commentText } = req.body;
  const authorId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await userAllData.findById(authorId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newComment = {
      commentText,
      author: authorId,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({message:"comment added successfully", data: newComment ,success:true});
  } catch (error) {
    console.error('Error adding comment to the post:', error);
    res.status(500).json({ message: 'Could not add comment to the post' });
  }
};



const savedPost = async(req,res)=>{
  try {
    const {id }= req.params;
    const  postId = id;
    const userId = req.user;
    const user = await userAllData.findById(userId);
    if(!postId || !user){
    res.status(500).json({message:"user or post not Available",success:false})
    }else{
      const savedPostEntry = {
        post: postId,
        createdAt: new Date(),
      };
      // Push the savedPostEntry into the user's savedPost array
      user.savedPost.push(savedPostEntry);
      
      // Save the user document to update the savedPost array
      await user.save();
      res.status(200).json({message:"post saved successfully",data:user,success:true});
    }
    
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Could not save the post' });
  }
}

const unSavePost = async(req,res)=>{
  try {
    const {id }= req.params;
    const  postId = id;
    const userId = req.user;
    const user = await userAllData.findById(userId);
    if(!postId || !user){
    res.status(500).json({message:"user or post not Available",success:false})
    }else{
         // Check if the post is in the user's savedPost array
    const savedPostEntry = user.savedPost.find((entry) => entry.post.toString() === postId);

    if (!savedPostEntry) {
      return res.status(404).json({ message: 'Post not found in saved posts', success: false });
    }

    // Remove the saved post entry from the user's savedPost array
    user.savedPost = user.savedPost.filter((entry) => entry.post.toString() !== postId);

    // Save the user document to update the savedPost array
    await user.save();
    console.log('post unsave successfully')
    res.status(200).json({ message: 'Post unsave successully',data:user,success:true });
    
  }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Could not unSave the post' });
  }
}

const fetchAllSavedPost = async(req,res)=>{
  try {
    
   const userId = req.user;
   const savedAllPosts = await savePosts.find().populate(); 
   if(savedAllPosts){
    console.log(savedAllPosts)
    res.status(200).json({ message: 'All saved post',data:savedAllPosts,success:true});
   }else{
    res.status(500).json({ message: 'Not find any saved post',success:false });
   }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Could not get any post' });
  }
}

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  getPostById,
  getPostByIdForUpdating,
  getAllPostsOfUser,
  addCommentToPost,
  savedPost,
  unSavePost,
  fetchAllSavedPost
};