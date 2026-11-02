import Footer from "../../components/Footer/Footer"
import About from "./About"
import CareerAudienceSection from "./CareerAudienceSection"
import CareerCTASection from "./CareerCTASection"
import FeaturesSection from "./FeaturesSection"
import HeroSection from "./HeroSection"
import JobsSection from "./JobsSection"
import WorksSection from "./WorksSection"

function Home(){

    

    return(
        <>
        <HeroSection />
        <About/>
        <FeaturesSection />
        <WorksSection />
        <JobsSection/>
        <CareerAudienceSection/>
        <CareerCTASection/>
        <Footer/>
        </>
    )
}

export default Home