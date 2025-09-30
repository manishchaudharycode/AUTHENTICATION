import HomeIcon from "@mui/icons-material/Home";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";


export function SideNavbar() {
  return (
    <div className="w-1/15 h-screen   ">
      <div className="   gap-4  mt-2 ml-4 border w-25 px-5 py-6 rounded-xl  hover:bg-neutral-700 border-none">
        <HomeIcon fontSize="medium" className="cursor-pointer ml-2 " />
        <p className="cursor-pointer">Home</p>
      </div>
       <div className=" gap-4   ml-4 border w-25 px-5 py-6 rounded-xl  hover:bg-neutral-700 border-none">
        <SiYoutubeshorts fontSize="large" className="cursor-pointer ml-3 " />
        <p className="cursor-pointer">shorts</p>
      </div>
       <div className=" ml-1 w-27 border px-3  py-6 rounded-xl  hover:bg-neutral-700 border-none">
        <MdOutlineSubscriptions fontSize="large" className="cursor-pointer ml-7 " />
        <span className="mr-2">subscription</span>
      </div>
    </div>
  );
}
