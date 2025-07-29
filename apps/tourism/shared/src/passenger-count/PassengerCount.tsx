const PASSENGER_TYPES = [
  {
    name: 'adult',
    label: 'بزرگسال',
    min: 1,
    max: 10,
  },
];

export const PassengerCount = () => {
  return (
    <div>
      <h2>تعداد مسافر</h2>
      {PASSENGER_TYPES.map((type) => (
        <div key={type.name}>
          <label>
            {type.label} ({type.min} - {type.max})
          </label>
          <input
            type="number"
            name={`passenger-${type.name}`}
            min={type.min}
            max={type.max}
            placeholder={`تعداد ${type.label}`}
            className="border p-2 rounded"
          />
        </div>
      ))}
    </div>
  );
};
