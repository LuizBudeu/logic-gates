export const getDateTime = (strDate) => {
  if(strDate == null){
    return "Não definido"
  }
  const date = new Date(strDate)
  return(date.getUTCDate() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear() + ", " + date.getHours() + ':' + date.getMinutes())
}