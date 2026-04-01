import React, { useState } from 'react';
import { Button, Modal } from 'antd';
// import { ToastContainer, toast } from 'react-toastify';
import { Toaster, toast } from 'sonner';
import gif from './images/gif.gif';

const AccessModal = ({ modal2Open, authorization_code, setModal2Open, setAuthorization_code }) => {
  const userIdString = localStorage.getItem('userId');
  const userId = userIdString ? JSON.parse(userIdString) : null;
  const token = localStorage.getItem('token');
  
  const [myLoader, setMyLoader] = useState(false);

  const sendCode = async () => {
    setMyLoader(true);
    let endpoint = `https://service.swiftsuite.app/marketplaceApp/oauth/callback/${userId}/Ebay/`; 
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ authorization_code }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setMyLoader(false);    
      if (response.status === 200) {
        toast.success("Connection Successful!");
        localStorage.removeItem('connectClicked');
        setModal2Open(false);
      } else if (response.status === 400) {
        toast.error("Invalid Access Code!");
      } else if (response.status === 500) {
        toast.error("Access Code is Expired!");
      } else {
        toast.error("Connection not Successful!");
      }
    } catch (err) {
      console.error("Error response:", err.response);  
      console.error("Error message:", err.message);
      setMyLoader(false);
    }
  };

  const handleAccessChange = (event) => {
    setAuthorization_code(event.target.value); 
  };

  return (
    <>
    <Toaster position="top-right" />
    <section>
  <Modal
    title="Enter Access Code:"
    centered
    open={modal2Open}
    onCancel={() => setModal2Open(false)}
    footer={null}
  >
    <textarea 
      className="focus:outline-none w-full border-black h-40 rounded border-1" 
      onChange={handleAccessChange}
    ></textarea>
    <div className='flex justify-between'>
      <button className='border p-1 px-2 rounded-[6px] text-white font-bold hover:bg-red-900 bg-red-700 w-[80px]' onClick={() => setModal2Open(false)}>Cancel</button>
      <button className='border p-1 px-2 rounded-[7px] text-white font-bold flex justify-center bg-[#089451] hover:bg-green-800 w-[80px]' onClick={sendCode}>{myLoader?<img src={gif} alt="" width={20}/>: 'Submit'}</button>
    </div>
  </Modal>
</section>

    </>
  );
};

export default AccessModal;
