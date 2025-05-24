// src/components/Logo.jsx - Componente do Logo Viajarte
import React from 'react';

// SVG da mala com avião baseado na imagem fornecida
const SuitcaseLogo = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    style={{ display: 'inline-block' }}
  >
    {/* Fundo da mala */}
    <rect 
      x="15" 
      y="25" 
      width="60" 
      height="50" 
      rx="8" 
      ry="8" 
      fill="#A4B494" 
      stroke="#8FA085" 
      strokeWidth="1"
    />
    
    {/* Alça da mala */}
    <path 
      d="M 35 25 Q 35 15 50 15 Q 65 15 65 25" 
      stroke="#8FA085" 
      strokeWidth="3" 
      fill="none"
    />
    
    {/* Ondas decorativas dentro da mala */}
    <path 
      d="M 20 35 Q 30 40 40 35 Q 50 30 60 35 Q 70 40 75 35" 
      stroke="#7C9A92" 
      strokeWidth="3" 
      fill="none"
    />
    
    <path 
      d="M 20 45 Q 35 55 50 45 Q 65 35 75 45" 
      stroke="#D9A6A0" 
      strokeWidth="4" 
      fill="none"
    />
    
    <path 
      d="M 20 55 Q 30 50 45 55 Q 60 60 75 55" 
      stroke="#EAC8C2" 
      strokeWidth="3" 
      fill="none"
    />
    
    {/* Avião de papel */}
    <g transform="translate(65, 20) rotate(45)">
      <path 
        d="M 0 0 L 12 3 L 8 8 L 12 12 L 0 8 L -4 12 L -2 8 L -4 4 Z" 
        fill="#7C9A92"
        stroke="#6B8A82"
        strokeWidth="0.5"
      />
    </g>
    
    {/* Detalhes da mala */}
    <circle cx="25" cy="35" r="1.5" fill="#6B8A82" />
    <circle cx="25" cy="65" r="1.5" fill="#6B8A82" />
    <rect x="68" y="45" width="4" height="8" rx="2" fill="#6B8A82" />
  </svg>
);

// Componente principal do Logo
const Logo = ({ 
  size = "medium", 
  showText = true, 
  onClick = null,
  color = "default",
  className = "" 
}) => {
  // Definir tamanhos
  const sizes = {
    small: { icon: 24, text: "1.2rem" },
    medium: { icon: 40, text: "1.8rem" },
    large: { icon: 60, text: "2.5rem" },
    xlarge: { icon: 80, text: "3rem" }
  };
  
  const currentSize = sizes[size] || sizes.medium;
  
  // Definir cores
  const colors = {
    default: "#2C3639",
    white: "#FFFFFF",
    primary: "#7C9A92"
  };
  
  const textColor = colors[color] || colors.default;
  
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: showText ? '0.5rem' : '0',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    transition: 'all 0.3s ease'
  };
  
  const textStyle = {
    fontSize: currentSize.text,
    fontWeight: 'bold',
    fontFamily: 'Cormorant Garamond, serif',
    color: textColor,
    letterSpacing: '1px',
    margin: 0
  };
  
  return (
    <div 
      className={className}
      style={logoStyle} 
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      <SuitcaseLogo size={currentSize.icon} />
      {showText && (
        <span style={textStyle}>
          Viajarte
        </span>
      )}
    </div>
  );
};

export default Logo;