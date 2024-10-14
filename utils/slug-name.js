const slugify = require('slugify');

module.exports = (name) => {
  const slug = slugify(name, {
    lower: true,
    locale: 'vi',
  });
  return slug;
};
