const isCashCollector = (req, res, next) => {
    try {
      const user = req.user;
      const { role } = user;
  
      if (role === 'cashcollector' || role === "admin") 
      {
        next();
      } else {
        res.status(401);
        throw new Error("Unauthorized. Please provide valid authentication credentials.");
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };

  module.exports = {
    isCashCollector
  };