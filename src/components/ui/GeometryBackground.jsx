import React, { useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';

export default function GeometryBackground() {
  const [init, setInit] = React.useState(false);

  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      const { loadSlim } = await import('@tsparticles/slim');
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ['#dbb462', '#f9d07a', '#402d00', '#1f1f1f'],
        },
        links: {
          color: '#dbb462',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: true,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 30,
        },
        opacity: {
          value: 0.4,
        },
        shape: {
          type: ['circle', 'triangle', 'polygon'],
          options: {
            polygon: {
              sides: 6, // Hexagons
            },
          },
        },
        size: {
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          }
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="geometry-particles"
      options={options}
      className="absolute inset-0 max-w-full z-0 h-full pointer-events-auto mix-blend-screen"
    />
  );
}
