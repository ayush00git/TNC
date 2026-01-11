import { useEffect, useRef } from "react";
import { throttle } from "@/lib/Throttle";
import { ease, lerp } from "@/lib/Lerp";

interface Circle {
    x: number;
    y: number;
    radius: number;
}

interface Velocity {
    x: number;
    y: number;
}

export default function BlogBackground({className=""}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const RenderSettings = {
            radiusMinFactor: 0.05,// fraction of smallest dimension of screen
            radiusMaxFactor: 0.1, // fraction of largest dimension of screen
            thickness: 1,
            color: "#fff",
            velocityFactor: 0.009,
            pointCount: 20,
            lerpDurationMs: 20000,
        };

        RenderSettings.color = getComputedStyle(
            document.documentElement
        ).getPropertyValue("--color-primary-mute");

        function resizeCanvas() {
            if(!canvas || !ctx) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const circles: Circle[] = [];
        const velocities: Velocity[] = [];
        let newCircles: Circle[] = [];
        let newVelocities: Velocity[] = [];
        let lerpTime: number[] = [];
        let circlesUnderTransition = false;
        let initialCircles: Circle[] = [];

        function createPoints() {
            if(!canvas || !ctx) return;
            if (circles.length !== 0) circlesUnderTransition = true;

            initialCircles = [];
            newCircles = [];
            newVelocities = [];
            lerpTime = [];
            const minFactor = RenderSettings.radiusMinFactor;
            const maxFactor = RenderSettings.radiusMaxFactor;

            for (let i = 0; i < RenderSettings.pointCount; i++) {
                const pArr = circlesUnderTransition ? newCircles : circles;
                const vArr = circlesUnderTransition ? newVelocities : velocities;



                pArr.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: (minFactor + Math.random() * (maxFactor - minFactor)) * Math.min(canvas.width, canvas.height),
                });



                vArr.push({
                    x: (-Math.random() + Math.random()) * RenderSettings.velocityFactor,
                    y: (-Math.random() + Math.random()) * RenderSettings.velocityFactor,
                });

                lerpTime.push(0);

                if (circlesUnderTransition && circles[i]) {
                    initialCircles.push({ ...circles[i] });
                }
            }
        }

        function update() {
            if(!canvas) return;
            const dt = 16;

            if (circlesUnderTransition) {
                let stillTransitioning = false;

                for (let i = 0; i < circles.length; i++) {
                    const t = lerpTime[i];
                    if (t >= 1) continue;

                    const c = circles[i];
                    const iC = initialCircles[i];
                    const nC = newCircles[i];

                    if (!c || !iC || !nC) continue;

                    c.x = lerp(iC.x, nC.x, t, ease.linear);
                    c.y = lerp(iC.y, nC.y, t, ease.linear);
                    c.radius = lerp(iC.radius, nC.radius, t, ease.linear);

                    lerpTime[i] += dt / RenderSettings.lerpDurationMs;
                    stillTransitioning = true;
                }

                if (!stillTransitioning) circlesUnderTransition = false;
            } else {
                for (let i = 0; i < circles.length; i++) {
                    const c = circles[i];
                    const v = velocities[i];
                    if (!c || !v) continue;

                    c.x += v.x * dt;
                    c.y += v.y * dt;

                    if (c.x > canvas.width + c.radius * 2) c.x = -c.radius * 2;
                    if (c.x < -c.radius * 2) c.x = canvas.width + c.radius * 2;
                    if (c.y > canvas.height + c.radius * 2) c.y = -c.radius * 2;
                    if (c.y < -c.radius * 2) c.y = canvas.height + c.radius * 2;
                }
            }
        }

        function render() {
            if(!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = RenderSettings.color;

            for (const c of circles) {
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let rafId: number;
        function loop() {
            update();
            render();
            rafId = requestAnimationFrame(loop);
        }

        const throttledCreatePoints = throttle(createPoints, 2000);
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            throttledCreatePoints();
        });

        resizeObserver.observe(canvas);
        window.addEventListener("orientationchange", resizeCanvas);

        resizeCanvas();
        createPoints();
        loop();

        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            window.removeEventListener("orientationchange", resizeCanvas);
        };
    }, []);

    return (
        <div className={`h-full w-full ${className}`}>
            <canvas className="blur-3xl opacity-90 w-full h-full" ref={canvasRef} />
        </div>
    );
}
