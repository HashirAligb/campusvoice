import Navbar from "@/components/Navbar"

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <Navbar />
            <div className="flex flex-1 items-start gap-6 px-10 mx-auto max-w-7xl w-full">
                <div className="w-64 sticky">
                    Sidebar
                </div>
                <div className="flex-1 max-w-2xl">
                    Posts
                </div>
                <div className="w-80 sticky">
                    Card
                </div>
            </div>
        </div>
    )
}