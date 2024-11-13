import React, {useEffect, useRef} from "react";
import styled from 'styled-components';

export function Container({ title, children}) {

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <h2>{title}</h2>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalContainer>
  );
}

/* Modal */
const ModalContainer = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  align-content: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #1E1E1E;
  margin: auto;
  padding: 0;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  animation-name: animatetop;
  animation-duration: 0.4s;
  width: 70vh;
  border-radius: 30px;
  color: white;
  font-family: "inter";
`;

const Close = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
`;

const ModalHeader = styled.div`
  padding: 2px 16px;
  text-align: center;
  font-size: 20px;
`;

const ModalBody = styled.div`
  padding: 2px 16px 16px 16px;
  overflow: auto;
  max-height: 80%;
  align-items: center;
`;