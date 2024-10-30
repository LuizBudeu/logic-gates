import styled from 'styled-components'

const RowItemStyle = styled.div`
    flex: ${({flex, grow}) => flex != null ? flex : (grow ? "1" : "0")};
    display: ${({display}) => display ?? "flex"};
    padding: ${({noPadding, customPadding}) => noPadding ? "0px" : customPadding ? customPadding+"px" : "16px"};
    justify-content: ${({center}) => center ? "center" : "null"};
    align-items: ${({center}) => center ? "center" : "null"};
`


export const RowItem = ({grow, center, flex, noPadding, children, customPadding, display}) => {

    return(
        <RowItemStyle 
            grow={grow}
            center={center}
            flex={flex}
            noPadding={noPadding}
            customPadding={customPadding}
            display={display}
        >
            {children}
        </RowItemStyle>
    );
}