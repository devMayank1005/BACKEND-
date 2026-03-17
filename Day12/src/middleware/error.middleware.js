import dotenv from "dotenv";
dotenv.config();

function handleErrors(err, req, res, next) {
    const response = {
        message: err.message
    };
    if (process.env.NODE_ENVIORMENT === "development") {
        response.stack = err.stack;
    }
     res.status(err.status).json(response);
   
    
}
export default handleErrors;