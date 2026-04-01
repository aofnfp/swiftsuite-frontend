import React from 'react'
import Hero from './Hero'
// import Dropshipping from './Dropshipping'
// import Features from './Features'
import Platforms from './Platforms'
// import Choose from './Choose'
import Global from './Global'
// import Pricing from './Pricing'
// import Testimo from './Testimo'
// import Efficie from './Efficie'
import Foot from './Foot'
import Footer from './Footer'
import FeaturesSection from './FetauresSection'
import DropshippingHero from './DropshippingHero'
// import WhyChooseUs from './WhyChooseUs'
import StepsSection from './StepsSection'
import EfficiencySection from './EfficiencySection'
import TestimonialsSection from './TestimonialSection'
// import PricingSection from './PricingSection'
// import HeroSection from './HeroSection'
import ChooseUs from './ChoseUs'
import NewPricingSection from './NewPricingSection'
import PricingSection from './PricingSection'
import Automate from './Automate'



const Landingpage = () => {
  return (
    <div className='bg-gray-200'>
      <Hero />
      {/* <Dropshipping /> */}
      {/* <HeroSection /> */}
      <FeaturesSection />
      <DropshippingHero />
      {/* <Features /> */}
      {/* <WhyChooseUs/> */}
      <ChooseUs/>
      <StepsSection/>
      <Automate/>
      <EfficiencySection/>
      <Platforms />
      {/* <Choose /> */}
      <Global />
      {/* <Pricing /> */}
      <div className="text-center bg-white py-10">
        <h2 className="text-4xl font-bold text-gray-900">Pricing</h2>
        <p className="text-black max-w-lg mx-auto mt-4">
          One flat monthly fee. No contracts, no hidden fees, no stress of
        </p>
        <p className="text-black max-w-lg mx-auto mb-6">
        finding a great designer.
        </p>
      <PricingSection/>
      </div>
      {/* <PricingSection/> */}
      <TestimonialsSection/>
      {/* <Testimo /> */}
      {/* <Efficie /> */}
      {/* <Foot /> */}
      {/* <Footer/> */}
    </div>
  )
}

export default Landingpage