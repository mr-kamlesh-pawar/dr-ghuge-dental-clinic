"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceList({ services }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-6"
    >
      {services.map(({ id, name, description, image_url, is_active }) => (
        <motion.div
          key={id}
          variants={item}
          className="flex flex-col md:flex-row bg-[#fdf7f3] rounded-2xl border border-orange-200 overflow-hidden w-full hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
        >
        <div className="w-full mt-1.5 md:w-56 lg:w-64 rounded-2xl h-48 bg-[#e6dcd2] shrink-0 border-b md:border-b-0 md:border-r border-orange-100 flex items-center justify-center relative overflow-hidden group">
  <Image
    src={image_url}
    alt={name}
    fill
    sizes="(max-width: 768px) 100vw, 300px"
    className="object-cover group-hover:scale-110 transition-transform duration-500"
    priority
  />
</div>

          <div className="p-5 md:p-6 flex flex-col flex-1 justify-between gap-4">
            <div className="space-y-2">
              <p
                className={
                  is_active
                    ? "text-green-600 text-sm font-semibold uppercase tracking-wider"
                    : "text-red-500 text-sm font-semibold uppercase tracking-wider"
                }
              >
                {is_active ? "Available" : "Not available"}
              </p>

              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                {name}
              </h2>

              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex justify-end">
              <Link href={`/book-appointment?service=${name}`}>
                <button className="rounded-sm text-white bg-orange-500 cursor-pointer hover:bg-orange-600 px-4 py-1.5 text-xs font-bold uppercase shadow-sm transition-colors">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
