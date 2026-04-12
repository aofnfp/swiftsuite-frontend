import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { Toaster, toast } from 'sonner';
import gif from '../Images/gif.gif';
import { useNavigate } from 'react-router-dom';
import { useEditVendorStore } from '../stores/editVendorStore';
import { fpiCredential } from '../api/authApi';

const EditFpi = () => {
  const navigate = useNavigate();
  const matchedVendor = useEditVendorStore((state) => state.matchedVendor);
  const vendor_name = useEditVendorStore((state) => state.editingVendorName);
  const setCurrentStep = useEditVendorStore((state) => state.setCurrentStep);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [dispatchCheck, setDispatchCheck] = useState(false);
  const [myLoader, setMyLoader] = useState(false);


  const createSchema = (vendorName) => {
    return yup.object().shape({
      host: vendorName === 'Rsr' ? yup.string().notRequired('Host is required') : vendorName === 'Fragrancex' ? yup.string().notRequired('Host is required') : yup.string().required(),

      ftp_username: vendorName === 'Rsr' ? yup.string().notRequired('FTP Username is required') : vendorName === 'Fragrancex' ? yup.string().notRequired('FTP Username is required') : yup.string().required(),

      ftp_password: vendorName === 'Rsr' ? yup.string().notRequired('FTP Password is required') : vendorName === 'Fragrancex' ? yup.string().notRequired('FTP Password is required'): yup.string().required(),

      Username: vendorName === 'Rsr' ? yup.string().required('API Access ID is required') : vendorName === 'Fragrancex' ? yup.string().notRequired('API Access ID is required') : yup.string().notRequired(),

      Password: vendorName === 'Rsr' ? yup.string().required('API Access Key is required'): vendorName === 'Fragrancex' ? yup.string().notRequired('API Access Key is required'): yup.string().notRequired(),

      POS: vendorName === 'Rsr' ? yup.string().required('POS is required') : vendorName === 'Fragrancex'
          ? yup.string().notRequired('POS is required') : yup.string().notRequired(),

      apiAccessId: vendorName === 'Fragrancex' ? yup.string().required('API Access ID is required'): yup.string().notRequired(),

      apiAccessKey: vendorName === 'Fragrancex' ? yup.string().required('API Access Key is required') : yup.string().notRequired(),
    });
  };

  const Schema = createSchema(vendor_name);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(Schema)
  });

  const togglePasswordVisibility = (field) => {
    if (field === 'ftp_password' || field == 'password') {
      setConfirmVisible(!confirmVisible);
    }
  };

  const endpoint = 'https://service.swiftsuite.app/vendor/vendor-enrolment-test/';  

  const onSubmit = async (data) => {
    setMyLoader(true);
    const enrolment = matchedVendor?.enrollment || {};
    
    const payload = {
      vendor_name: vendor_name,
      ftp_username: data.ftp_username,
      ftp_password: data.ftp_password,
      host: data.host,

      ...(vendor_name === 'Fragrancex' && {
        apiAccessId: data.apiAccessId,
        apiAccessKey: data.apiAccessKey,
      }),

      ...(vendor_name === 'Rsr' && {
        vendor_name: "RSR",
        Username: data.Username,
        Password: data.Password,
        POS: 'I'
      }),
    };

    try {
      const response = await fpiCredential(payload);
      localStorage.setItem('connection', JSON.stringify(response.data));
      setMyLoader(false);
      toast.success("Connection Successful!");
      setDispatchCheck(true);
    } catch (error) {
      setMyLoader(false);
      const errorMessage = error.response?.data?.detail || "Connection not Successful!";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (matchedVendor) {
      const enrolment = matchedVendor.enrollment || {}
      setValue("host", enrolment.host);
      setValue("ftp_username", enrolment.ftp_username);
    }
  }, [matchedVendor, setValue]);

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleNext = () => {
    setCurrentStep(1); 
  };

  return (
    <>
      <section className='bg-[#E7F2ED] h-screen'>
        <div className='bg-white mt-8 py-3 shadow'>
          <h1 className='lg:ps-16 ps-5 py-2 border-b border-gray-500 font-bold'>FTP/API Credentials</h1>
          {vendor_name === 'Fragrancex' ? (
            <form action="" className='lg:mx-20 mx-5' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Vendor Name:</h3>
                  <input
                    {...register("vendor_name", { required: true })}
                    type="text"
                    disabled
                    value={vendor_name || ''}
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.vendor_name ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.vendor_name && <span>This field is required</span>}</small>
                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Api Access Id:</h3>
                  <input
                    {...register("apiAccessId", { required: true })}
                    type='text'
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.apiAccessId ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.apiAccessId && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Api Access Key:</h3>
                  <input
                    {...register("apiAccessKey", { required: true })}
                    type='text'
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.apiAccessKey ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.apiAccessKey && <span>This field is required</span>}</small>
              </div>
              <div className='flex flex-col my-10 gap-8 w-2/3 mx-auto'>
                <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-12 lg:gap-10'>
                  <button onClick={handlePrevious} className='border hover:bg-[#089451] hover:text-white border-[#089451] font-semibold py-1 rounded'>Previous</button>
                  <div>
                    {myLoader ? <img src={gif} alt="" className='w-[25px] lg:ms-20 mt-2 md:ms-10 ms-10' /> : dispatchCheck ? '' : <button className='border hover:text-[#089451] hover:bg-white hover:border-[#089451] bg-[#089451] lg:w-40 md:w-40 w-32 text-white font-semibold py-1 rounded'>Test Connect</button>}
                    {dispatchCheck && <button type="button" onClick={handleNext} className='border border-[#089451] font-semibold py-1 px-10 rounded hover:text-white hover:bg-[#089451]'>Next</button>}
                  </div>
                </div>
              </div>
              <Toaster position="top-right" />
            </form>
          ) : vendor_name === 'Rsr' ? (
            <form action="" className='lg:mx-20 mx-5' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Vendor Name:</h3>
                  <input
                    {...register("vendor_name", { required: true })}
                    type="text"
                    disabled
                    value={vendor_name || ''}
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.vendor_name ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.vendor_name && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Username:</h3>
                  <input
                    {...register("Username", { required: true })}
                    type="text"
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.Username ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 lg:ms-[55%] ms-[40%]'>{errors.Username && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5 relative'>
                  <h3 className='font-semibold'>Password:</h3>
                  <input
                    {...register("Password", { required: true })}
                    type={confirmVisible ? 'text' : 'password'}
                    className={`border border-black focus:outline-none py-1 rounded p-3 h-[35px] w-[60%] lg:w-[50%] ${errors.Password ? 'border-red-500' : ''}`}
                  />
                  <span onClick={() => togglePasswordVisibility('password')} className='absolute right-[3%] top-[26%]'>
                    {!confirmVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
                  </span>
                </div>
                <small className='text-red-600 lg:ms-[55%] ms-[40%]'>{errors.Password && <span>This field is required</span>}</small>


                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>POS:</h3>
                  <input
                    {...register("POS", { required: true })}
                    type="text"
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.POS ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 lg:ms-[55%] ms-[40%]'>{errors.POS && <span>This field is required</span>}</small>
              </div>
              <div className='flex flex-col my-10 gap-8 w-2/3 mx-auto'>
                <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-12 lg:gap-10'>
                  <button onClick={handlePrevious} className='border hover:bg-[#089451] hover:text-white border-[#089451] font-semibold py-1 rounded'>Previous</button>
                  <div>
                    {myLoader ? <img src={gif} alt="" className='w-[25px] lg:ms-20 mt-2 md:ms-10 ms-10' /> : dispatchCheck ? '' : <button className='border hover:text-[#089451] hover:bg-white hover:border-[#089451] bg-[#089451] lg:w-40 md:w-40 w-32 text-white font-semibold py-1 rounded'>Test Connect</button>}
                    {dispatchCheck && <button type="button" onClick={handleNext} className='border border-[#089451] font-semibold py-1 px-10 rounded hover:text-white hover:bg-[#089451]'>Next</button>}
                  </div>
                </div>
              </div>
              <Toaster position="top-right" />
            </form>
          ) : (
            <form action="" className='lg:mx-20 mx-5' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Vendor Name:</h3>
                  <input
                    {...register("vendor_name", { required: true })}
                    type="text"
                    disabled
                    value={vendor_name || ''}
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.vendor_name ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.vendor_name && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>Host:</h3>
                  <input
                    {...register("host", { required: true })}
                    type='text'
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.host ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 ms-[42%] lg:ms-[55%]'>{errors.host && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5'>
                  <h3 className='font-semibold'>FTP Username:</h3>
                  <input
                    {...register("ftp_username", { required: true })}
                    type="text"
                    className={`border border-black focus:outline-none py-1 rounded h-[35px] p-3 w-[60%] lg:w-[50%] ${errors.ftp_username ? 'border-red-500' : ''}`}
                  />
                </div>
                <small className='text-red-600 lg:ms-[55%] ms-[40%]'>{errors.ftp_username && <span>This field is required</span>}</small>

                <div className='flex justify-between mt-5 relative'>
                  <h3 className='font-semibold'>FTP Password:</h3>
                  <input
                    {...register("ftp_password", { required: true })}
                    type={confirmVisible ? 'text' : 'password'}
                    className={`border border-black focus:outline-none py-1 rounded p-3 h-[35px] w-[60%] lg:w-[50%] ${errors.ftp_password ? 'border-red-500' : ''}`}
                  />
                  <span onClick={() => togglePasswordVisibility('ftp_password')} className='absolute right-[3%] top-[26%]'>
                    {!confirmVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
                  </span>
                </div>
                <small className='text-red-600 lg:ms-[55%] ms-[40%]'>{errors.ftp_password && <span>This field is required</span>}</small>
              </div>
              <div className='flex flex-col my-10 gap-8 w-2/3 mx-auto'>
                <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-12 lg:gap-10'>
                  <button type="button" onClick={handlePrevious} className='border hover:bg-[#089451] hover:text-white border-[#089451] font-semibold py-1 rounded'>Previous</button>
                  <div>
                    {myLoader ? <img src={gif} alt="" className='w-[25px] lg:ms-20 mt-2 md:ms-10 ms-10' /> : dispatchCheck ? '' : <button className='border hover:text-[#089451] hover:bg-white hover:border-[#089451] bg-[#089451] lg:w-40 md:w-40 w-32 text-white font-semibold py-1 rounded'>Test Connect</button>}
                    {dispatchCheck && <button type="button" onClick={handleNext} className='border border-[#089451] font-semibold py-1 px-10 rounded hover:text-white hover:bg-[#089451]'>Next</button>}
                  </div>
                </div>
              </div>
              <Toaster position="top-right" />
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default EditFpi;
