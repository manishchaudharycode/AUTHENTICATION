import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center min-h-screen w-full flex-col gap-4'>
      <h1 className="text-xl">Welcom To YouTube</h1>
        <LoginForm/>
    </main>
  )
}
