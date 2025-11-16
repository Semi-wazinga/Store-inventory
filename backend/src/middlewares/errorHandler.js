const errorHandler = ( err, res, req, next ) => {
   console.error('unhandled error', err)
   const status = err.status || 500;
   res.status(status).json({error: err.message || 'internal server error'});
}

module.exports = errorHandler