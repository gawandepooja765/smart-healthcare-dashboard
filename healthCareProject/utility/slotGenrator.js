const generateSlots = (startTime, endTime, duration) => {
  const slots = [];

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  let start = toMinutes(startTime);
  const end = toMinutes(endTime);

  // ✅ Prevent overflow slot
  while (start + duration <= end) {
    slots.push({
      startTime: toTime(start),
      endTime: toTime(start + duration)
    });

    start += duration;
  }

  return slots;
};

export default generateSlots;