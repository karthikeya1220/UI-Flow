// Quick script to add credits to your account for development
import { db } from '../configs/db.tsx';
import { usersTable } from '../configs/schema.ts';
import { eq } from 'drizzle-orm';

async function addCredits(userEmail, additionalCredits) {
    try {
        // Get current user
        const user = await db.select().from(usersTable)
            .where(eq(usersTable.email, userEmail));

        if (!user[0]) {
            console.log('❌ User not found:', userEmail);
            return;
        }

        const currentCredits = user[0].credits || 0;
        const newCredits = currentCredits + additionalCredits;

        // Update credits
        await db.update(usersTable)
            .set({ credits: newCredits })
            .where(eq(usersTable.email, userEmail));

        console.log(`✅ Credits updated successfully!`);
        console.log(`   User: ${userEmail}`);
        console.log(`   Previous Credits: ${currentCredits}`);
        console.log(`   Added Credits: ${additionalCredits}`);
        console.log(`   New Balance: ${newCredits}`);

    } catch (error) {
        console.error('❌ Error adding credits:', error);
    }
}

// Usage: Update the email to your email address
const YOUR_EMAIL = 'your-email@example.com'; // 👈 CHANGE THIS
const CREDITS_TO_ADD = 50; // Add 50 credits

addCredits(YOUR_EMAIL, CREDITS_TO_ADD);
