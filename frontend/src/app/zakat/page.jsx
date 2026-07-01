import ZakatCalculator from '@/components/ZakatCalculator'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Zakat Calculator | Rah-E-Haq',
  description: 'Calculate your Zakat accurately and instantly. A free, accurate Zakat calculator supporting PKR, USD, and SAR.',
}

export default function ZakatPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <ZakatCalculator standalone />
      <Footer />
    </main>
  )
}
