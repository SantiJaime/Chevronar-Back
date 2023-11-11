const jwt = require("jsonwebtoken");

const getToken = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) console.log("Error al obtener datos");
    else data = decoded;
  });
  return data;
};

module.exports = {
  getToken,
  getTokenData,
};
