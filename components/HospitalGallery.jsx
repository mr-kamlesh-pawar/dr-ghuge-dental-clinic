"use client";

import Image from "next/image";

export default function HospitalImageGallery() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif">
          Our Medical Facility
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="w-[98vw] max-w-7xl grid grid-cols-6 grid-rows-10 gap-4 h-[600px] md:h-[1100px]">
        {/* div1 */}
        <div className="col-span-2 row-span-2 overflow-hidden rounded-lg relative">
          <Image
            src="/g1.jpg"
            alt="Hospital entrance"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div2 */}
        <div className="row-span-2 col-start-3 overflow-hidden rounded-lg relative">
          <Image
            src="/g12.jpg"
            alt="Reception"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div3 */}
        <div className="col-span-3 row-span-2 col-start-4 overflow-hidden rounded-lg relative">
          <Image
            src="/g3.jpg"
            alt="Hospital exterior"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div4 */}
        <div className="col-span-2 row-span-2 row-start-3 overflow-hidden rounded-lg relative">
          <Image
            src="/g2.jpg"
            alt="Patient room"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div5 */}
        <div className="col-span-2 row-span-5 col-start-3 row-start-3 overflow-hidden rounded-lg relative">
          <Image
            src="/g4.jpg"
            alt="Operating room"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div6 */}
        <div className="col-span-2 row-span-3 col-start-5 row-start-3 overflow-hidden rounded-lg relative">
          <Image
            src="/g5.jpg"
            alt="Hospital corridor"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div7 */}
        <div className="col-span-2 row-span-2 row-start-5 overflow-hidden rounded-lg relative">
          <Image
            src="/g6.jpg"
            alt="Hospital bed"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div10 */}
        <div className="col-span-2 row-span-4 col-start-1 row-start-7 overflow-hidden rounded-lg relative">
          <Image
            src="/g7.jpg"
            alt="Bright hallway"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div12 */}
        <div className="col-span-2 row-span-2 col-start-5 row-start-9 overflow-hidden rounded-lg relative">
          <Image
            src="/g8.jpg"
            alt="Emergency entrance"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div13 */}
        <div className="col-span-2 row-span-3 col-start-3 row-start-8 overflow-hidden rounded-lg relative">
          <Image
            src="/g9.jpg"
            alt="Waiting area"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* div14 */}
        <div className="col-span-2 row-span-3 col-start-5 row-start-6 overflow-hidden rounded-lg relative">
          <Image
            src="/g10.jpg"
            alt="Hospital building"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}
