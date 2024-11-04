'use client'

import React, { useEffect, useState } from 'react'

const DateTime = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const newTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const newDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).replace(/(^|\s)\S/g, (l) => l.toUpperCase());

      setTime(newTime);
      setDate(newDate);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-4xl font-extrabold lg:text-7xl'>
        {time}
      </h1>
      <p className='text-lg font-medium text-sky-1 lg:text-2xl'>
        {date}
      </p>
    </div>)
}

export default DateTime