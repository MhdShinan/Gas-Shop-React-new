// import { useState } from 'react'
// import { MapPin, User, Mail, Phone, ShoppingCart, X, Car, FootprintsIcon as Walking } from 'lucide-react'
// import Swal from 'sweetalert2'
// import logo from '../assets/images/1.png'

// export default function DeliveryForm({ product, onClose }) {
//   const [deliveryMode, setDeliveryMode] = useState('')
//   const [deliveryMethod, setDeliveryMethod] = useState('')
//   const [addressType, setAddressType] = useState('')
//   const [userType, setUserType] = useState('')
//   const [isEditable, setIsEditable] = useState(true)
//   const [showUserInput, setShowUserInput] = useState(false)

//   const handleClose = () => {
//     Swal.fire({
//       title: 'Closing Form',
//       text: 'You will be redirected to the main menu',
//       icon: 'info',
//       confirmButtonColor: '#0685F5'
//     }).then(() => {
//       onClose();
//     });
//   }

//   const handleOrderNow = () => {
//     Swal.fire({
//       title: 'Order Placed!',
//       text: 'Your order has been successfully placed',
//       icon: 'success',
//       confirmButtonColor: '#0685F5'
//     })
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen p-4">
//       <div className="w-[600px] h-[400px] bg-white/10 backdrop-blur-md rounded-lg p-6 overflow-y-auto">
//         <div className="space-y-4">
//           {/* Header */}
//           <div className="flex justify-center mb-6">
//             <img src={logo} alt="Uwais & Sons" className="w-70 h-20 object-contain" />
//           </div>

//           {/* Basic Info */}
//           <div className="space-y-3">
//             <div className="flex items-center bg-white/20 rounded-md p-2">
//               <User className="w-5 h-5 text-white mr-2" />
//               <input
//                 type="text"
//                 placeholder="Name"
//                 className="bg-transparent w-full text-white placeholder-white/70 outline-none"
//               />
//             </div>
//             <div className="flex items-center bg-white/20 rounded-md p-2">
//               <Mail className="w-5 h-5 text-white mr-2" />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="bg-transparent w-full text-white placeholder-white/70 outline-none"
//               />
//             </div>
//             <div className="flex items-center bg-white/20 rounded-md p-2">
//               <Phone className="w-5 h-5 text-white mr-2" />
//               <input
//                 type="tel"
//                 placeholder="Contact"
//                 className="bg-transparent w-full text-white placeholder-white/70 outline-none"
//               />
//             </div>
//           </div>

//           {/* Delivery Mode */}
//           <div className="flex gap-4">
//             <button
//               onClick={() => setDeliveryMode('takeaway')}
//               className={`flex-1 p-2 rounded-md transition-colors ${
//                 deliveryMode === 'takeaway'
//                   ? 'bg-[#0685F5] text-white'
//                   : 'bg-white text-[#0685F5]'
//               }`}
//             >
//               Take Away
//             </button>
//             <button
//               onClick={() => setDeliveryMode('delivery')}
//               className={`flex-1 p-2 rounded-md transition-colors ${
//                 deliveryMode === 'delivery'
//                   ? 'bg-[#0685F5] text-white'
//                   : 'bg-white text-[#0685F5]'
//               }`}
//             >
//               Door to Door Delivery
//             </button>
//           </div>

//           {/* Delivery Method */}
//           {deliveryMode === 'delivery' && (
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setDeliveryMethod('person')}
//                 className={`flex-1 p-2 rounded-md transition-colors ${
//                   deliveryMethod === 'person'
//                     ? 'bg-[#0685F5] text-white'
//                     : 'bg-white text-[#0685F5]'
//                 }`}
//               >
//                 <Walking className="inline mr-2" />
//                 Person
//               </button>
//               <button
//                 onClick={() => setDeliveryMethod('vehicle')}
//                 className={`flex-1 p-2 rounded-md transition-colors ${
//                   deliveryMethod === 'vehicle'
//                     ? 'bg-[#0685F5] text-white'
//                     : 'bg-white text-[#0685F5]'
//                 }`}
//               >
//                 <Car className="inline mr-2" />
//                 Vehicle
//               </button>
//             </div>
//           )}

//           {/* Address Selection */}
//           <div className="flex gap-4">
//             <button
//               onClick={() => {
//                 setAddressType('manual')
//                 setIsEditable(true)
//               }}
//               className={`flex-1 p-2 rounded-md transition-colors ${
//                 addressType === 'manual'
//                   ? 'bg-[#0685F5] text-white'
//                   : 'bg-white text-[#0685F5]'
//               }`}
//             >
//               Type address manually
//             </button>
//             <button
//               onClick={() => {
//                 setAddressType('auto')
//                 setIsEditable(false)
//               }}
//               className={`flex-1 p-2 rounded-md transition-colors ${
//                 addressType === 'auto'
//                   ? 'bg-[#0685F5] text-white'
//                   : 'bg-white text-[#0685F5]'
//               }`}
//             >
//               Fetch Automatically
//             </button>
//           </div>

//           {/* Address Input */}
//           <div className="flex items-center bg-white/20 rounded-md p-2">
//             <MapPin className="w-5 h-5 text-white mr-2" />
//             <input
//               type="text"
//               placeholder="Address"
//               disabled={!isEditable}
//               className="bg-transparent w-full text-white placeholder-white/70 outline-none disabled:cursor-not-allowed"
//             />
//           </div>

//           {/* Already Have Account */}
//           {!showUserInput && (
//             <div className="text-center mt-4">
//               <p className="text-white text-sm">
//                 Already have an account?
//               </p>
//               <button
//                 onClick={() => setShowUserInput(true)}
//                 className="mt-2 px-4 py-2 bg-[#0685F5] text-white rounded-md hover:bg-[#0038FF] transition-colors"
//               >
//                 Search
//               </button>
//             </div>
//           )}

//           {/* User Input */}
//           {showUserInput && (
//             <div className="mt-4 space-y-4">
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => setUserType('email')}
//                   className={`flex-1 p-2 rounded-md transition-colors ${
//                     userType === 'email'
//                       ? 'bg-[#0685F5] text-white'
//                       : 'bg-white text-[#0685F5]'
//                   }`}
//                 >
//                   Email
//                 </button>
//                 <button
//                   onClick={() => setUserType('number')}
//                   className={`flex-1 p-2 rounded-md transition-colors ${
//                     userType === 'number'
//                       ? 'bg-[#0685F5] text-white'
//                       : 'bg-white text-[#0685F5]'
//                   }`}
//                 >
//                   Number
//                 </button>
//               </div>

//               {userType && (
//                 <div className="flex items-center bg-white/20 rounded-md p-2">
//                   {userType === 'email' ? (
//                     <Mail className="w-5 h-5 text-white mr-2" />
//                   ) : (
//                     <Phone className="w-5 h-5 text-white mr-2" />
//                   )}
//                   <input
//                     type={userType === 'email' ? 'email' : 'tel'}
//                     placeholder={
//                       userType === 'email'
//                         ? 'example@email.com'
//                         : '+94 XX XXX XXXX'
//                     }
//                     className="bg-transparent w-full text-white placeholder-white/70 outline-none"
//                   />
//                   <button className="ml-2 px-4 py-2 bg-[#0685F5] text-white rounded-md hover:bg-[#0038FF] transition-colors">
//                     Search
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <button
//               onClick={handleOrderNow}
//               className="flex-1 bg-[#0685F5] text-white p-2 rounded-md hover:bg-[#0038FF] transition-colors"
//             >
//               <ShoppingCart className="inline mr-2" />
//               Order Now
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 bg-red-600 text-white p-2 rounded-md hover:bg-red-800 transition-colors"
//             >
//               <X className="inline mr-2" />
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
