//  Error handling middleware for Multer errors--------------

const handleMulterError = (err, req, res, next) => {
    if (err && err.name === 'MulterError') {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: 'File size less than 1MB' ,success:false,type:'multer size error'});
      } else if( err.code === 'LIMIT_FILE_TYPES'){
        res.status(400).json({ message: 'Profile image must be JPEG or PNG.',success:false,type:'multer mime error' });
      }
      else {
        res.status(400).json({ message: err.message });
      }
    } else {
      next(err);
    }
  };


  module.exports  = {
    handleMulterError,
  }