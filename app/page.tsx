import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">Citizen Engagement Platform</h1>
          <p className="mt-4 text-lg text-white md:text-xl">Connecting citizens with their local government services</p>
          <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-primary">Submit Complaints</h2>
            <p className="text-gray-600">Easily submit and track complaints to your local government organizations.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-secondary">Track Progress</h2>
            <p className="text-gray-600">Follow the progress of your complaints in real-time as they are processed.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-primary">Get Results</h2>
            <p className="text-gray-600">
              Receive timely responses and solutions from your local government organizations.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
