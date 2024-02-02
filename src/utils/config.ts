export const jwt_token = process.env.JWT_NAME
  ? process.env.JWT_NAME
  : "jwt_token";

export const upload_profile = process.env.CLOUDINARY_UPLOAD_PROFILE as string;

export const register_secret = process.env.REGISTER_SECRET as string;
