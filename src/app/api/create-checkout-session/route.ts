import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, type, name, message, emailOptIn } = await request.json()

    if (!amount || typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const donorName = (name && typeof name === 'string' ? name.trim() : '') || 'Anonymous'

    const metadata: Record<string, string> = {
      campaign: 'rfs-april-2026',
      donor_name: donorName,
      type: type || 'one-time',
      amount: String(amount),
    }
    if (message && typeof message === 'string' && message.trim()) {
      metadata.donor_message = message.trim().slice(0, 500)
    }
    if (emailOptIn === true) {
      metadata.email_opt_in = 'true'
    }

    if (type === 'monthly') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'April 2026 Campaign Donation — Monthly',
                description:
                  'Your monthly gift helps provide books and backpacks to children in rural Peru.',
              },
              unit_amount: Math.round(amount * 100),
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/?donation=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/#donate`,
        metadata,
      })

      return NextResponse.json({ sessionId: session.id })
    } else {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        submit_type: 'donate',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'April 2026 Campaign Donation',
                description:
                  'Your gift provides books and backpacks to children in rural Peru who need them most.',
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/?donation=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/#donate`,
        metadata,
        payment_intent_data: { metadata },
      })

      return NextResponse.json({ sessionId: session.id })
    }
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
