import React from 'react'
import { Link } from 'react-router-dom'
import img from '../Images/automate.jpeg'

const Automate = () => {
  return (
    <div>
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#0a9e57] via-[#0db85e] to-[#0fa855] min-h-[200px]">

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_75%_40%,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_10%_80%,rgba(0,0,0,0.08),transparent)]" />

        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 flex items-center justify-between h-full py-10 gap-8">

          <div className="flex flex-col gap-3 max-w-sm">
            <h2 className="text-white font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight drop-shadow-md">
              Ready to Automate?
            </h2>

            <p className="text-white/90 font-medium text-sm sm:text-base">
              Start your free trial now!
            </p>

            <Link
              to="/signup"
              className="mt-1 self-start inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-[11px] rounded-lg border border-white/60 bg-white/15 backdrop-blur-md shadow-md hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-lg transition-all duration-200"
            >
              Get Started for free
            </Link>
          </div>

          <div className="hidden sm:flex items-end justify-end flex-1 relative min-h-[160px]">
            <div className="relative  max-w-[480px] w-full">
              <img
                src={img}
                alt="Automation illustration"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              />
              <div className="absolute inset-0  mix-blend-multiply rounded-lg" />
            </div>
          </div>

        </div>

      </section>
    </div>
  )
}

export default Automate