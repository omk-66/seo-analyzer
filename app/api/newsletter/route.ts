import { NextRequest, NextResponse } from 'next/server';
import { db, emailSubscribers } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.email, email))
      .limit(1);

    if (existingSubscriber.length > 0) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Insert new email subscriber
    await db.insert(emailSubscribers).values({
      email: email.toLowerCase().trim(),
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
