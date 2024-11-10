export const getDateTime = (strDate) => {
  if(strDate == null){
    return "Não definido"
  }
  const date = new Date(strDate)
  return(date.getUTCDate() + "/" + String(date.getUTCMonth()).padStart(2, '0') + "/" + date.getUTCFullYear() + ", " + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0'))
}