import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

export default function VantaBackground() {
  const elRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    if (!elRef.current || vantaRef.current) return;
    vantaRef.current = WAVES({
      el: elRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x6366f1,
      shininess: 30,
      waveHeight: 15,
      waveSpeed: 0.75,
      zoom: 1,
    });

    return () => {
      if (vantaRef.current) vantaRef.current.destroy();
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="fixed inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none"
      style={{ top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}
