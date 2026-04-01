// import { useEffect } from 'react';

// const CHATRA_ID = import.meta.env.VITE_CHATRA_ID;
// const ChatWidget = () => {
//   useEffect(() => {
//     (function(d, w, c) {
//       w.ChatraID = w.ChatraID || CHATRA_ID;
//       var s = d.createElement('script');
//       w[c] = w[c] || function() {
//         (w[c].q = w[c].q || []).push(arguments);
//       };
//       s.async = true;
//       s.src = 'https://call.chatra.io/chatra.js';
//       if (d.head) d.head.appendChild(s);
//     })(document, window, 'Chatra');
//   }, []);

//   return (
//     <div className="chat-page-container h-screen bg-gradient-to-br from-green-50 to-green-100 text-gray-800">
//       <div className="chat-box-container lg:ms-[40%] rounded-lg shadow-lg bg-white p-8 w-full max-w-lg text-gray-900">
        
//         <header className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-semibold text-green-600">Chat Support</h1>
//           <span className="text-sm text-gray-500">We're here to help!</span>
//         </header>
        
//         <div className="chat-box-content mb-6 space-y-4">
//           <p className="welcome-message text-lg font-medium">
//             Hello! 👋 Need assistance? You’re in the right place.
//           </p>
//           <p className="text-base text-gray-600">
//             Our support team is ready to assist you with any questions or issues.
//           </p>
//           <p className="text-base text-gray-600">
//             Click the chat button below to start your conversation, and we’ll get back to you shortly!
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ChatWidget;
