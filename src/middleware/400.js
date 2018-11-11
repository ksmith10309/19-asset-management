export default (err, req, res) => {
  let error = {
    error:(typeof err === 'object' && err.message) || err,
  };
  res.statusCode = 400;
  res.statusMessage = 'Bad Request';
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(error));
};
