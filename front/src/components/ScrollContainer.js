import styled from 'styled-components'

const ScrollContainerStyle = styled.div`
  overflow-y: auto;
  direction:${({barLeft}) => barLeft ? 'rtl' : 'ltr'}; 
`
const ContentStyle = styled.div`
  direction:ltr;
`
const WrapperStyle = styled.div`
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
`
export const ScrollContainer = ({children, barLeft}) => {
  return(
    <WrapperStyle>
      <ScrollContainerStyle barLeft={barLeft}>
        <ContentStyle>
          {children}
        </ContentStyle>
      </ScrollContainerStyle>
    </WrapperStyle>
  )
}