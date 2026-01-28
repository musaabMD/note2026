import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  const eventType = evt.type;

  // Handle user creation
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await convex.mutation(api.users.createUser, {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
      imageUrl: image_url || undefined,
    });
  }

  // Handle user updates
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await convex.mutation(api.users.updateUser, {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
      imageUrl: image_url || undefined,
    });
  }

  // Handle user deletion
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await convex.mutation(api.users.deleteUser, {
        clerkId: id,
      });
    }
  }

  // Handle subscription events from Clerk
  // Note: Clerk's subscription webhook events may vary. Adjust based on your Clerk setup.
  // Cast to string since custom subscription events may not be in Clerk's type definitions
  const eventTypeStr = eventType as string;
  if (eventTypeStr === "subscription.created" || eventTypeStr === "subscription.updated") {
    const subscription = evt.data as any;

    // Map Clerk plan to your tier system
    // You'll need to adjust this mapping based on your actual Clerk plan IDs
    const tierMap: Record<string, string> = {
      // Add your Clerk plan IDs here
      // "clerk_plan_id": "premium",
    };

    const subscriptionTier = tierMap[subscription.plan_id] || "free";

    await convex.mutation(api.users.updateSubscription, {
      clerkId: subscription.user_id,
      subscriptionTier: subscriptionTier,
      subscriptionStatus: subscription.status || "active",
      stripeCustomerId: subscription.stripe_customer_id,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  // Handle subscription cancellation
  if (eventTypeStr === "subscription.deleted") {
    const subscription = evt.data as any;

    await convex.mutation(api.users.updateSubscription, {
      clerkId: subscription.user_id,
      subscriptionTier: "free",
      subscriptionStatus: "canceled",
      cancelAtPeriodEnd: true,
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
