import styled from 'styled-components'
import { Colors } from "../utils/colors";
import { useNavigate } from 'react-router-dom';
import { Column } from './Column';
import { MdEdit } from "react-icons/md";

export const ClassroomCard = ({classroom}) => {
    const navigate = useNavigate();

    return(
        <CardBackground>
            <Column>
                <div>
                    <TitleStyle>{classroom.name}</TitleStyle>
                    <MdEditStyle  onClick={() => navigate('/professor/classroom/edit/' + classroom.id)} title="Editar turma"/>
                </div>
                <SubtitleStyle>{classroom.numStudents} alunos</SubtitleStyle>
                <HorizontalLine/>
                <DetailsButtonStyle onClick={() => navigate('/professor/classroom/details/' + classroom.id)}>Ver turma</DetailsButtonStyle>
            </Column>
        </CardBackground>
    )
}

export const CardBackground = styled.div`
    background-color: ${Colors.White};
    border-radius: 30px;
    width: 300px;
    padding: 15px;
`

export const TitleStyle = styled.text`
    color: ${Colors.DarkGray};
    font-size: 36px;
    font-family: "inter";
`

export const SubtitleStyle = styled.text`
    color: ${Colors.LightGray};
    font-size: 24px;
    font-family: "inter";
`

const MdEditStyle = styled(MdEdit)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
  position: absolute;
  margin-left: 5px;
  transform: translateY(20%);
`;

const DetailsButtonStyle = styled.div`
  color: ${Colors.DarkGray}; 
  font-size: 15px; 
  font-weight: bold;
  cursor: pointer;
`;


const HorizontalLine = styled.div`
  background-color: ${Colors.LightGray}; 
  margin-top: 15px;
  margin-bottom: 15px;
  height: 2px;
  width: calc(100% + 30px);
  margin-left: -15px;
`;