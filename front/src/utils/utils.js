export const ActivityStatus = {
  indisponivel: 0,
  emAndamento: 1,
  finalizada: 2,
  naoConfigurada: 3
};

export const ActivityStatusString = {
  0: "Indisponível",
  1: "Em andamento",
  2: "Finalizada",
  3: "Não configurada"
};

export const getActivityStatus = (startsAtStr, endsAtStr) => {
  if(startsAtStr == null || endsAtStr == null){
    return ActivityStatus.naoConfigurada;
  }else{
    const startsAt = new Date(startsAtStr)
    const endsAt = new Date(endsAtStr)
    const currentDate = new Date()
    if(currentDate < startsAt){
      return ActivityStatus.indisponivel;
    }else if(currentDate < endsAt){
      return ActivityStatus.emAndamento;
    }else{
      return ActivityStatus.finalizada;
    }
  }
  


}