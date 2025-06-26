import React from 'react';

const Input = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...rest
}) => {
  
  const baseInputStyles =
    'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm';
  
  
  const stateStyles = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500';

  const combinedClasses = `${baseInputStyles} ${stateStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={combinedClasses}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;