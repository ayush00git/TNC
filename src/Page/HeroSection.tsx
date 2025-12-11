import FaultyTerminal from "../components/FaultyTerminal";
import TextType from "../components/TextType";

function HeroSection() {
  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={2.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={1}
            dither={0}
            curvature={0.2}
            tint="#a7ef9e"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={true}
            brightness={0.35}
          />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center gap-2 px-6 pointer-events-none">
          <h1 className="font-monda text-white text-3xl md:text-6xl lg:text-8xl tracking-wide leading-tight pointer-events-auto">
            <TextType
              text={[
                "A community for devlopers\nby devlopers..",
              ]}
              typingSpeed={75}
              pauseDuration={9000}
              showCursor={true}
              cursorCharacter="|"
            />
          </h1>
          <button className="border-2 cursor-pointer px-12 py-3 rounded-full border-green-500 text-green-500 mt-4 font-monda bg-[#315630] hover:bg-black hover:text-green pointer-events-auto">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
