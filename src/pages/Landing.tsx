export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/bg2.png')] bg-cover bg-center">
            <div className="translate-y-[-50px] text-center">
                <h1 className="font-serif
                    text-8xl font-bold tracking-tight bg-gradient-to-r
                    from-green-500 via-green-400 to-green-200 bg-clip-text text-transparent">
                    CampusVoice
                </h1>
                <p className="
                    mt-1 text-xl font-semibold text-white tracking-tight">
                    Your Campus, Your Voice
                </p>
                <p className="
                    mt-4 text-2xl font-semibold text-white max-w-4xl">
                    A community-driven platform where students can raise issues, share feedback, and work together to improve campus life.
                </p>
                <div className="flex text-center justify-center space-x-4">
                    <button className="
                        mt-4 px-5 py-2 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-xl
                        hover:bg-green-700 hover:scale-105 transform transition duration-300">
                        Login
                    </button>
                    <button className="
                        mt-4 px-5 py-2 bg-green-400 text-white text-lg font-semibold rounded-lg shadow-xl
                        hover:bg-green-600 hover:scale-105 transform transition duration-300">
                        PlaceHolder
                    </button>
                </div>
            </div>
        </div>
    )
}