"use server"

export type SendMail = {
  to: string;
  cc?: string;
  subject?: string;
  htmlBody: string;
}

export const sendMail = async ({ cc, to, subject, htmlBody }: SendMail) => {
  const result = {
    success: false,
    message: "",
    data: null as string | null,
  }

  const url = 'https://api.elasticemail.com/v2/email/send'
  const apiKey = process.env.ELASTIC_API_KEY || ""
  if (!apiKey) {
    result.message = 'Missing Elastic Email API key'
    return result
  }

  const from = 'elevate@ansahealth.com.au'
  const payload: Record<string, string> = {
    from,
    fromName: 'Elevate',
    msgTo: to,
    bodyHtml: htmlBody,
    apikey: apiKey,
    isTransactional: 'true'
  }

  if (cc) payload.msgCc = cc
  if (subject) payload.subject = subject

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(payload).toString()
  }

  try {
    const res = await fetch(url, options)
    const resJson = await res.json()

    result.success = res.ok
    result.message = res.ok ? 'Email sent successfully' : resJson.error || 'Failed to send email'
    result.data = JSON.stringify(resJson)
    return result

  } catch (error) {
    result.message = `${error}`
    return result
  }
}
