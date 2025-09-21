import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center font-mono justify-between px-10 py-2">
      <h3 className="text-red-400">Streamly</h3>
      <div className="flex items-center gap-10">
        <Link to={"/login"}>
          <Button>Login</Button>
        </Link>

        <Link to={"/Signup"}>
          <Button>Signup</Button>
        </Link>
        <Link to="/login" className="border-1 bg-white text-black p-1 rounded-md w-20 pl-3">Logout</Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
