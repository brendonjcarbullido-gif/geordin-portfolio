import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { Footer } from '@/sections/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Cursor } from '@/components/motion/Cursor'
import { IntroLoader } from '@/components/motion/IntroLoader'
import { RouteCurtain } from '@/components/motion/RouteCurtain'
import { LightboxProvider } from '@/components/Lightbox'
import { SectionNav } from '@/components/SectionNav'
import { MobileProgress } from '@/components/MobileProgress'
import { ScrollFlow } from '@/components/ScrollFlow'
import { HomePage } from '@/pages/HomePage'
import { WorkPage } from '@/pages/WorkPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CaseStudyPage } from '@/pages/CaseStudyPage'

// Routes are eagerly imported (rather than React.lazy + Suspense) so the
// always-mounted <Footer /> doesn't shift position during the brief route-
// chunk-loading window. With lazy + fallback={null}, on deep-link to a long
// page (e.g. /work/:slug) the Footer rendered near y=0 for a moment, then
// jumped to y ≈ 8000+ once the route chunk resolved — that's a CLS event
// scoring ~0.28 in Lighthouse. The total bundle hit from eager-importing
// all five routes is small (~10 kB gzipped combined) and well worth the
// CLS recovery.
export default function App() {
  return (
    <BrowserRouter>
      <LightboxProvider>
        <IntroLoader />
        <RouteCurtain />
        <Cursor />
        <ScrollToTop />
        <ScrollFlow />
        <Nav />
        <SectionNav />
        <MobileProgress />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </LightboxProvider>
    </BrowserRouter>
  )
}
