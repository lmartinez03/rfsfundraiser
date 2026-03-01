'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const GOAL = 1000

// ════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════
interface Donor {
  name: string
  amount: number
  rank: number
  message?: string
}

interface CampaignData {
  raised: number
  goal: number
  donors: Donor[]
}

// ════════════════════════════════════════════════════
// TICKER BANNER
// ════════════════════════════════════════════════════
function TickerBanner() {
  const msg =
    '★  WE WILL ALSO BE DONATING A JUNGLE GYM PLAYGROUND IN THIS CAMPAIGN!     '
  const repeated = msg.repeat(6)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 overflow-hidden h-9 flex items-center select-none">
      <div className="ticker-track font-montserrat font-bold text-sm text-forest-dark uppercase tracking-wide">
        <span>{repeated}</span>
        <span aria-hidden="true">{repeated}</span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
// FLOATING MENU BUTTON
// ════════════════════════════════════════════════════
function MenuButton() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollToSection = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const navItems = [
    { label: 'HOME', id: 'home' },
    { label: 'DONATE', id: 'donate' },
    { label: 'HOW IT WORKS', id: 'how-it-works' },
    { label: 'FAQ', id: 'faq' },
    { label: 'CONTACT', id: 'contact' },
  ]

  return (
    <>
      {/* Floating circle hamburger button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-[46px] right-5 z-40 w-12 h-12 rounded-full bg-navy/85 backdrop-blur-sm hover:bg-navy text-white flex items-center justify-center shadow-xl transition-all duration-200 border border-white/15"
        aria-label="Open menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M2 5h16M2 10h16M2 15h16" />
        </svg>
      </button>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(26, 48, 38, 0.60)' }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-[52px] right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
          aria-label="Close menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>

        {/* Nav links */}
        <div className="flex flex-col items-center gap-4 mb-10">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white hover:text-amber-400 transition-colors duration-200 tracking-widest leading-none"
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://readyforschoolperu.org/store"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white hover:text-amber-400 transition-colors duration-200 tracking-widest leading-none"
          >
            STORE
          </a>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/readyforschoolnonprofit/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-amber-400 transition-colors duration-200">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.facebook.com/share/g/1DiVY5goXn/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-amber-400 transition-colors duration-200">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════
function HeroSection() {
  const scrollToDonate = () => {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative">
      <div className="relative min-h-[520px] md:min-h-[680px]">
        {/* Top photo — fills container */}
        <Image
          src="/images/RFSTopPhoto.png"
          fill
          alt="Children walking to school in Peru with Machu Picchu in the background"
          className="object-cover object-center"
          sizes="100vw"
          priority
        />

        {/* Top gradient for readability */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '220px',
            background: 'linear-gradient(to bottom, rgba(12,27,46,0.55) 0%, transparent 100%)',
          }}
        />

        {/* Bottom gradient — fades into page bg (#243a1c) */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '65%',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(36,58,28,0.5) 40%, rgba(36,58,28,0.9) 75%, #243a1c 100%)',
          }}
        />

        {/* Scrapbook photo — top right */}
        <div
          className="absolute top-28 right-28 md:right-60 z-10 hidden sm:block"
          style={{ transform: 'rotate(8deg)' }}
        >
          <div className="bg-white shadow-2xl" style={{ padding: 10 }}>
            <div className="w-36 md:w-52">
              <Image
                src="/heropic.jpg"
                alt="Ready for School Peru"
                width={416}
                height={312}
                quality={95}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>

        {/* ── Headline + logo overlaid at bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 px-6 text-center">

          {/* Big centered logo + title stacked above headline */}
          <div className="flex flex-col items-center mb-5">
            <Image
              src="/logo.png"
              alt="Ready For School Peru"
              width={150}
              height={82}
              className="object-contain drop-shadow-2xl"
              priority
            />
            <span className="font-bebas text-white text-2xl md:text-3xl tracking-widest drop-shadow-lg mt-2 leading-none">
              READY FOR SCHOOL
            </span>
            <span className="font-bebas text-amber-400 text-4xl md:text-5xl tracking-widest drop-shadow-lg -mt-1 leading-none">
              PERU
            </span>
          </div>

          <span className="inline-block font-montserrat text-sm font-bold text-amber-400 uppercase tracking-[0.3em] mb-3 drop-shadow">
            April 2026 Campaign
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-none drop-shadow-lg">
            HELP US PUT A BOOK IN<br className="hidden sm:block" /> A CHILD&apos;S HANDS
          </h1>
          <p className="font-montserrat text-white/85 text-base md:text-lg max-w-2xl mx-auto mt-3 drop-shadow">
            In many rural communities, children have never owned a single book.
          </p>

          {/* Scroll arrow */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={scrollToDonate}
              className="scroll-arrow w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-500 flex items-center justify-center shadow-xl shadow-amber-400/30 transition-colors duration-200"
              aria-label="Scroll to donate"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-forest-dark">
                <path d="M5 8l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// DONATE SECTION
// ════════════════════════════════════════════════════
function DonateSection({ raised, goal }: { raised: number; goal: number }) {
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(25)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const presets = [10, 25, 50, 100]
  const progress = Math.min((raised / goal) * 100, 100)

  const getAmount = (): number => {
    if (selectedPreset === 'custom') {
      const v = parseFloat(customAmount)
      return isNaN(v) || v < 1 ? 0 : v
    }
    return selectedPreset
  }

  const handleDonate = async () => {
    const amount = getAmount()
    if (!amount || amount < 1) {
      setError('Please enter a valid donation amount (minimum $1).')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: 'one-time', name: donorName.trim() || 'Anonymous', message: donorMessage.trim() }),
      })

      if (!res.ok) throw new Error('Failed to create session')

      const { sessionId } = await res.json()
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe not loaded')
      await stripe.redirectToCheckout({ sessionId })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const impactItems = [
    { amount: '$10', text: 'A book + pencils & supplies' },
    { amount: '$25', text: 'A complete filled backpack' },
    { amount: '$50', text: 'Full school year supplies' },
    { amount: '$100', text: 'Supplies for multiple children' },
  ]

  const displayAmount = getAmount()

  return (
    <section id="donate" className="bg-forest-light pt-10 pb-20 md:pt-12 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* ── Left: Campaign info ── */}
          <div className="reveal">
            <span className="inline-block font-montserrat text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">
              Campaign Goal
            </span>
            <h2 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-white leading-none mb-6">
              ${raised.toLocaleString()} RAISED
              <br />
              <span className="text-white/40 text-4xl md:text-5xl">OF ${goal.toLocaleString()} GOAL</span>
            </h2>

            {/* Progress bar */}
            <div className="bg-white/10 rounded-full h-5 overflow-hidden mb-2">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-[1500ms] ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-montserrat text-white/50 text-xs mb-3">
              <span>{progress.toFixed(0)}% of goal reached</span>
              <span>${(goal - raised).toLocaleString()} remaining</span>
            </div>

            <p className="font-montserrat text-white/80 text-base leading-relaxed mb-4">
              With your support, we can provide books and backpacks and give the gift of
              reading to children who need it most. To meet this challenge, we&apos;ve set up
              this campaign with a goal of $1,000. Every donation makes a difference.
            </p>

            {/* Impact grid */}
            <div className="grid grid-cols-2 gap-3">
              {impactItems.map((item) => (
                <div
                  key={item.amount}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-400/40 transition-colors duration-200"
                >
                  <div className="font-bebas text-3xl text-amber-400 leading-none">{item.amount}</div>
                  <div className="font-montserrat text-white/65 text-sm mt-1 leading-snug">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Donation widget ── */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

            {/* Amount presets */}
            <p className="font-montserrat font-bold text-white/60 text-xs uppercase tracking-widest mb-4">
              Choose an amount
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedPreset(preset)}
                  className={`py-3.5 rounded-xl font-montserrat font-bold text-xl border-2 transition-all duration-200 ${
                    selectedPreset === preset
                      ? 'bg-amber-400 border-amber-400 text-forest-dark shadow-md'
                      : 'border-white/15 text-white hover:border-amber-400/60 hover:text-amber-400'
                  }`}
                >
                  ${preset}
                </button>
              ))}
              <button
                onClick={() => setSelectedPreset('custom')}
                className={`col-span-2 py-3.5 rounded-xl font-montserrat font-bold text-xl border-2 transition-all duration-200 ${
                  selectedPreset === 'custom'
                    ? 'bg-amber-400 border-amber-400 text-forest-dark shadow-md'
                    : 'border-white/15 text-white hover:border-amber-400/60 hover:text-amber-400'
                }`}
              >
                CUSTOM AMOUNT
              </button>
            </div>

            {/* Custom amount input */}
            {selectedPreset === 'custom' && (
              <div className="mb-3">
                <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-amber-400 transition-colors duration-200">
                  <span className="px-4 font-montserrat font-bold text-xl text-white/70">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="flex-1 py-3.5 pr-4 bg-transparent text-white font-montserrat text-xl outline-none placeholder-white/30"
                  />
                </div>
              </div>
            )}

            {/* Name input */}
            <div className="mt-3">
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Your name (optional, for leaderboard)"
                className="w-full px-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white font-montserrat text-sm placeholder-white/35 outline-none focus:border-amber-400 transition-colors duration-200"
              />
            </div>

            {/* Message input */}
            <div className="mb-6 mt-3">
              <textarea
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="Leave a message (optional)"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white font-montserrat text-sm placeholder-white/35 outline-none focus:border-amber-400 transition-colors duration-200 resize-none"
              />
            </div>

            {/* Donate button */}
            <button
              onClick={handleDonate}
              disabled={loading}
              className="donate-pulse w-full py-4 rounded-xl bg-amber-400 hover:bg-green-500 active:bg-green-600 text-forest-dark font-montserrat font-bold text-lg tracking-wider transition-colors duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'REDIRECTING TO STRIPE...'
                : `DONATE${displayAmount >= 1 ? ` $${selectedPreset === 'custom' ? customAmount || '...' : selectedPreset}` : ''} NOW`}
            </button>

            {error && (
              <p className="mt-3 font-montserrat text-red-400 text-sm text-center">{error}</p>
            )}

            <p className="mt-4 font-montserrat text-white/30 text-xs text-center leading-relaxed">
              Secure payment powered by Stripe. Ready for School Peru is a registered 501(c)(3) nonprofit.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// LEADERBOARD SECTION
// ════════════════════════════════════════════════════
function LeaderboardSection({ donors }: { donors: Donor[] }) {
  const medals = ['🥇', '🥈', '🥉']

  return (
    <section id="leaderboard" className="bg-forest-dark py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Left 2/3: Leaderboard ── */}
          <div className="lg:col-span-2 reveal">
            <span className="inline-block font-montserrat text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">
              Campaign Leaders
            </span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white leading-none mb-8">
              TOP DONORS
            </h2>
            <div className="w-14 h-1 bg-amber-400 rounded mb-8" />

            {donors.length > 0 ? (
              <div className="space-y-3">
                {donors.map((donor, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-amber-400/40 rounded-xl px-6 py-4 transition-colors duration-200"
                  >
                    <span className="text-2xl w-8 text-center flex-shrink-0">
                      {i < 3 ? medals[i] : (
                        <span className="font-bebas text-amber-400">{i + 1}</span>
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-montserrat font-semibold text-white block truncate">
                        {donor.name}
                      </span>
                      {donor.message && (
                        <span className="font-montserrat text-white/45 text-xs italic block truncate mt-0.5">
                          &ldquo;{donor.message}&rdquo;
                        </span>
                      )}
                    </div>
                    <span className="font-bebas text-2xl text-amber-400 flex-shrink-0">
                      ${donor.amount.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="font-bebas text-5xl text-white/25 mb-3">BE THE FIRST!</div>
                <p className="font-montserrat text-white/40 text-sm">
                  Make a donation and your name will appear at the top of the leaderboard.
                </p>
                <button
                  onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-6 px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-forest-dark font-montserrat font-bold text-sm tracking-wider transition-colors duration-200"
                >
                  DONATE NOW
                </button>
              </div>
            )}
          </div>

          {/* ── Right 1/3: Photos + Socials ── */}
          <div className="reveal" style={{ transitionDelay: '150ms' }}>
            <span className="inline-block font-montserrat text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">
              Follow Our Journey
            </span>
            <h3 className="font-bebas text-4xl text-white leading-none mb-6">
              PHOTOS &amp; SOCIALS
            </h3>
            <div className="w-10 h-1 bg-amber-400 rounded mb-6" />

            {/* Scrapbook photos */}
            <div className="mb-7" style={{ overflow: 'visible' }}>
              {/* Row 1 */}
              <div className="flex items-start justify-between mb-0" style={{ overflow: 'visible' }}>
                <div className="bg-white shadow-xl inline-block" style={{ padding: 8, transform: 'rotate(-5deg) translateY(10px)' }}>
                  <div style={{ width: 178 }}>
                    <Image src="/images/photos-1.JPG" alt="Ready for School Peru" width={296} height={222} quality={95} className="w-full h-auto block" />
                  </div>
                </div>
                <div className="bg-white shadow-xl inline-block" style={{ padding: 8, transform: 'rotate(4deg) translateY(-4px)' }}>
                  <div style={{ width: 158 }}>
                    <Image src="/images/photos-2.JPG" alt="Ready for School Peru" width={316} height={237} quality={95} className="w-full h-auto block" />
                  </div>
                </div>
              </div>
              {/* Row 2: single, offset left */}
              <div className="flex mb-3 pl-8" style={{ overflow: 'visible' }}>
                <div className="bg-white shadow-xl inline-block" style={{ padding: 8, transform: 'rotate(-2deg)' }}>
                  <div style={{ width: 220 }}>
                    <Image src="/images/photos-3.jpg" alt="Ready for School Peru" width={260} height={195} quality={95} className="w-full h-auto block" />
                  </div>
                </div>
              </div>
              {/* Row 3 */}
              <div className="flex items-start justify-between" style={{ overflow: 'visible' }}>
                <div className="bg-white shadow-xl inline-block" style={{ padding: 8, transform: 'rotate(3.5deg) translateY(5px)' }}>
                  <div style={{ width: 153 }}>
                    <Image src="/images/photos-4.jpg" alt="Ready for School Peru" width={286} height={215} quality={95} className="w-full h-auto block" />
                  </div>
                </div>
                <div className="bg-white shadow-xl inline-block" style={{ padding: 8, transform: 'rotate(-4.5deg) translateY(-8px)' }}>
                  <div style={{ width: 193 }}>
                    <Image src="/images/photos-5.jpg" alt="Ready for School Peru" width={306} height={230} quality={95} className="w-full h-auto block" />
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-3">
              {[
                { label: 'Instagram', handle: '@readyforschoolnonprofit', href: 'https://www.instagram.com/readyforschoolnonprofit/', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { label: 'Facebook', handle: 'Ready for School Peru', href: 'https://www.facebook.com/share/g/1DiVY5goXn/?mibextid=wwXIfr', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="social-card flex items-center gap-3 bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-amber-400 flex-shrink-0">{social.icon}</span>
                  <div>
                    <div className="font-montserrat font-bold text-white text-sm leading-none mb-0.5">{social.label}</div>
                    <div className="font-montserrat text-white/45 text-xs">{social.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// HOW IT WORKS
// ════════════════════════════════════════════════════
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'You Donate',
      text: 'Choose any amount and donate securely online through Stripe. Every dollar goes directly to supplies.',
      icon: <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="14" width="36" height="26" rx="3"/><path d="M6 22h36"/><path d="M14 30h8M14 35h4"/></svg>,
    },
    {
      number: '02',
      title: 'We Purchase',
      text: 'Once the campaign goal is reached, we buy books, backpacks, and school supplies packed full of essentials.',
      icon: <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h12l3 9H15l3-9z"/><rect x="8" y="17" width="32" height="24" rx="2"/><path d="M20 28h8M24 24v8"/></svg>,
    },
    {
      number: '03',
      title: 'We Fly to Peru',
      text: 'Our dedicated volunteers personally travel to rural Peruvian communities — covering all travel costs themselves.',
      icon: <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 28l8-4 6 4 14-14 8 2-20 22-4-4-8-2 2-4z"/><path d="M8 36h32"/></svg>,
    },
    {
      number: '04',
      title: 'Kids Receive',
      text: 'Books and backpacks are hand-delivered directly to children in school. Follow along on our social media!',
      icon: <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="16" r="8"/><path d="M10 40c0-7.7 6.3-14 14-14s14 6.3 14 14"/><path d="M18 30l6 6 6-6"/></svg>,
    },
  ]

  return (
    <section id="how-it-works" className="bg-forest-mid py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 reveal">
          <span className="inline-block font-montserrat text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">
            The Process
          </span>
          <h2 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-white leading-none">
            HOW IT WORKS
          </h2>
          <div className="w-14 h-1 bg-amber-400 rounded mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card reveal bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5 hover:border-amber-400/40"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-bebas text-5xl text-amber-400 leading-none">{step.number}</span>
                <div className="w-px h-8 bg-white/10" />
                <span className="text-amber-400">{step.icon}</span>
              </div>
              <h3 className="font-montserrat font-bold text-lg text-white leading-tight">{step.title}</h3>
              <p className="font-inter text-white/60 text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// WHY / HOW / WHERE
// ════════════════════════════════════════════════════
function WhyHowWhereSection() {
  const [active, setActive] = useState<'WHY' | 'HOW' | 'WHERE'>('WHY')
  const [visible, setVisible] = useState(true)

  const switchTab = (tab: 'WHY' | 'HOW' | 'WHERE') => {
    if (tab === active) return
    setVisible(false)
    setTimeout(() => { setActive(tab); setVisible(true) }, 300)
  }

  const content = {
    WHY: {
      heading: 'Why This Campaign Matters',
      paragraphs: [
        'Many children in rural Peruvian communities have never owned a single book. Without basic educational tools, these children fall behind and lose the opportunity for a brighter future. For families living in poverty, school supplies are simply out of reach.',
        'Education is the single most powerful tool for breaking the cycle of poverty — but only if children have what they need to learn. A book. A notebook. A backpack that tells a child: you belong here, and your education matters.',
        'Ready for School Peru has been bridging this gap since 2015, reaching over 2,000 students across 60+ schools. But there is still so much more work to do. This campaign is our next step.',
      ],
      photo: '/images/why.JPG',
      photoAlt: 'Children in Peru ready for school',
      tilt: -3,
      photoLeft: false,
    },
    HOW: {
      heading: 'How Your Donation Helps',
      paragraphs: [
        '100% of every donation goes directly to purchasing school supplies. Our volunteers personally cover all travel and operating costs, so your gift reaches the children — not overhead.',
        '$10 provides a book and pencils. $25 fills a complete backpack with everything a student needs. $50 equips a child for the entire school year. Every dollar has a direct, measurable impact on a real child.',
        'Once our $1,000 goal is reached, we purchase the supplies in bulk, pack everything up, and our team personally flies to Peru to hand-deliver them to schools in remote communities.',
      ],
      photo: '/images/how.JPG',
      photoAlt: 'School supplies being prepared',
      tilt: 3,
      photoLeft: true,
    },
    WHERE: {
      heading: 'Where We Work in Peru',
      paragraphs: [
        'We travel to remote Andean and Amazonian communities in Peru — places where schools lack even the most basic resources and where children sometimes walk miles just to attend class.',
        'Our team works directly with local school directors and community leaders to identify the students who are most in need. We visit schools, meet families, and deliver supplies by hand.',
        'Since 2015, we have served students across dozens of rural communities. This campaign will add even more schools to that list, continuing our mission to make sure no child goes without.',
      ],
      photo: '/images/where.png',
      photoAlt: 'Rural community in Peru',
      tilt: -2.5,
      photoLeft: false,
    },
  }

  const current = content[active]

  return (
    <section className="bg-forest-dark py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Tab buttons */}
        <div className="flex justify-center gap-3 mb-14 flex-wrap">
          {(['WHY', 'HOW', 'WHERE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-8 py-3 rounded-full font-montserrat font-bold text-sm tracking-[0.2em] transition-all duration-300 ${
                active === tab
                  ? 'bg-amber-400 text-forest-dark shadow-lg shadow-amber-400/25'
                  : 'border-2 border-white/20 text-white/70 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {current.photoLeft && (
              <div className="flex justify-center">
                <div className="bg-white shadow-2xl" style={{ padding: 10, transform: `rotate(${current.tilt}deg)` }}>
                  <Image src={current.photo} alt={current.photoAlt} width={500} height={375} quality={95} className="w-full h-auto block" />
                </div>
              </div>
            )}
            <div>
              <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white leading-none mb-8">
                {current.heading}
              </h2>
              <div className="space-y-5">
                {current.paragraphs.map((p, i) => (
                  <p key={i} className="font-montserrat text-white/75 text-base md:text-lg leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            {!current.photoLeft && (
              <div className="flex justify-center">
                <div className="bg-white shadow-2xl" style={{ padding: 10, transform: `rotate(${current.tilt}deg)` }}>
                  <Image src={current.photo} alt={current.photoAlt} width={500} height={375} quality={95} className="w-full h-auto block" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-3 font-montserrat font-bold text-sm tracking-widest px-10 py-4 rounded-full bg-amber-400 hover:bg-amber-500 text-forest-dark transition-colors duration-200 shadow-lg"
          >
            DONATE TO THIS CAMPAIGN
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// EMAIL SIGNUP
// ════════════════════════════════════════════════════
function EmailSignupSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-amber-400 py-20 md:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center reveal">
        <span className="inline-block font-montserrat text-xs font-bold text-forest-dark/60 uppercase tracking-[0.3em] mb-4">
          Stay in the Loop
        </span>
        <h2 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-forest-dark leading-none mb-4">
          FOLLOW THE CAMPAIGN
        </h2>
        <p className="font-montserrat text-forest-dark/70 text-base mb-10 max-w-lg mx-auto">
          Get updates on our progress, photos from Peru, and be the first to know when we hit our goal.
        </p>

        {status === 'success' ? (
          <div className="font-montserrat font-bold text-xl text-forest-dark">
            ✓ You&apos;re on the list! Thank you.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-4 rounded-xl bg-forest-dark/15 border border-forest-dark/20 text-forest-dark placeholder-forest-dark/40 font-montserrat text-sm focus:outline-none focus:border-forest-dark/50 transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 rounded-xl bg-forest-dark hover:bg-forest-mid text-white font-montserrat font-bold text-sm tracking-widest transition-colors duration-200 whitespace-nowrap disabled:opacity-60"
            >
              {status === 'loading' ? 'SAVING...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="font-inter text-forest-dark/70 text-xs mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// FAQ
// ════════════════════════════════════════════════════
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    { q: 'Is my donation tax-deductible?', a: 'Yes! Ready for School Peru is a registered 501(c)(3) nonprofit organization. Your donation is fully tax-deductible to the extent allowed by law. You will receive a receipt via email from Stripe after your donation.' },
    { q: 'How will my donation be used?', a: '100% of your donation goes directly to purchasing books, backpacks, and school supplies for children in rural Peru. Our volunteers personally cover all travel and operational costs, so every dollar you give reaches a child in need.' },
    { q: 'When will campaign items be delivered?', a: 'We plan to deliver all campaign materials in April 2026. Our team will personally travel to rural Peruvian communities to hand-deliver books and backpacks directly to children in school.' },
    { q: 'What is the jungle gym playground about?', a: "In addition to books and backpacks, we are also donating a full jungle gym playground to a school in Peru during this campaign! It's an exciting bonus that will give children a safe, fun space to play and grow." },
    { q: 'How do I know my donation was used properly?', a: 'We document everything. After every trip, we post photos and videos on our social media showing exactly where donations went. Follow us @readyforschoolnonprofit on Instagram to see the impact of your gift firsthand!' },
    { q: 'How do I contact Ready for School Peru?', a: 'You can reach us through the contact section below, on social media @readyforschoolnonprofit, or by visiting our main website at readyforschoolperu.org. We love hearing from our supporters!' },
  ]

  return (
    <section id="faq" className="py-20 md:py-28" style={{ backgroundColor: '#1A3026' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14 reveal">
          <span className="inline-block font-montserrat text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Questions?</span>
          <h2 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-white leading-none">
            FREQUENTLY ASKED
          </h2>
          <div className="w-14 h-1 bg-amber-400 rounded mx-auto mt-6" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-2xl overflow-hidden transition-colors duration-200"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-montserrat font-semibold text-white text-base leading-snug">{faq.q}</span>
                <span className={`flex-shrink-0 text-amber-400 transition-transform duration-300 ${openIdx === i ? 'rotate-45' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400 ease-in-out"
                style={{ maxHeight: openIdx === i ? '300px' : '0' }}
              >
                <p className="px-6 pb-5 font-inter text-white/65 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════
// FOOTER (no background — rendered inside photo section)
// ════════════════════════════════════════════════════
function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setSubStatus('error')
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative z-10 text-white" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-36 md:pt-48 lg:pt-56 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1: Logo + tagline */}
        <div>
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3 mb-5">
            <Image src="/logo.png" alt="Ready For School Peru" width={54} height={34} className="object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-bebas text-white text-lg tracking-wider">READY FOR SCHOOL</span>
              <span className="font-bebas text-amber-400 text-2xl tracking-wider -mt-0.5">PERU</span>
            </div>
          </button>
          <p className="font-montserrat text-white/50 text-sm leading-relaxed">
            A 501(c)(3) nonprofit dedicated to supporting students in rural Peru with the school supplies they need to succeed.
          </p>
          <a href="https://readyforschoolperu.org" target="_blank" rel="noopener noreferrer"
            className="inline-block mt-4 font-montserrat text-xs text-amber-400/70 hover:text-amber-400 transition-colors duration-200 tracking-widest uppercase">
            Main Website →
          </a>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-montserrat font-bold text-white text-sm tracking-widest uppercase mb-6">Quick Links</h4>
          <div className="space-y-3">
            {[
              { label: 'Donate', id: 'donate' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Leaderboard', id: 'leaderboard' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button key={item.label} onClick={() => scrollTo(item.id)}
                className="block font-montserrat text-white/50 hover:text-amber-400 text-sm transition-colors duration-200">
                {item.label}
              </button>
            ))}
            <a href="https://readyforschoolperu.org/store" target="_blank" rel="noopener noreferrer"
              className="block font-montserrat text-white/50 hover:text-amber-400 text-sm transition-colors duration-200">
              Store
            </a>
          </div>
        </div>

        {/* Column 3: Socials */}
        <div>
          <h4 className="font-montserrat font-bold text-white text-sm tracking-widest uppercase mb-6">Follow Us</h4>
          <div className="space-y-4">
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/readyforschoolnonprofit/' },
              { label: 'Facebook', href: 'https://www.facebook.com/share/g/1DiVY5goXn/?mibextid=wwXIfr' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="block font-montserrat text-white/50 hover:text-amber-400 text-sm transition-colors duration-200">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 4: Contact + Newsletter */}
        <div>
          <h4 className="font-montserrat font-bold text-white text-sm tracking-widest uppercase mb-6">Contact</h4>
          <p className="font-montserrat text-white/50 text-sm mb-2">Questions or feedback?</p>
          <a href="mailto:readyforschoolperu@gmail.com"
            className="font-montserrat text-amber-400/80 hover:text-amber-400 text-sm transition-colors duration-200">
            readyforschoolperu@gmail.com
          </a>
          <div className="mt-8">
            <p className="font-montserrat text-white/50 text-xs uppercase tracking-widest mb-3">Email Updates</p>
            {subStatus === 'success' ? (
              <p className="font-montserrat text-amber-400 text-sm">✓ Subscribed!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="flex-1 min-w-0 px-3 py-2 bg-white/10 border border-white/15 rounded-lg text-white placeholder-white/30 font-montserrat text-xs outline-none focus:border-amber-400 transition-colors duration-200" />
                <button type="submit" disabled={subStatus === 'loading'}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-forest-dark font-montserrat font-bold text-xs rounded-lg transition-colors duration-200 whitespace-nowrap">
                  GO
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-montserrat text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Ready for School Peru. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="https://readyforschoolperu.org/privacy-policy" target="_blank" rel="noopener noreferrer"
              className="font-montserrat text-white/30 hover:text-white/60 text-xs uppercase tracking-widest transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="https://readyforschoolperu.org/disclosure" target="_blank" rel="noopener noreferrer"
              className="font-montserrat text-white/30 hover:text-white/60 text-xs uppercase tracking-widest transition-colors duration-200">
              Disclosure
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════
// SCROLL REVEAL HOOK
// ════════════════════════════════════════════════════
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════
export default function FundraiserPage() {
  useReveal()

  const [campaignData, setCampaignData] = useState<CampaignData>({
    raised: 0,
    goal: GOAL,
    donors: [],
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const fetchCampaignData = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard')
      if (res.ok) setCampaignData(await res.json())
    } catch {
      // Silently fail — show zero state
    }
  }, [])

  useEffect(() => {
    fetchCampaignData()
    const params = new URLSearchParams(window.location.search)
    if (params.get('donation') === 'success') {
      setShowSuccess(true)
      window.history.replaceState({}, '', '/')
      setTimeout(fetchCampaignData, 2000)
    }
  }, [fetchCampaignData])

  return (
    <div className="relative min-h-screen bg-forest-light">
      <TickerBanner />
      <MenuButton />

      <main>
        <HeroSection />
        <DonateSection raised={campaignData.raised} goal={campaignData.goal} />
        <LeaderboardSection donors={campaignData.donors} />
        <HowItWorksSection />
        <WhyHowWhereSection />
        <EmailSignupSection />
        <FAQSection />

        {/* ── Bottom photo as background, footer overlaid on lower half ── */}
        <div className="relative min-h-[580px]">
          <Image
            src="/images/RFSBottomPhoto.png"
            fill
            sizes="100vw"
            className="object-cover object-top"
            alt="Peruvian landscape with Nazca Lines and jungle"
          />
          {/* Gradient: photo shows at top, fades to dark for footer text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(15,30,10,0.25) 25%, rgba(15,30,10,0.78) 50%, rgba(15,30,10,0.96) 68%, #0f1e0a 82%)',
            }}
          />
          <Footer />
        </div>
      </main>

      {/* Donation success toast */}
      {showSuccess && (
        <div className="fixed bottom-8 right-6 z-50 bg-green-600 text-white px-6 py-5 rounded-2xl shadow-2xl flex items-start gap-4 max-w-sm font-montserrat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <div>
            <div className="font-bold text-base">Thank you for your donation!</div>
            <div className="text-sm text-white/80 mt-1">You&apos;re helping put a book in a child&apos;s hands. 📚</div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="flex-shrink-0 text-white/60 hover:text-white transition-colors ml-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
