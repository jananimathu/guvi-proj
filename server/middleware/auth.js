import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
  try {
    const secret = process.env.PASSSECRET;
    const token = req.headers.authorization?.split(" ")[1];

    let decodedData;

    if (token) {      
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
        res.status(401).json({ error: "Invalid Token" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

export default auth;