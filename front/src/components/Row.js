import styled from 'styled-components'

export const Row = styled.div`
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    flex-wrap: ${({wrap}) => wrap ? "wrap" : "null"};
`