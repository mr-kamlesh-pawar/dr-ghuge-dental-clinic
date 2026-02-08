"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Award } from "lucide-react";
import Image from "next/image";

const dentalCases = [
  {
    id: 1,
    before: "/teeth2.png",
    after: "/teeth1.png",
    title: "Porcelain Veneers Transformation",
    description: "Complete smile makeover with custom porcelain veneers",
    duration: "2 weeks",
    dentist: "Dr. Rahul Ghuge",
  },
  {
    id: 2,
    before: "/teeth3.png",
    after: "/teeth4.png",
    title: "Teeth Whitening",
    description: "Professional teeth whitening for a brighter smile",
    duration: "1 hour",
    dentist: "Dr. Rahul Ghuge",
  },
  {
    id: 3,
    before: "/teeth5.png",
    after: "/teeth6.png",
    title: "Dental Implants",
    description: "Full mouth restoration with dental implants",
    duration: "3 months",
    dentist: "Dr. Rahul Ghuge",
  },
];

export default function RealisticBeforeAfterSlider() {
  const [activeCase, setActiveCase] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const currentCase = dentalCases[activeCase];

  const nextCase = () => {
    setActiveCase((p) => (p + 1) % dentalCases.length);
    setSliderPosition(50);
  };

  const prevCase = () => {
    setActiveCase((p) => (p - 1 + dentalCases.length) % dentalCases.length);
    setSliderPosition(50);
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Real Patient Results</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Transformations That <span className="text-blue-600">Speak Volumes</span>
          </h2>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            See the life-changing results achieved by our expert dental team.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* CASE INFO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentCase.title}
              </h3>
            </div>

            <p className="text-gray-600 text-lg">
              {currentCase.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="text-xl font-semibold">{currentCase.duration}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="text-sm text-gray-500">Specialist</div>
                <div className="text-xl font-semibold">{currentCase.dentist}</div>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex items-center gap-4">
              <button onClick={prevCase} className="p-3 rounded-full border bg-white">
                <ChevronLeft />
              </button>

              <button onClick={nextCase} className="p-3 rounded-full border bg-white">
                <ChevronRight />
              </button>
            </div>
          </motion.div>

          {/* SLIDER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-8 border-white shadow-2xl">

              {/* AFTER IMAGE */}
              <Image
                src={currentCase.after}
                alt="After"
                fill
                className="object-cover"
              />

              {/* AFTER LABEL */}
              <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                AFTER
              </div>

              {/* BEFORE IMAGE (CLIP-PATH – NO RESIZE) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
              >
                <Image
                  src={currentCase.before}
                  alt="Before"
                  fill
                  className="object-cover"
                />

                <div className="absolute top-6 left-6 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                  BEFORE
                </div>
              </div>

              {/* DIVIDER LINE */}
              <div
                className="absolute top-0 bottom-0 w-[4px] bg-white shadow-xl z-20"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* HANDLE */}
              <div
                className="absolute top-1/2 w-14 h-14 bg-white rounded-full border-4 border-white shadow-2xl flex items-center justify-center z-30"
                style={{
                  left: `${sliderPosition}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <ChevronLeft className="text-blue-600" />
                <ChevronRight className="text-blue-600 -ml-2" />
              </div>

              {/* RANGE INPUT */}
              <input
                type="range"
                min={0}
                max={100}
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-40"
              />
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              Drag to compare • {Math.round(sliderPosition)}%
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
