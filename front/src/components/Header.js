import React from "react";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaGear } from "react-icons/fa6";
import { ActivitiesModal } from "./ActivitiesModal.js";
import { Logout } from "../controllers/AuthController.js";
import { UserInfo } from "../controllers/UserController.js";
import { ClassroomModal } from "./ClassroomModal.js";
import { useAuth } from "../hooks/useAuth.js";

export function Header({ showActivities }) {

  const { user: userAuth } = useAuth();

  const navigate = useNavigate();

  return (
    <div>
      <HeaderContainer>
        <NandesisTitle>NANDesis.io</NandesisTitle>
        <LeftMenuContainer>
          {userAuth ?
            <AuthenticatedHeader showActivities={showActivities} />
          :
            <>
              <RowItem>
                <OptionsText clickable onClick={() => navigate('/login')}>Login</OptionsText>
              </RowItem>
              <RowItem>
                <OptionsText clickable onClick={() => navigate('/register')}>Register</OptionsText>
              </RowItem>
            </>
          }
        </LeftMenuContainer>
      </HeaderContainer>
    </div>
    
  );
}

export function AuthenticatedHeader({ showActivities }) {

  const [user, getUserInfo] = UserInfo();
  const [showConfigOptions, setShowConfigOptions] = React.useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = React.useState(false);
  const [showClassroomModal, setShowClassroomModal] = React.useState(false);
  const [ logout ] = Logout();

  const navigate = useNavigate();

  return (
    <>
      <RowItem>
        <OptionsText clickable onClick={() => navigate('/simulator')}>Simulador</OptionsText>
      </RowItem>
      {user?.role == '0' && 
        <RowItem>
          <OptionsText clickable onClick={() => setShowClassroomModal(true)}>Minha turma</OptionsText>
        </RowItem>
      }
      {user?.role == '1' && 
        <RowItem>
          <OptionsText clickable onClick={() => navigate('/professor/classrooms')}>Minhas turmas</OptionsText>
        </RowItem>
      }
      {showActivities && 
        <RowItem>
          <OptionsText clickable onClick={() => setShowActivitiesModal(true)}>Atividades</OptionsText>
        </RowItem>
      }          
      <VerticalLine/>
      <RowItem>
        <OptionsText>Olá, {user?.name}!</OptionsText>
      </RowItem>
      <RowItem>
        <IconStyle  onClick={() => setShowConfigOptions(!showConfigOptions)}></IconStyle >
        {showConfigOptions &&
          <DropdownMenu>
            <DropdownMenuText onClick={() => navigate('./')}>Meu perfil</DropdownMenuText>
            <DropdownMenuText onClick={() => logout()}>Sair</DropdownMenuText>
          </DropdownMenu>
        }
      </RowItem>
      {user?.role == '0' && 
        <ClassroomModal
          showModal={showClassroomModal}
          setShowModal={setShowClassroomModal}
        />
      }
      {showActivities && 
        <ActivitiesModal
          showModal={showActivitiesModal}
          setShowModal={setShowActivitiesModal}
        />
      }      
    </>
    
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