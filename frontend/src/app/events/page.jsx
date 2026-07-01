import EventsCalendar from '@/components/EventsCalendar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Upcoming Events | Rah-E-Haq',
  description: 'Browse upcoming volunteer drives and welfare events near you. Join Rah-E-Haq and make a difference.',
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar />
      <EventsCalendar standalone />
      <Footer />
    </main>
  )
}
