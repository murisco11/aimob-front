import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { PainPoints } from "@/components/landing/pain-points"
import { SystemPreview } from "@/components/landing/system-preview"
import { Features } from "@/components/landing/features"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { ContactFooter } from "@/components/landing/contact-footer"

export default function Page() {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true })
        }
    }, [isAuthenticated, navigate])

    return (
        <main>
            <Navbar />
            <Hero />
            <PainPoints />
            <SystemPreview />
            <Features />
            <Testimonials />
            <Pricing />
            <ContactFooter />
        </main>
    )
}
