export interface Calendario {
    provenienza: string
    data: string
    tipoVisualizzazione: string
    listaCelle: ListaCelle[]
}
  
export interface ListaCelle {
    data: string
    slotPrenotazioneList: SlotPrenotazioneList[]
    prenotazioneList: PrenotazioneList[]
}
  
export interface SlotPrenotazioneList {
    id: number
    risorsa: Risorsa
    nome: string
    dataInizio: string
    dataFine: string
    libero: boolean
    note: string
}
  
export interface Risorsa {
    id: number
    nome: string
    descrizione: string
    prenotabile: boolean
    accessoRemoto: boolean
    info1: string
    info2: string
    info3: string
    info4: string
    info5: string
}
  
export interface PrenotazioneList {
    id: number
    data: string
    idSlotPrenotazione: number
    idUtente: number
    oraInizio: string
    oraFine: string
}
  
