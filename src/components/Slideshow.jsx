import { useState, useEffect } from "react";

export default function Slideshow({ images = [], interval = 3000 }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (images.length === 0) return; // don't start autoplay yet

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    if (!images || images.length === 0) {
        return <div className="text-center p-4">Loading slideshow...</div>;
    }

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
            <img
                src={images[current]}
                alt={`Slide ${current + 1}`}
                className="w-full h-64 object-cover transition-all duration-500"
            />

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
            >
                ‹
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
            >
                ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${
                            current === i ? "bg-white" : "bg-gray-400"
                        }`}
                    ></span>
                ))}
            </div>
        </div>
    );
}
