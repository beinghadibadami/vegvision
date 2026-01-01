
import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Carrot, Leaf, Banana, Cherry, Grape } from 'lucide-react';

const BackgroundElements = () => {
    // Random starting positions and animation delays
    const elements = [
        { Icon: Apple, color: 'text-green-200', x: '10%', y: '20%', delay: 0, duration: 25 },
        { Icon: Carrot, color: 'text-orange-200', x: '85%', y: '15%', delay: 5, duration: 28 },
        { Icon: Leaf, color: 'text-green-300', x: '75%', y: '60%', delay: 2, duration: 30 },
        // Using generic circles/blobs for a softer background feel
        { type: 'blob', color: 'bg-green-300/20', width: 400, height: 400, x: -100, y: -100, duration: 40 },
        { type: 'blob', color: 'bg-orange-300/20', width: 300, height: 300, x: '80%', y: '40%', duration: 35 },
        { type: 'blob', color: 'bg-yellow-200/20', width: 350, height: 350, x: '20%', y: '80%', duration: 45 },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Gradient Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-orange-50/50" />

            {/* Floating Blobs */}
            {elements
                .filter((el) => el.type === 'blob')
                .map((el, i) => (
                    <motion.div
                        key={`blob-${i}`}
                        className={`absolute rounded-full blur-3xl ${el.color}`}
                        style={{ width: el.width, height: el.height }}
                        initial={{ x: el.x, y: el.y, opacity: 0 }}
                        animate={{
                            x: [el.x, typeof el.x === 'string' ? `calc(${el.x} + 50px)` : (el.x as number) + 50, el.x],
                            y: [el.y, typeof el.y === 'string' ? `calc(${el.y} - 50px)` : (el.y as number) - 50, el.y],
                            opacity: 0.6,
                        }}
                        transition={{
                            duration: el.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

            {/* Floating Icons */}
            {elements
                .filter((el) => !el.type)
                .map((el, i) => {
                    const Icon = el.Icon as React.ElementType;
                    return (
                        <motion.div
                            key={`icon-${i}`}
                            className={`absolute ${el.color} opacity-40`}
                            initial={{ x: el.x, y: el.y, rotate: 0 }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: el.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: el.delay,
                            }}
                            style={{
                                left: el.x,
                                top: el.y,
                            }}
                        >
                            <Icon size={64} />
                        </motion.div>
                    );
                })}

            {/* Interactive Grid or Dots Pattern (Optional subtle texture) */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
    );
};

export default BackgroundElements;
