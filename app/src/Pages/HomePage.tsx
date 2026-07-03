import Navbar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import TechStack from '../components/TechStack';
import Footer from '../components/Footer';
import ShowCase from '../components/ShowCase';
import ProposedFeatures from '../components/ProposedFeatures';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <TechStack />
            <ShowCase />
            <ProposedFeatures />
            <Footer />
        </>
    );
}   