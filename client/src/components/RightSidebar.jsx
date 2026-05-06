import React, { useEffect } from 'react'
import { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])
 

  // Get all the images from the messages and set them to state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages])


  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>

      {/* Profile Pic and Bio Section */}

      <div className='pt-2 flex flex-col items-center text-center gap-3 text-sm font-light mx-auto'>
  
  <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
    className='w-16 h-16 rounded-full object-cover'/>

  <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
    {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p> }
    {selectedUser.fullName}
  </h1>

  <p className='px-6 text-gray-300'>
    {selectedUser.bio}
  </p>

</div>

      <hr className='border-[#ffffff50] my-4'/>

      {/* Media Section */}

      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, index)=>(
            <div key={index} onClick={()=>window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md'/>

            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>logout()} className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-xs font-light py-1.5 px-10 rounded-full cursor-pointer hover:opacity-90 transition'>
        LogOut
      </button>
    </div>
  )
}

export default RightSidebar
