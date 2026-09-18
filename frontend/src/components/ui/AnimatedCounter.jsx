import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ 
  value = 0, 
  duration = 1.2,
  formatThousands = true 
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = Number(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease-out cubic formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  if (formatThousands) {
    return <span>{displayValue.toLocaleString()}</span>;
  }

  return <span>{displayValue}</span>;
}
