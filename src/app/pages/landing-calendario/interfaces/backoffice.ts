export interface Group {
  id: number;
  nome: string;
  utenti: User[];
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
  ATTIVO,
  SOSPESO,
  ERRATO,
  TOKEN_VALIDATO,
  PENDING,
  REGISTRAZIONE,
  VALIDAZIONE,
}
