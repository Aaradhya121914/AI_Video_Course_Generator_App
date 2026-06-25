import { NextResponse } from 'next/server';
import { db } from '../../../configs/db';
import { UserCredits } from '../../../configs/Schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
    try {
        const { email } = await request.json();
        console.log('get-user-credits called for:', email);

        // Check if user exists in UserCredits table
        let userCredits = await db.select().from(UserCredits).where(eq(UserCredits.email, email)).limit(1);

        // If user doesn't exist, create new entry with default 100 credits
        if (userCredits.length === 0) {
            console.log('Creating new user with 100 credits');
            const [newUser] = await db.insert(UserCredits).values({ email }).returning();
            userCredits = [newUser];
        }

        console.log('Returning credits:', userCredits[0].credits);
        return NextResponse.json({ credits: userCredits[0].credits });
    } catch (error) {
        console.error('Error getting user credits:', error);
        return NextResponse.json({ error: 'Failed to get credits' }, { status: 500 });
    }
}