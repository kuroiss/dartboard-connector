export const metadata = {
  title: "Darts Board Connector Example",
  description: "Example of Darts Board Connectors.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
