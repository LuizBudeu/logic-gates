import styled from 'styled-components'
import { Colors } from "../utils/colors";

export const MainTitle = ({children}) => {
    return(
        <MainTitleStyle>
            {children}
        </MainTitleStyle>
    )
}

export const MainTitleStyle = styled.text`
    color: ${Colors.White};
    font-size: 48px;
    font-weight: bold;
    font-family: "inter";
`