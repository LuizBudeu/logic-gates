import React from "react";
import styled from 'styled-components';
import { ActivityItemModal } from "./ActivityItemModal";
import { StudentActivities } from "../controllers/ActivitiesController";
import { Modal } from "./Modal";

export function ActivitiesModal({ showModal, setShowModal}) {

  const {activities, sendCircuitToJudge} = StudentActivities();

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Atividades"
    >
      <p>Aqui está uma lista de componentes para serem construídos visando a criação de um processador. Esse é apenas um guia para auxiliar  no seu desenvolvimento. Aqui você poderá saber mais sobre os circuitos propostos, assim como visualizar uma solução possível.</p>
      {activities?.map((activity) => (
        <ActivityItemModal
          activity={activity}
          sendCircuitToJudge={() => sendCircuitToJudge(activity.id)}
        />
      ))}
    </Modal>
  );
}