import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20',
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.metadata?.email_opt_in !== 'true') {
      return NextResponse.json({ skipped: true })
    }

    const email = session.customer_details?.email
    if (!email) {
      return NextResponse.json({ skipped: true })
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!spreadsheetId || !clientEmail || !privateKey) {
      console.error('Missing Google Sheets environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
          email,
          'Donor',
        ]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Donation success error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
