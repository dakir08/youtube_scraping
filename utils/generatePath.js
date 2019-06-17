module.exports = function generatePath(path, file) {
  if (!file) return path;
  return `${path}/${file}`;
};
