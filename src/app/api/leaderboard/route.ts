import { NextResponse } from 'next/server'
import Stripe from 'stripe'

interface DonorEntry {
  name: string
  amount: number
  rank: number
  message?: string
}

interface CacheData {
  raised: number
  goal: number
  donors: DonorEntry[]
}

// Simple in-memory cache — refreshes every 60 seconds
let cache: { data: CacheData; timestamp: number } | null = null
const CACHE_TTL = 60 * 1000

export async function GET() {
  try {
    // Return cached data if still fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ raised: 0, goal: 1000, donors: [] })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    // List recent sessions, expanding payment_intent to read its metadata too
    const sessions = await stripe.checkout.sessions.list({ limit: 100, expand: ['data.payment_intent'] })

    let totalRaised = 0
    const donorMap = new Map<string, number>()
    const displayMap = new Map<string, string>()
    const messageMap = new Map<string, string>()

    for (const session of sessions.data.filter(
      (s) => s.status === 'complete' && s.metadata?.campaign === 'rfs-april-2026'
    )) {
      const amount = (session.amount_total || 0) / 100
      totalRaised += amount

      const pi = session.payment_intent && typeof session.payment_intent === 'object' ? session.payment_intent as Stripe.PaymentIntent : null
      const sessionName = session.metadata?.donor_name
      const piName = pi?.metadata?.donor_name
      // Prefer PI name so edits in Stripe dashboard take effect; fall back to session name, then Anonymous
      const name = (piName && piName !== 'Anonymous' ? piName : null) || (sessionName && sessionName !== 'Anonymous' ? sessionName : null) || 'Anonymous'
      // Anonymous donors each get a unique key so they appear separately
      const key = name === 'Anonymous' ? `__anon_${session.id}` : name
      donorMap.set(key, (donorMap.get(key) || 0) + amount)
      displayMap.set(key, name)

      if (!messageMap.has(key) && session.metadata?.donor_message) {
        messageMap.set(key, session.metadata.donor_message)
      }
    }

    // Sort by total donated, take top 10
    const donors: DonorEntry[] = Array.from(donorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, amount], index) => ({
        name: displayMap.get(key) || key,
        amount,
        rank: index + 1,
        message: messageMap.get(key),
      }))

    const data: CacheData = {
      raised: Math.round(totalRaised * 100) / 100,
      goal: 1000,
      donors,
    }

    cache = { data, timestamp: Date.now() }
    return NextResponse.json(data)
  } catch (err) {
    console.error('Leaderboard error:', err)
    // Return safe fallback on error
    return NextResponse.json({ raised: 0, goal: 1000, donors: [] })
  }
}
