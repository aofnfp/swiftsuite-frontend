import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import PricingSection from '../landingpage/PricingSection';
import img from '../Images/swift.png'
import img2 from '../Images/Brenda.jpg'
import { LiaStarSolid } from "react-icons/lia";
import Faqs from './Faqs';
import billImg from '../Images/billing.svg'
import sandyImg from '../Images/Sandy.jpg'




const ChoosePlan = () => {
  return (
    <div className='bg-[#E7F2ED]'>
        <section className='bg-[#005D68] flex flex-col gap-2 py-12 justify-center items-center text-center'>
            <h1 className='border-b-1 text-3xl font-bold px-5  py-2 text-white'><span className='text-orange-400'>Choose the plan</span> that <br /> fits your business needs</h1>
            <div className='text-white flex md:gap-20 gap-10 md:px-0 px-4'>
                <p className='flex items-center gap-2'><FaCircleCheck/> No hidden charges</p>
                <p className='flex items-center gap-2'><FaCircleCheck/> Exact Pricing</p>
                <p className='flex items-center gap-2'><FaCircleCheck/> Cancel anytime</p>
            </div>
        </section>
        <section className='mt-10 md:mx-10 mx-5'>
            <PricingSection/>
        </section>
        <section className="bg-white flex lg:flex-row flex-col justify-between md:px-10 px-5 lg:gap-[400px] p-5 my-5">
          <div className="flex-1 p-5">
            <img src={img} alt="" className=' h-[40px] w-[100px]'/>
            <h1 className="font-semibold text-[15px]">
              Swift Suite billing service is appreciated by our customers <br />
              <span className="text-[#027840]">all over the world</span>
            </h1>
            <p>Be the next to enjoy the seamless <br /> experience</p>
            <button className="border p-2 rounded-[10px] my-2 border-[#027840]">Customer Reviews</button>
          </div>
          <div className="flex-1 flex flex-col justify-between px-5 py-10 bg-[#F2F2F2] rounded-[10px]">
            <div className="flex justify-between">
              <div className='flex gap-2'>
              <img src={img2} alt="" className='w-[45px] h-[45px] rounded-[100%]'/>
              <div>
               <p>Brenda Rae</p>
                <p className='text-[#33333399] text-[13px]'>Social Media Analyst</p>
              </div>
              </div>
              <div className='flex items-center gap-1'><LiaStarSolid  className='border rounded-[100%] text-white bg-[#C9AF00] text-[13px]'/> 4.5</div>
            </div>
            <p>
              As a small business owner, time is my most valuable asset. swiftsuite has simplified our
              catalogue management and made tracking inventory a breeze. The support team is responsive and
              always ready to help. Highly recommended!
            </p>
          </div>
        </section>
        <div className='bg-white'>
          <Faqs/>
        </div>
        <div className='flex justify-between my-5 px-10 py-3 bg-white'>
        <div  className='relative'>
          <img src={img} alt="" className='h-[70px] w-[140px]'/>
          <div className='flex gap-1 absolute top-[44px] left-[37px]'>
          <p className='text-[12px] text-[#027840]'>B I L L I N G</p>
          <img src={billImg} alt=""  className='w-[15px]'/>
          </div>
          <p className='mx-4 text-[#027840] font-semibold text-[15px]'>Lets Get You Started</p>
          <button className='mx-4 text-white bg-[#027840] rounded-[8px] text-[10px] p-2'>Access SwiftSuite Billing</button>
        </div>
        <div>
          <img src={sandyImg} alt="" className='h-[140px] w-[180px]' />
        </div>
        </div>
    </div>
  )
}

export default ChoosePlan 