"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, RotateCcw } from "lucide-react";

export default function CostEstimator() {
  // Mock pricing data
  const treatments = [
    { id: "consultation", name: "Expert Consultation", price: 500, category: "Basics" },
    { id: "xray", name: "Digital X-Ray", price: 300, category: "Basics" },
    { id: "cleaning", name: "Professional Cleaning", price: 1500, category: "Preventive" },
    { id: "whitening", name: "Teeth Whitening", price: 8000, category: "Cosmetic" },
    { id: "filling", name: "Composite Filling", price: 2000, category: "Restorative" },
    { id: "rootcanal", name: "Root Canal Treatment", price: 6000, category: "Restorative" },
    { id: "crown", name: "Ceramic Crown", price: 8500, category: "Restorative" },
    { id: "implant", name: "Dental Implant", price: 25000, category: "Surgical" },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalCost = selectedItems.reduce((sum, id) => {
    const item = treatments.find((t) => t.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const reset = () => setSelectedItems([]);

  return (
    <section className="w-full py-20 bg-blue-900 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Intro & Features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                Transparent Pricing
              </h2>
              <div className="w-20 h-1 bg-cyan-400 rounded-full mb-6"></div>
              <p className="text-blue-100 text-lg leading-relaxed">
                No hidden charges. Estimate your treatment cost instantly with our interactive calculator. 
                <br /><br />
                <span className="text-sm text-blue-300 italic">*Prices are indicative and may vary based on case complexity.</span>
              </p>
            </motion.div>

            <div className="bg-blue-800/50 p-6 rounded-2xl border border-blue-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-lg">Smart Estimation</p>
                        <p className="text-blue-200 text-sm">Select multiple treatments to see a combined estimate.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: Calculator UI */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden text-gray-800"
          >
            <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-900">Select Treatments</h3>
                <button 
                    onClick={reset}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                    disabled={selectedItems.length === 0}
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                    {treatments.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                selectedItems.includes(item.id) 
                                ? "bg-cyan-50 border-cyan-500 shadow-sm"
                                : "bg-white border-gray-100 hover:border-cyan-200 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    selectedItems.includes(item.id) ? "bg-cyan-500 border-cyan-500" : "border-gray-300"
                                }`}>
                                    {selectedItems.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm md:text-base">{item.name}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</p>
                                </div>
                            </div>
                            <p className="font-bold text-gray-700">₹{item.price.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <p className="text-blue-300 text-sm uppercase tracking-widest mb-1">Total Estimate</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-light text-cyan-400">₹</span>
                    <motion.span 
                        key={totalCost}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold"
                    >
                        {totalCost.toLocaleString()}
                    </motion.span>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
                    *Final price may vary after clinical examination.
                </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
