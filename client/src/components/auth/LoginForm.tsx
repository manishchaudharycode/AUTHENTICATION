"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/config/config"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"



export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please enter email and password")
      return
    }
    try {
      setIsSubmitting(true)
      const res = await axios.post(`${API_URL}/users/login`, { email, password })
      console.log(res.data);
      
      const data = res.data.data;

      if (data.accessToken && data.refreshToken) {
        try {
          localStorage.setItem("accessToken", data.accessToken)
          localStorage.setItem("refreshToken",data.refreshToken)
          toast.success("Login successful")
          navigate("/")
        } catch (error){
          console.log(error);
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Login failed. Check your credentials.")

    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <Card className="w-full  max-w-sm">
      <CardHeader>
        <CardTitle className="text-balance">Login to your account</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid gap-6">
            <div className="grid gap-2 ">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="button" variant="outline" className="w-full bg-transparent">
          Login with Google
        </Button>
        <p className="mt-2 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary font-medium underline-offset-4 hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
