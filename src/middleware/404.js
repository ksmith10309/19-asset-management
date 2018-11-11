export default (req, res) => {
  let error = {error:'Resource Not Found'};
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(error));
};
