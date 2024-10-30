import { MdEdit } from "react-icons/md";
import { Colors } from "../utils/colors";
import styled from 'styled-components';

export const MdEditStyle = styled(MdEdit)`
  color: ${Colors.DarkGray}; 
  font-size: 30px; 
  cursor: pointer;
  position: absolute;
  margin-left: 5px;
  transform: translateY(20%);
`;