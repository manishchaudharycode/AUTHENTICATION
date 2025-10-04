import { useState } from "react";
import { Search, Mic, Video, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center font-semibold text-lg">
          <IconBrandYoutubeFilled className="text-red-600" />
          YouTube
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none border border-neutral-500 bg-transparent rounded-l-full px-3 py-1 w-96"
        />
        <div className="border border-neutral-500 px-5 py-1.5 rounded-r-full bg-neutral-600 text-white cursor-pointer">
          <Search className="h-5 w-5 " />
        </div>
        <div className="flex p-2 bg-neutral-600 rounded-full ml-4 cursor-pointer">
          <Mic className="h-5 w-5 text-white" />
        </div>
      </div>


      <div className="flex items-center gap-6">
        <Video className="h-7 w-7 cursor-pointer" />
        <Bell className="h-7 w-7 cursor-pointer" />

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://imgs.search.brave.com/zMHdiWHkzhpWvwSuznZrhKA_X-P3omVlmVrR_Id4hf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE2LzA1LzQ1LzM2/LzM2MF9GXzE2MDU0/NTM2MTlfZGxOUWFl/ZjNCbmEwdTdKRTVV/blpmUmp6clRxeVlr/WWguanBn" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-neutral-700 text-white">
            <DropdownMenuItem>
              <Button
                onClick={() => {
                  navigate("/sigin");
                }}
                className="w-full"
                variant="ghost"
              >
                Login
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="w-full" variant="ghost">
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
