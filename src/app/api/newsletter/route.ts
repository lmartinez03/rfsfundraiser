import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const clientEmail   = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey    = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!spreadsheetId || !clientEmail || !privateKey) {
      console.error('Missing Google Sheets environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
            email,
            'RFS April 2026 Campaign',
          ],
        ],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter signup error:', err)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }
}
