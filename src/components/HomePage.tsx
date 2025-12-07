import Orb from "./Orb";

function HomePage() {
  return (
    <>
      <div className="relative flex flex-col text-white justify-center items-center min-h-screen bg-[#060010]">
        <div
          style={{ width: "100%", height: "600px", position: "absolute"}}
          className="z-10"
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
        <div>
            <p className="relative top-4 text-white text-2xl font-medium text-center">We’re a team of passionate <br/>learners and developers</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
