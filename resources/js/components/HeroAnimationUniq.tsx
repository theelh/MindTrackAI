import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroAnimationProps {
  imageBaseUrl: string; // folder URL where images are stored
  totalFrames: number;  // number of frames
  scale?: number;       // optional scaling
}

const HeroAnimationUniq: React.FC<HeroAnimationProps> = ({
  imageBaseUrl,
  totalFrames,
  scale = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ frame: 0 });
  const renderRequested = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Resize canvas to reduce GPU load
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Preload all images
    const loadImages = () =>
      Promise.all(
        Array.from({ length: totalFrames }, (_, i) => {
          return new Promise(resolve => {
            const img = new Image();
            const frame = (i + 1).toString().padStart(4, "0");
            img.src = `${imageBaseUrl}/${frame}.png`; // Use JPEG for smaller size
            img.onload = () => resolve(img);
            imagesRef.current[i] = img;
          });
        })
      );

    // Render using requestAnimationFrame for smoothness
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const img = imagesRef.current[frameRef.current.frame];
      if (img) context.drawImage(img, 0, 0, canvas.width, canvas.height);
      renderRequested.current = false;
    };

    const requestRender = () => {
      if (!renderRequested.current) {
        renderRequested.current = true;
        requestAnimationFrame(render);
      }
    };

    loadImages().then(() => {
      // Draw first frame
      const firstImg = imagesRef.current[0];
      if (firstImg) context.drawImage(firstImg, 0, 0, canvas.width, canvas.height);

      // GSAP ScrollTrigger
      gsap.to(frameRef.current, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=2300", // Animation du haut jusqu’en bas de la page
        scrub: 2,
        anticipatePin: 1,
        invalidateOnRefresh: true
      },
      onUpdate: requestRender
    });
    });

    // Optional: handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      requestRender();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, [imageBaseUrl, totalFrames, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        margin: "0 auto",
        position: "absolute",
        width: "80%",
        height: "100%",
        top: 0,
        bottom: 0,
        backgroundAttachment: "fixed",
        padding: "50px"
      }}
    />
  );
};

export default HeroAnimationUniq;