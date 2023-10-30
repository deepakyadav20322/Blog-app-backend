const { default: mongoose } = require("mongoose");
const Post = require("../db/postSchema"); 
const userAllData = require("../db/userSchema"); 
const main = require('../index');


// Create a new post---------------
const createPost = async (req, res) => {
  try {
    console.log( req.user._id)
    
    const { title, description, content,tags ,readTime,category} = req.body;
    const  mainImage = req.file;
     const author = req.user._id;
    const post = new Post({ title, description, content, author, readTime,tags,mainImage:req.file.filename,category });

    await post.save();
        
    // write logic to save notification in all ?

       console.log('POST save Data=>')
    res.status(200).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Could not create post" });
  }
};



const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = id
    console.log("single post",postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Find the post by ID
    const post = await Post.findById(postId).populate("author").populate("comments.author").populate('likes');

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
    const { title, description, content, tags ,readTime} = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { title, description, content, tags,readTime },
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
    const { id } = req.params;
    const postId =id;

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


  const fetchAllSavedPost = async (req, res) => {
    try {
      const userId = req.user;
  
      const savedAllPosts = await userAllData
        .find({ _id: userId })
        .populate({
          path: 'savedPost.post', // Populate the 'post' field
          populate: {
            path: 'author', // Populate the 'user' field in the 'post' document
            select: 'fname lname profileImg createdAt', // Specify the fields to retrieve from the 'user' document
          }});
  
      if (savedAllPosts.length > 0) { // because find() give an array
        console.log(savedAllPosts);
        res.status(200).json({ message: 'All saved posts', data: savedAllPosts[0].savedPost, success: true });
      } else {
        res.status(404).json({ message: 'No saved posts found for the user', success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Could not get saved posts', success: false });
    }
  };
  
  const getAllPostToSpecificUser = async(req,res)=>{
    try {
     
      const userId = req.params.userId; 
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId ID' });
      }
      // Find all posts where the author field matches the user ID
      const posts = await Post.find({ author: userId }).populate('author', 'fname lname email'); // Populate author field with user's first and last name
  
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Could not fetch posts for the user.' });
    }
  }


  const likePost = async (req, res) => {
    const { postId} = req.params;
    const userId = req.user._id;
    console.log('userid',userId)
    console.log('podtId',postId)
    try {
      // it check that given compactibale  postId or not
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId ID' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' ,success:false});
      }
  
      // Check if the user already liked the post
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
  
        // // Emit an event for real-time updates (assuming you are using Socket.io)
        // main.io.emit('postLiked', postId);
        const userIds = post.likes.map(like => like.toString());
       
  
        return res.status(200).json({ message: 'Post liked successfully',data:userIds, success:true });
      }
  
      return res.status(400).json({ message: 'Post already liked by the user',success:false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const unlikePost = async (req, res) => {
    const { postId} = req.params;
    const userId = req.user._id;
    
    try {

          // it check that given compactibale  postId or not
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId ID' });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' ,success:false});
      }
  
      // Check if the user has already liked the post
      const likeIndex = post.likes.indexOf(userId);// it return the index of _id if not exist then return -1
      if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1);
        await post.save();
  
        // // Emit an event for real-time updates (assuming you are using Socket.io)
        // io.emit('postUnliked', postId);
        const userIds = post.likes.map(like => like.toString());
     
        return res.status(200).json({ message: 'Post unliked successfully',data:userIds,success:false });
      }
  
      return res.status(400).json({ message: 'Post not liked by the user' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// get all post with searching and category ----- 
  const getAllPosts = async (req, res) => {
    try {
      console.log('query run------------------')
      let query = {};
  
      // Check if both category and search query parameters are provided
      if (req.query.category && req.query.search) {
        query.category = req.query.category;
        query.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } }
        ];
      }
      // Check if only category query parameter is provided
      else if (req.query.category) {
        query.category = req.query.category;
      }
      // Check if only search query parameter is provided
      else if (req.query.search) {
        query.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ];
      }
  
      const posts = await Post.find(query).sort({ createdAt: -1 }).populate('author');
  
      res.status(200).json({ data: posts, message: 'Posts successfully retrieved' });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(400).json({ error: 'Could not fetch posts' });
    }
  };
  

// Get Top 4 post to show in singleblogPage as a recomendation.............
  const getAllPostsOfUserForRecomedation = async (req, res) => {
    try {
      const { id } = req.params; 

      const userPosts = await Post.findById(id);
      // console.log(userPosts)

      const userIdOfPost  = userPosts.author._id
      console.log(userIdOfPost)
      if (!userPosts) {
        // If no posts are found, return an appropriate response
        return res.status(404).json({ error: 'No posts found for this user' });
      }
      const allpostsOfuser = await Post.find({author:userIdOfPost});
      const mostLikedPosts =  allpostsOfuser.sort((a, b) => b.likes?.length - a.createdAt?.length)
      console.log("likeds",mostLikedPosts)
      const filterData = mostLikedPosts.sort((a, b) => b.createdAt - a.createdAt).slice(0,4);
      res.status(200).json({ data: filterData, message: 'User posts retrieved successfully' });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Could not fetch user posts for recomendation' });
    }
  };




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
  fetchAllSavedPost,
  getAllPostToSpecificUser,
  unlikePost,
  likePost,
  getAllPostsOfUserForRecomedation
  
};
