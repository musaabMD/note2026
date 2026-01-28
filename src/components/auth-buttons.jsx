"use client"

import { useState, useEffect } from "react"
import { SignedIn, SignedOut, UserButton, SignUp, useUser } from "@clerk/nextjs"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog"

export function AuthButtons() {
  const [signUpOpen, setSignUpOpen] = useState(false)
  const { isSignedIn } = useUser()

  // Close modal when user signs in
  useEffect(() => {
    if (isSignedIn) {
      setSignUpOpen(false)
    }
  }, [isSignedIn])

  return (
    <>
      <SignedOut>
        <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-black text-white border-black hover:bg-black/90 hover:text-white"
            >
              Start
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[440px] p-0 overflow-hidden border-0 bg-transparent shadow-none" hideCloseButton>
            <div className="overflow-y-auto max-h-[90vh]">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-xl rounded-lg",
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
