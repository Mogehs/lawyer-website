export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error Handler Caught:", {
    message: err.message,
    name: err.name,
    stack: err.stack,
    code: err.code,
    fullError: err,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
