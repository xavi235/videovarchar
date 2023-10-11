import React from 'react';
import { Breadcrumb} from 'antd';


export const imgFormato = () => {
  const imagenStyle = {
    position: 'absolute',
    top: '0px', 
    left: '10px', 
  };
  const imagenStyle2 = {
    position: 'absolute',
    top: '0px',
    left: '50%', 
    transform: 'translateX(-50%)', 
    
  };
  

  return (
    <div style={{backgroundColor: '#F2A07B'}}>
    <img
        src="/src/assets/logo.png" 
        alt="Logo de la aplicacion"
        width={120}
        style={imagenStyle}
    />
    <img
      src="/src/assets/banner.jpeg" 
      alt="Banner de la aplicacion"
      height={120}
      style={imagenStyle2}
    />

    <Breadcrumb
          style={{
            margin: '60px 0',
          }}
        >
    </Breadcrumb>
    </div>
  );
}
export default imgFormato