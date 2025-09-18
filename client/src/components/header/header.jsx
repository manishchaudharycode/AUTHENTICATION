

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button"; // reuse your button component


const navLinks= [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
  {name: "Login", href: "/Login"}
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className=" top-0 z-50  backdrop-blur-md border-b border-gray-200 bg-zinc-800 w-full h-screen dark:bg-gray-900/80 dark:border-gray-800 bg-[url('https://imgs.search.brave.com/oDW-1wBpr6MqQ0cCSUc4JLpnQYDnJz1Wi-lhpADXQIc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWd2/My5mb3Rvci5jb20v/aW1hZ2VzL2dhbGxl/cnkvZmVhdHVyZS1i/YWNrZ3JvdW5kLWdh/bGxlcnktbWFyYmxl/LWluay0xLmpwZw')] bg-cover ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              MyBrand
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

           

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
