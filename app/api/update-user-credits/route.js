import { NextResponse } from 'next/server';
import { db } from '../../../configs/db';
import { UserCredits } from '../../../configs/Schema';
import { eq,sql } from 'drizzle-orm';

export async function POST(request) {
    try {
        const { email, creditsToSubtract } = await request.json();
        console.log('Updating credits for:', email, 'Subtracting:', creditsToSubtract);

         // First get current credits
        const currentUser = await db.select().from(UserCredits).where(eq(UserCredits.email, email)).limit(1);
        console.log('Current credits before update:', currentUser[0]?.credits);

        // Update user's credits
        const [updatedUser] = await db.update(UserCredits)
            .set({ credits: sql`${UserCredits.credits} - ${creditsToSubtract}` })
            .where(eq(UserCredits.email, email))
            .returning();
        console.log('Updated credits:', updatedUser.credits);

        return NextResponse.json({ success: true, newCredits: updatedUser.credits });
    } catch (error) {
        console.error('Error updating user credits:', error);
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
    }
}