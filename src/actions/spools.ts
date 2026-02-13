"use server";

import { db } from "@/lib/db";
import { spools, type Spool } from "@/db/schema";
import {
  createSpoolSchema,
  updateSpoolSchema,
  type CreateSpoolInput,
  type UpdateSpoolInput,
} from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Action result types
type ActionResult<T> =
  | ({ success: true } & T)
  | { success: false; error: string };

/**
 * Create a new spool with validation
 */
export async function createSpool(
  input: CreateSpoolInput
): Promise<ActionResult<{ spool: Spool }>> {
  try {
    // Validate input
    const validated = createSpoolSchema.parse(input);

    // Generate timestamps
    const now = new Date().toISOString();

    // Insert into database
    const newSpool = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(spools).values(newSpool);

    // Revalidate cache
    revalidatePath("/");

    return {
      success: true,
      spool: newSpool as Spool,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create spool",
    };
  }
}

/**
 * Get all spools, ordered by creation date (newest first)
 */
export async function getSpools(): Promise<
  ActionResult<{ spools: Spool[] }>
> {
  try {
    const allSpools = await db
      .select()
      .from(spools)
      .orderBy(desc(spools.createdAt));

    return {
      success: true,
      spools: allSpools,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch spools",
    };
  }
}

/**
 * Get a single spool by ID
 */
export async function getSpool(
  id: string
): Promise<ActionResult<{ spool: Spool }>> {
  try {
    const result = await db.select().from(spools).where(eq(spools.id, id));

    if (result.length === 0) {
      return {
        success: false,
        error: "Spool not found",
      };
    }

    return {
      success: true,
      spool: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch spool",
    };
  }
}

/**
 * Update an existing spool
 */
export async function updateSpool(
  id: string,
  input: UpdateSpoolInput
): Promise<ActionResult<{ spool: Spool }>> {
  try {
    // Validate input
    const validated = updateSpoolSchema.parse(input);

    // Check if spool exists
    const existing = await db.select().from(spools).where(eq(spools.id, id));

    if (existing.length === 0) {
      return {
        success: false,
        error: "Spool not found",
      };
    }

    // Update with new timestamp
    const now = new Date().toISOString();
    const updated = {
      ...validated,
      updatedAt: now,
    };

    await db.update(spools).set(updated).where(eq(spools.id, id));

    // Fetch updated record
    const result = await db.select().from(spools).where(eq(spools.id, id));

    // Revalidate cache
    revalidatePath("/");

    return {
      success: true,
      spool: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update spool",
    };
  }
}

/**
 * Delete a spool by ID
 */
export async function deleteSpool(
  id: string
): Promise<ActionResult<{}>> {
  try {
    // Check if spool exists
    const existing = await db.select().from(spools).where(eq(spools.id, id));

    if (existing.length === 0) {
      return {
        success: false,
        error: "Spool not found",
      };
    }

    // Delete spool
    await db.delete(spools).where(eq(spools.id, id));

    // Revalidate cache
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete spool",
    };
  }
}
