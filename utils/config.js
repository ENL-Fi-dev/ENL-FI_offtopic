if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const MONGODB_URI = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return process.env.MONGODB_URI_PROD;
    case 'development':
      return process.env.MONGODB_URI_DEV;
    case 'staging':
      return process.env.MONGODB_URI_PROD;
    default:
      return process.env.MONGODB_URI_DEV;
  }
};

const PORT = process.env.PORT || 4015;
const SECRET = process.env.SECRET;

module.exports = {
  mongo: MONGODB_URI(), port: PORT, secret: SECRET, env: process.env.NODE_ENV
};
