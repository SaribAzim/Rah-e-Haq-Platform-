import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Impact from '@/components/Impact'
import Mission from '@/components/Mission'
import Stories from '@/components/Stories'
import Gallery from '@/components/Gallery'
import VolunteerCTA from '@/components/VolunteerCTA'
import Contact from '@/components/Contact'
import Trust from '@/components/Trust'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Impact />
      <Mission />
      <Stories />
      <Gallery />
      <VolunteerCTA />
      <Contact />
      <Trust />
      <Footer />
    </main>
  )
}
