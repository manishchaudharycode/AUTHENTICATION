import { MenuIcon, SearchIcon } from "lucide-react";
import YouTubeIcon from "@mui/icons-material/YouTube";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import Button from "@mui/material/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClickMode = () => {
    setOpen((prev) => !prev); //
  };

  return (
    <div className="navbar flex  mt-5 ">
      <div className=" flex items-center gap-6  ml-12">
        <div className="">
          <MenuIcon />
        </div>
        <div className="flex items-center ">
          <YouTubeIcon fontSize="large" className="text-red-700 " />
          YouTube
        </div>
      </div>
      <div className="flex  ">
        <div className="flex items-center ml-60  ">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none bg-transparent border rounded-bl-full rounded-tl-full  px-3 py-1 w-140 "
          />
          <div className="border py-1 px-5  rounded-br-full rounded-tr-full bg-neutral-600/95 text-black ">
            <SearchIcon className="text-white" />
          </div>
          <div className="flex border outline-none p-1 bg-neutral-600 rounded-full ml-6">
            <KeyboardVoiceIcon />
          </div>
        </div>
      </div>
      <div className="flex  items-center ml-32 gap-10">
        <VideoCallIcon fontSize="large" />
        <NotificationsIcon fontSize="large" />
        <img
          onClick={handleClickMode}
          src="https://imgs.search.brave.com/zMHdiWHkzhpWvwSuznZrhKA_X-P3omVlmVrR_Id4hf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE2LzA1LzQ1LzM2/LzM2MF9GXzE2MDU0/NTM2MTlfZGxOUWFl/ZjNCbmEwdTdKRTVV/blpmUmp6clRxeVlr/WWguanBn"
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        {open && (
          <div className="absolute top-14 right-0 bg-neutral-600 mr-10 shadow-lg rounded-lg w-32 flex flex-col text-center py-2">

              <Button className="py-3 hover:bg-neutral-400 ">Login</Button>
          

           <button className=" py-3 hover:bg-neutral-400">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
