import React, {useEffect, useRef} from "react";
import styled from 'styled-components';
import { ActivityItemModal } from "./ActivityItemModal";

function useOutsideAlerter(ref, setShowModal) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export function ActivitiesModel({ showModal, setShowModal, activities}) {

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setShowModal);

  return (
    showModal &&
      <Modal>
        <ModalContent ref={wrapperRef}>
          <ModalHeader>
            <Close onClick={() => setShowModal(false)}>&times;</Close>
            <h2>Atividades</h2>
          </ModalHeader>
          <ModalBody>
            <p>Aqui está uma lista de componentes para serem construídos visando a criação de um processador. Esse é apenas um guia para auxiliar  no seu desenvolvimento. Aqui você poderá saber mais sobre os circuitos propostos, assim como visualizar uma solução possível.</p>
            {activities.map((activity) => (
              <ActivityItemModal
                activity={activity}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
  );
}

/* Modal */
const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
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
  height: 70vh;
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
  padding: 2px 16px;
  overflow: auto;
  max-height: 80%;
`;