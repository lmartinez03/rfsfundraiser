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

    // List recent sessions and filter for this campaign client-side
    const sessions = await stripe.checkout.sessions.list({ limit: 100 })

    let totalRaised = 0
    const donorMap = new Map<string, number>()
    const messageMap = new Map<string, string>()

    for (const session of sessions.data.filter(
      (s) => s.status === 'complete' && s.metadata?.campaign === 'rfs-april-2026'
    )) {
      const amount = (session.amount_total || 0) / 100
      totalRaised += amount

      const name = session.metadata?.donor_name || 'Anonymous'
      donorMap.set(name, (donorMap.get(name) || 0) + amount)

      if (!messageMap.has(name) && session.metadata?.donor_message) {
        messageMap.set(name, session.metadata.donor_message)
      }
    }

    // Sort by total donated, take top 10
    const donors: DonorEntry[] = Array.from(donorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, amount], index) => ({
        name,
        amount,
        rank: index + 1,
        message: messageMap.get(name),
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
