import React from "react";
import styled from 'styled-components';
import { Colors } from "../utils/colors";
import Form from 'react-bootstrap/Form';

export const Input = (props) => {

  return (
    <div>
      <text>{props.title}{props.isMandatory && <WarningLabel>*</WarningLabel>}</text>
      <InputStyle {...props} />
    </div>
  );
}

export const InputSelect = (props) => {

  return (
    <div>
      <text>{props.title}{props.isMandatory && <WarningLabel>*</WarningLabel>}</text>
      <InputSelectStyle {...props}>
        {props.children}
      </InputSelectStyle>
    </div>
  );
}

const InputStyle = styled.input`
  background-color: ${Colors.Gray};
	border-radius: 15px;
	padding: 10px;
  margin-top: 5px;
	margin-bottom: 16px;
	border-style:solid;
	border:none;
	width: calc(100% - 20px);
`;

export const InputSelectStyle = styled(Form.Select)`
  background-color: ${Colors.Gray};
	border-radius: 15px;
	padding: 10px;
	margin-top: 5px;
	margin-bottom: 16px;
	border-style:solid;
	border:none;
	width: 100%;
`;

export const InputButton = styled.input`
  background-color: ${Colors.ConfirmBlue};
	color: ${Colors.White};
	border-radius: 15px;
	padding: 10px;
	margin-top: 16px;
	margin-bottom: 16px;
	border-style:solid;
	border:none;
	width: 100%;
`;

export const WarningLabel = styled.text`
  color: ${Colors.CancelRed};
`;