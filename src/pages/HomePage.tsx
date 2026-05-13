import { HeroMosaic } from '@/sections/HeroMosaic'
import { HeroMosaicMobile } from '@/sections/HeroMosaicMobile'
import { WorkGrid } from '@/sections/WorkGrid'
import { About } from '@/sections/About'
import { Expertise } from '@/sections/Expertise'
import { Contact } from '@/sections/Contact'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * Single-page flow: Masthead → Work → About → Capabilities → Contact.
 * Method section was removed by request.
 */
export function HomePage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (
    <main className="relative bg-paper text-ink">
      {isDesktop ? <HeroMosaic /> : <HeroMosaicMobile />}
      <WorkGrid />
      <About />
      <Expertise />
      <Contact />
    </main>
  )
}
