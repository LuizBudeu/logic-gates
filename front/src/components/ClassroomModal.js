import React from "react";
import styled from 'styled-components';
import { ActivityItemModal } from "./ActivityItemModal";
import { ClassroomStudentInfo } from "../controllers/ClassroomController";
import { Modal } from "./Modal";

export function ClassroomModal({ showModal, setShowModal}) {

  const {classroom, setClassroom} = ClassroomStudentInfo();

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Minha turma"
    >
      {classroom ? 
        <div>
          <h3>{classroom.name}</h3>
          <p>Professor: {classroom.professor_name}</p>
          <p>Email: {classroom.professor_email}</p>
        </div>
      :
      <p>Você não está cadastrado em nenhum turma. Solicite o link de convite para seu professor.</p>
      }
    </Modal>
  );
}