

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/config/config"
import { Link, useNavigate } from "react-router-dom"  

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const navigate = useNavigate()  

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview(null)
      return
    }
    const url = URL.createObjectURL(avatar)
    setAvatarPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [avatar])

  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null)
      return
    }
    const url = URL.createObjectURL(coverImage)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverImage])

  const missingFields = useMemo(() => {
    const missing: string[] = []
    if (!fullName) missing.push("Full name")
    if (!username) missing.push("Username")
    if (!email) missing.push("Email")
    if (!password) missing.push("Password")
    if (!avatar) missing.push("Avatar")
    if (!coverImage) missing.push("Cover image")
    return missing
  }, [fullName, username, email, password, avatar, coverImage])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (missingFields.length > 0) {
      toast.error(`Please add: ${missingFields.join(", ")}`)
      return
    }

    const form = new FormData()
    form.append("avatar", avatar as File)
    form.append("coverImage", coverImage as File)
    form.append("username", username)
    form.append("password", password)
    form.append("fullName", fullName)
    form.append("email", email)

    try {
      setIsSubmitting(true)
      const res = await axios.post(`${API_URL}/users/register`, form)
      if (res.status === 200 || res.status===201) {
        toast.success("Signup successful!")
        setEmail("")
        setUserName("")
        setFullName("")
        setPassword("")
        setAvatar(null)
        setCoverImage(null)
        navigate("/signin")
      }
    } catch (err: unknown) {
      console.error(err)
      toast.error("Signup failed. Please check your details and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl ">
      <CardHeader className="pb-2">
        <CardTitle className="text-balance">Create your account</CardTitle>
        <CardDescription>Upload your cover and avatar, then fill in your details.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <label
            htmlFor="cover"
            className="group h-30 relative block w-full aspect-[16/9] overflow-hidden rounded-md border bg-muted cursor-pointer"
            aria-label="Upload cover image"
            title="Upload cover image"
          >

            {coverPreview ? (
              <img
                src={coverPreview || "/placeholder.svg"}
                alt="Cover preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.01]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-sm text-muted-foreground">
                <span className="font-medium">Click to upload cover (16:9)</span>
                <span className="mt-1 text-xs">PNG, JPG, or WEBP</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 ring-0 transition group-hover:ring-2 group-hover:ring-primary/40" />
          </label>

          <div className="pointer-events-none absolute -bottom-8 left-4">
            <label
              htmlFor="avatar"
              className="pointer-events-auto block h-20 w-20 overflow-hidden rounded-full border-2 border-background ring-2 ring-background cursor-pointer"
              aria-label="Upload avatar"
              title="Upload avatar"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  Avatar
                </div>
              )}
            </label>
          </div>

          <input
            id="cover"
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const files = e.currentTarget.files
              setCoverImage(files && files.length > 0 ? files[0] : null)
            }}
          />
          <input
            id="avatar"
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const files = e.currentTarget.files
              setAvatar(files && files.length > 0 ? files[0] : null)
            }}
          />
        </div>

        {/* Spacer to accommodate avatar overlap */}
        <div className="h-12" />

        {/* Form fields */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                minLength={6}
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <CardFooter className="mt-2 flex-col gap-2 px-0">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Signup"}
            </Button>
            <Button type="button" variant="outline" className="w-full bg-transparent">
              Login with Google
            </Button>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-medium underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
  