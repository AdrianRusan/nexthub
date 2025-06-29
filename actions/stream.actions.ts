"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { db } from "@/lib/db";
import { log } from "@/lib/logger";
import { env } from "@/lib/env";

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    log.auth("Token request failed - no user", undefined, { error: "No user found" });
    throw new Error("User is not logged in");
  }

  if (!env.NEXT_PUBLIC_STREAM_API_KEY || !env.STREAM_SECRET_KEY) {
    log.error("Stream configuration missing", { 
      hasApiKey: !!env.NEXT_PUBLIC_STREAM_API_KEY,
      hasSecret: !!env.STREAM_SECRET_KEY 
    });
    throw new Error("Stream configuration is incomplete");
  }

  try {
    // Ensure user exists in database
    await ensureUserInDatabase(user);

    const client = new StreamClient(env.NEXT_PUBLIC_STREAM_API_KEY, env.STREAM_SECRET_KEY);

    // Expire the token in 1 hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    const issued = Math.floor(Date.now() / 1000) - 60;

    const token = client.createToken(user.id, exp, issued);

    log.auth("Stream token generated successfully", user.id, { 
      expiresAt: new Date(exp * 1000).toISOString() 
    });

    return token;
  } catch (error) {
    log.error("Failed to generate Stream token", {
      userId: user.id,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
  }
};

// Helper function to ensure user exists in database
async function ensureUserInDatabase(clerkUser: any) {
  try {
    const existingUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id }
    });

    if (!existingUser) {
      // Create user in database
      await db.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          username: clerkUser.username,
          imageUrl: clerkUser.imageUrl,
          emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        }
      });

      log.auth("User created in database", clerkUser.id, {
        email: clerkUser.emailAddresses[0]?.emailAddress
      });
    } else {
      // Update user info if needed
      const needsUpdate = 
        existingUser.email !== clerkUser.emailAddresses[0]?.emailAddress ||
        existingUser.firstName !== clerkUser.firstName ||
        existingUser.lastName !== clerkUser.lastName ||
        existingUser.imageUrl !== clerkUser.imageUrl;

      if (needsUpdate) {
        await db.user.update({
          where: { clerkId: clerkUser.id },
          data: {
            email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
            firstName: clerkUser.firstName || existingUser.firstName,
            lastName: clerkUser.lastName || existingUser.lastName,
            imageUrl: clerkUser.imageUrl || existingUser.imageUrl,
            lastActiveAt: new Date(),
            emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          }
        });

        log.auth("User updated in database", clerkUser.id);
      } else {
        // Just update last active time
        await db.user.update({
          where: { clerkId: clerkUser.id },
          data: { lastActiveAt: new Date() }
        });
      }
    }
  } catch (error) {
    log.error("Failed to sync user with database", {
      userId: clerkUser.id,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    // Don't throw here - user can still get token even if DB sync fails
  }
}