import * as React from "react"

export default function ChangeEmailTemplate(url: string) {
  return (
    <div style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px' }}>
        <h1 style={{ fontSize: 22, margin: 0, marginBottom: 16 }}>Confirm your new email</h1>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
          We received a request to change the email address on your account. To confirm this change, click the button below. If you did not request this change, you can safely ignore this email.
        </p>
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <a
            href={url}
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              backgroundColor: '#111827',
              color: '#ffffff',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Confirm email change
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af' }}>
          If the button above doesn’t work, copy and paste this URL into your browser:
        </p>
        <p style={{ fontSize: 12, color: '#2563eb', overflowWrap: 'anywhere' }}>{url}</p>
        <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', marginTop: 24, marginBottom: 16 }} />
        <p style={{ fontSize: 12, color: '#9ca3af' }}>
          If you didn’t request this change, no action is required.
        </p>
      </div>
    </div>
  )
}


