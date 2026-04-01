import React, { useState, useEffect } from 'react';
import { handleNextStep } from '../redux/EditVendor'; // Removed handlePreviousStep as it's not used
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const EditIdentifier = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const store = useSelector((state) => state.editVendor.enrolmentUpdate);
  const matchedVendor = localStorage.getItem('matchedVendor');
  const [myForm, setMyForm] = useState('');

  // Updated Yup schema: description is no longer required
  const Schema = yup.object().shape({
    vendor_identifier: yup.string().required('This field is required'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    let matchedVendor;
    try {
      matchedVendor = JSON.parse(localStorage.getItem('matchedVendor')) || {};
    } catch (error) {
      console.error('Error parsing matchedVendor from localStorage:', error);
      matchedVendor = {};
      // Assuming toast is imported; otherwise, remove or replace
      // toast.error('Failed to load vendor data');
    }

    const enrolment = matchedVendor.enrollment || {};
    console.log('enrolment:', enrolment.user);

    const form = {
      ...store,
      identifier: data.vendor_identifier,
      description: data.description || '', // Include description if provided
      user: enrolment.user,
      vendor: enrolment.vendor,
      id: enrolment.id,
      account: enrolment.account,
      created_at: enrolment.created_at,
      updated_at: enrolment.updated_at,
    };

    dispatch(handleNextStep(form));
  };

  // Handle Previous button navigation
  const handlePrevious = () => {
    navigate('/layout/editenrollment', { replace: false }); // Use absolute path
  };

  useEffect(() => {
    const matchedVendor = localStorage.getItem('matchedVendor');
    if (matchedVendor) {
      try {
        const myFormData = JSON.parse(matchedVendor);
        console.log('myFormData:', myFormData);
        const enrolment = myFormData?.enrollment || {};
        console.log('enrolment:', enrolment);

        setMyForm(enrolment);

        if (enrolment && Object.keys(enrolment).length > 0) {
          console.log('enrolment.identifier:', enrolment?.identifier);
          setValue('vendor_identifier', enrolment?.identifier || '');
          setValue('description', enrolment?.description || ''); // Set description if available
        } else {
          console.warn('Enrolment is empty or missing data');
        }
      } catch (error) {
        console.error('Error parsing matchedVendor from localStorage:', error);
        setMyForm({});
        setValue('vendor_identifier', '');
        setValue('description', '');
      }
    } else {
      console.warn('No matchedVendor found in localStorage.');
      setMyForm({});
      setValue('vendor_identifier', '');
      setValue('description', '');
    }
  }, [setValue]);

  return (
    <section className="bg-[#E7F2ED] h-screen">
      <div className="bg-white py-3 shadow">
        <h1 className="lg:ps-16 ps-5 py-2 border-b border-gray-500 font-bold">Identifier Page</h1>
        <form className="lg:mx-20 mx-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex justify-between my-2">
              <h3 className="font-semibold">Identifier:</h3>
              <input
                {...register('vendor_identifier')}
                type="text"
                className={`border border-black focus:outline-none py-1 rounded h-[35px] w-[60%] p-3 lg:w-[50%] ${
                  errors.vendor_identifier?.message && 'error'
                }`}
              />
            </div>
            <small className="text-red-600 ms-[42%] lg:ms-[53%]">
              {errors.vendor_identifier?.message}
            </small>
          </div>
          <div>
            <div className="flex justify-between my-2">
              <h3 className="font-semibold">Description:</h3>
              <input
                {...register('description')}
                type="text"
                className="border border-black focus:outline-none py-1 rounded h-[35px] w-[60%] p-3 lg:w-[50%]"
              />
            </div>
          </div>
          <div className="flex gap-20 justify-center my-14">
            <button
              type="button" // Changed to type="button" to prevent form submission
              onClick={handlePrevious}
              className="bg-white text-[#089451] border py-1 px-3 rounded hover:bg-[#089451] font-bold hover:text-white border-[#089451]"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-[#089451] text-white border py-1 px-5 rounded hover:bg-white font-bold hover:text-[#089451] border-[#089451]"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditIdentifier;