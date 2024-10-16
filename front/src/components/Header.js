import React from "react";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaGear } from "react-icons/fa6";
import { ActivitiesModel } from "./ActivitiesModel.js";

export function Header() {

  const [showConfigOptions, setShowConfigOptions] = React.useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = React.useState(false);

  const missions = [
    {
      'order': 1,
      'name': 'NOT',
      'id': 1,
      'checked': false,
      'description_url': './',
      'solution_url': './'
    },
    {
      'order': 1,
      'name': 'AND',
      'id': 1,
      'checked': true,
      'description_url': './',
      'solution_url': './'
    },
  ];

  const navigate = useNavigate();

  return (
    <div>
      <HeaderContainer>
        <NandesisTitle>NANDesis.io</NandesisTitle>
        <LeftMenuContainer>
          <RowItem>
            <OptionsText clickable onClick={() => navigate('./')}>Home</OptionsText>
          </RowItem>
          <RowItem>
            <OptionsText clickable onClick={() => navigate('./')}>Sobre nós</OptionsText>
          </RowItem>
          <RowItem>
            <OptionsText clickable onClick={() => setShowActivitiesModal(true)}>Atividades</OptionsText>
          </RowItem>
          <VerticalLine/>
          <RowItem>
            <OptionsText>Olá, User name!</OptionsText>
          </RowItem>
          <RowItem>
            <IconStyle  onClick={() => setShowConfigOptions(!showConfigOptions)}></IconStyle >
            {showConfigOptions &&
              <DropdownMenu>
                <DropdownMenuText onClick={() => navigate('./')}>Meu perfil</DropdownMenuText>
                <DropdownMenuText onClick={() => navigate('./')}>Sair</DropdownMenuText>
              </DropdownMenu>
            }
          </RowItem>
        </LeftMenuContainer>
      </HeaderContainer>
    <ActivitiesModel
      showModal={showActivitiesModal}
      setShowModal={setShowActivitiesModal}
      missions={missions}
    />
    </div>
    
  );
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #1E1E1E;
  height: 60px;
`;

const LeftMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 32px;
`;

const NandesisTitle = styled.text`
  color: #FFFFFF;
  font-family: 'coda';
  font-size: 24px;
  align-self: center;
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

const VerticalLine = styled.div`
  border: 2px solid white;
  width: 0px;
  height: 60%;
  align-self: center;
  border-radius: 25px;
`;

const IconStyle = styled(FaGear)`
  color: white; 
  font-size: 30px; 
  cursor: pointer
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 20px;
  background-color: #333;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const DropdownMenuText = styled.text`
  color: #FFFFFF;
  font-family: 'inter';
  font-size: 15px;
  align-self: center;
  cursor: pointer;
  padding: 5px;
`;