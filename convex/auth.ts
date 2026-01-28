import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

// HTTP router for Clerk webhooks
export const http = httpRouter();

// Handle Clerk webhook events
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

    const headers = Object.fromEntries(request.headers.entries());
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.text();
    const body = JSON.stringify(JSON.parse(payload));

    const wh = new Webhook(WEBHOOK_SECRET);
    
    try {
      const evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;

      // Handle user.created event
      if (evt.type === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        await ctx.runMutation(api.users.createUser, {
          clerkId: id,
          email: email_addresses[0]?.email_address || "",
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          imageUrl: image_url || undefined,
        });
      }

      // Handle user.updated event
      if (evt.type === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email: email_addresses[0]?.email_address || "",
          firstName: first_name || undefined,
          lastName: last_name || undefined,
          imageUrl: image_url || undefined,
        });
      }

      // Handle user.deleted event
      if (evt.type === "user.deleted") {
        const { id } = evt.data;
        
        await ctx.runMutation(api.users.deleteUser, {
          clerkId: id || evt.data.id,
        });
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook", { status: 400 });
    }
  }),
});

// Get the current authenticated user from Clerk JWT token
export const getCurrentUser = httpAction(async (ctx, request) => {
  // This will be called by Convex to get the user from the JWT token
  // The token is passed via the Authorization header
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Convex will validate the Clerk JWT token automatically
  // We just need to return the user info
  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
