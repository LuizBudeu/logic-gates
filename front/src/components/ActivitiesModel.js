import React, {useEffect, useRef} from "react";
import styled from 'styled-components';
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

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

export function ActivitiesModel({ showModal, setShowModal, missions}) {

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
            {missions.map((mission) => (
              <Row>
                <RowItem>
                  <OptionsText>{mission.order}. {mission.name} 
                    <a href={mission.description_url} target="_blank" title="Mais detalhes">
                      <ExternalIcon/>
                    </a>
                  </OptionsText>
                </RowItem>                
                <RowItem>
                  <Row> 
                    <RowItem>
                      <a href={mission.solution_url} target="_blank" title="Ver solução">
                        <SolutionIcon/>
                      </a>
                    </RowItem>
                    <RowItem>
                      <Checkbox id={"mission_"+mission.id} name={mission.id} type="checkbox" checked={mission.checked} disabled/>
                    </RowItem>
                  </Row>                        
                </RowItem>
              </Row>
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  height: 60px;
`;

const RowItem = styled.div`
  align-self: center;
`;

const OptionsText = styled.text`
  color: #FFFFFF;
  font-family: 'inter';
  font-size: 20px;
  align-self: center;
  cursor: ${({clickable}) => clickable ? 'pointer' : 'default'};
`;

const Checkbox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #888;
  border-radius: 4px;
  outline: none;
  cursor: default;
  position: relative;
  background-color: transparent;
  padding-left: 0px;

  &:checked {
    background-color: #444;
    border-color: #444;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 6px;
    height: 12px;
    border: solid #00ff55;
    border-width: 0 4px 4px 0;
    transform: rotate(45deg);
  }
`;

const ExternalIcon = styled(FaExternalLinkAlt)`
  padding-left: 10px;
  color: white; 
  font-size: 25px;
  cursor: pointer;
`;

const SolutionIcon = styled(FaEye)`
  padding-right: 5px;
  color: white; 
  font-size: 30px;
  cursor: pointer;
`;