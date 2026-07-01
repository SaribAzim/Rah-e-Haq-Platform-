import Campaigns from '@/components/Campaigns'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Support Our Campaigns | Rah-E-Haq',
  description: 'Browse and support active donation campaigns by Rah-E-Haq. Every rupee brings hope to those in need.',
}

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <Campaigns standalone />
      <Footer />
    </main>
  )
}
