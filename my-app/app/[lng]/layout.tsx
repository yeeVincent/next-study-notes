import './style.css'
import Sidebar from '@/components/Sidebar'
import { locales } from '@/config'

export async function generateStaticParams() {
  return locales.map((lng) => ({ lng }))
}
export default async function RootLayout({
  children,
  params: {
    lng
  }
}: { children: React.ReactNode, params: { lng: string} }) {

  return (
    <html lang={lng}>
      <body>
        <div className="container">
          <div className="main">
            <Sidebar />
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}
