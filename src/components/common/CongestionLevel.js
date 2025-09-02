import React from 'react';

const CongestionLevel = ({ level }) => {
  const getColor = () => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLabel = () => {
    if (level < 30) return 'Clear';
    if (level < 70) return 'Moderate';
    return 'Heavy';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getColor()}`}></div>
      <span className="text-sm font-medium">{getLabel()}</span>
      <span className="text-xs text-gray-500">({level}%)</span>
    </div>
  );
};

export default CongestionLevel;
