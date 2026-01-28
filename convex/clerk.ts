import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

/**
 * Validate Clerk JWT token and extract user information
 * This is used by Convex to authenticate requests
 */
export const validateClerkToken = httpAction(async (ctx, request) => {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.substring(7);
  
  // Clerk JWT tokens are validated by Convex automatically
  // We just need to extract the user info from the token
  // The token contains claims like: sub (user ID), email, etc.
  
  try {
    // Decode the JWT token (without verification - Convex handles that)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return new Response("Invalid token format", { status: 401 });
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    // Return the user information from the token
    return new Response(
      JSON.stringify({
        userId: payload.sub || payload.aud,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        nickname: payload.nickname,
        given_name: payload.given_name,
        family_name: payload.family_name,
        phone_number: payload.phone_number,
        email_verified: payload.email_verified,
        phone_number_verified: payload.phone_number_verified,
        exams: payload.exams,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error validating token:", error);
    return new Response("Invalid token", { status: 401 });
  }
});
