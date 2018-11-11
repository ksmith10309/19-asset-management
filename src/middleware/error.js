export default (err, req, res) => {
  console.log('__SERVER ERROR__');
  let error = {
    error:(typeof err === 'object' && err.message) || err,
  };
  res.statusCode = (typeof err === 'object' && err.status) || 500;
  res.statusMessage = (typeof err === 'object' && err.statusMessage) || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(error));
};
