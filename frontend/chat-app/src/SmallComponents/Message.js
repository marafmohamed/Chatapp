import React from 'react'

import useMessage from '../hooks/useMessage'
export default function Message({message , sender,sameSender}) {

return (
<div>
{!sender ? <div className="chat chat-start">
 {!sameSender && <div className="chat-image avatar">
    <div className="w-9 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>}
  <div className="chat-header ">
  {!sameSender && <div className="chat-header font-Parr">
    {message.sender.Name}
  </div>}
  </div>
  {sameSender &&<div className="rounded-2xl  px-2 ml-12 py-2 max-w-[250px] break-words bg-gray-800/50"  >{message.content}</div>}
  {!sameSender &&<div className="rounded-2xl px-3  py-2 text-center max-w-[250px] bg-gray-800/50 break-words "  >{message.content}</div>}
</div> : <div className="chat gap-1 chat-end">
  {!sameSender &&<div className="chat-image avatar">
    <div className="w-9 rounded-full ">
      <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>}
 {!sameSender && <div className="chat-header font-Parr">
    {message.sender.Name}
  </div>}
  {!sameSender &&<div className="rounded-2xl overflow-hidden px-3 py-2  max-w-[200px] bg-bubble my-0" >{message.content}</div>}

  {sameSender &&<div className="rounded-2xl overflow-hidden mr-9 px-3 py-2  max-w-[200px] bg-bubble" >{message.content}</div>}
 
</div>}

</div>  
)
}
