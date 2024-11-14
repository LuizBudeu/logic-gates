import Core from "../controllers/canvas/core.js";
import styled from "styled-components";
import React, { useRef, useEffect } from "react";
import { useAxiosWithToken } from "../hooks/useAxiosWithToken.js";

export function CustomCanvas() {
    const canvasRef = useRef(null);
    const hasCore = useRef(null);
    const [axios, hasToken] = useAxiosWithToken();

    useEffect(() => {
        if (!hasCore.current) {
            hasCore.current = true;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Inicializa o objeto core se necessário
            const core = new Core(canvas, ctx, axios);
            core.start();
        }
    }, []);

    useEffect(() => {
      // define a custom handler function
      // for the contextmenu event
      const handleContextMenu = (e) => {
        // prevent the right-click menu from appearing
        e.preventDefault()
      }

      // attach the event listener to 
      // the document object
      document.addEventListener("contextmenu", handleContextMenu)

      // clean up the event listener when 
      // the component unmounts
      return () => {
        document.removeEventListener("contextmenu", handleContextMenu)
      }
    }, [])

    return <CanvasStyle ref={canvasRef} id="circuit-canvas" className="canvas-content" />;
}

const CanvasStyle = styled.canvas`
    width: 100%;
    height: 100%;
    display: block;
`;
