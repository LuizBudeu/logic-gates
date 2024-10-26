import Core from "../controllers/canvas/core.js";
import styled from 'styled-components';
import React, { useRef, useEffect } from 'react';
import { useAxiosWithToken } from "../utils/UseAxiosWithToken";

export function CustomCanvas() {
  const canvasRef = useRef(null);
  const hasCore = useRef(null);
  const [axios, hasToken] = useAxiosWithToken();

  useEffect(() => {
    if(!hasCore.current){
      hasCore.current = true;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Inicializa o objeto core se necessário
      const core = new Core(canvas, ctx, axios);
      core.start();
    }
    
  }, []);

  return (
    <CanvasStyle 
      ref={canvasRef} 
      id="circuit-canvas" 
      className="canvas-content" 
    />
  );
}

const CanvasStyle = styled.canvas`
  width: 100%;
  height: 100%; 
  display: block;
`;