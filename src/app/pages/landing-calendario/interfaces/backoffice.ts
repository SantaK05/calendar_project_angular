export interface Group {
  id: number;
  nome: string;
  ruoli: Role[];
}

export interface Role {
  id: number;
  nome: string;
  descrizione: string;
}

export interface User {
  id: number;
  nome: string;
  cognome: string;
  username: string;
  password: string;
  email: string;
  ruoli: Role[];
  gruppi: Group[];
  stato: Stato;
}

export enum Stato {
  ATTIVO, //account in uso dall'utente
	SOSPESO, //account non in uso
	ERRATO, //boh
	TOKEN_VALIDATO, //validazione eseguita
	PENDING, //account sospeso
	REGISTRAZIONE, //account in registrazione
	VALIDAZIONE, //richiesta di registrazione avvenuta
	TEST, //testing
}
