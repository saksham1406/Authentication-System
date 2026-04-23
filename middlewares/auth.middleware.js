import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
    try {
        console.log("Cookie :- ", req.cookies);
        let token = req.cookies?.token;

        console.log("Token Found :- ", token ? "YES" : "NO");

        if(!token){
            console.log("NO Token Found");
            return res.status(401).json({
                success: false,
                message: "authentication Failed",
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data :- ", decoded);
        console.log(new Date(decoded.iat  *  1000));
        console.log(new Date(decoded.exp  *  1000));
        
        req.user = decoded;

        next();
    } catch (error) {
        console.log("Auth Middleware Failure");
        return res.status(401).json({
            success: false,
            message: "authentication Failed",
        })
    }
};

export {isLoggedIn}