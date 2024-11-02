import styled from 'styled-components'

const ScrollContainerStyle = styled.div`
  overflow-y: scroll;
`
const WrapperStyle = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
`
export const ScrollContainer = ({children}) => {
  return(
    <WrapperStyle>
      <ScrollContainerStyle>
        {children}
      </ScrollContainerStyle>
    </WrapperStyle>
  )
}