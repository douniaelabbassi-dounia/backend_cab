// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,

  errorServeurMsg: '❌ Erreur au niveau du serveur. ',
  informationSauvegarde: '✔️ les renseignements sont bien enregistrés. ',
  SuccessMsg:'✔️ Enregistrement effectué avec succès',
};

// dev - Laragon local development
// export const URL_BASE = 'http://cabsul.test/api/'
// export const URL_BASE = 'http://localhost:8000/api/'
// export const URL_BASE = 'http://192.168.1.143:8000/api/'

// Production - SiteGround
export const URL_BASE = 'https://alik144.sg-host.com/api/';
export const URL = URL_BASE
export const SuperiseurEmail = 'contact@soorcin.technology'
// export const url = 'http://10.131.84.51/visilog_dev/api/';
// export const urlWS = 'ws://10.131.84.51:8000/connection/websocket';
// export const dateRelease = 'v1.2.0 2024-04-30 10h18';


// export const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization:
//       'Bearer ' + window.localStorage.getItem('visilog_lesieur_token'),
//   }),
// };
