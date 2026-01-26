import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import '../css/HomePage.css'
import 'tailwindcss'

const HomePage = () => {
    return (
        <>
            <Navbar />
            <main>
                <div className="container mx-auto px-4">
                    <h1 className="font-montserrat">
                        <span className="">
                            Добро пожаловать в{" "}
                        </span>
                        <span className="relative">
                            <span className="absolute -inset-1 bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 rounded-lg blur opacity-15 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></span>
                            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-stone-800 via-stone-700 to-amber-800 animate-gradient">
                                Orbit!
                            </span>
                        </span>
                    </h1>
                    {/* <ProductList /> */}
                </div>
                <Carousel />
            </main>
            <Footer />
        </>
    )
}

export default HomePage;