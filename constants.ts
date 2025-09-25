import { Background } from './types';
import caixaPapelao from './assets/image/caixaPapelao.png';
import velhoOeste from './assets/image/velhoOeste.png';
import salaJogos from './assets/image/salaJogos.png';

export const BACKGROUNDS: Background[] = [
  {
    id: 'cardboard-box',
    name: "Caixa de Papelão",
    previewUrl: caixaPapelao,
  },
  {
    id: 'western-desert',
    name: "Velho Oeste",
    previewUrl: velhoOeste,
  },
  {
    id: 'arcade',
    name: "Salão de Jogos",
    previewUrl: salaJogos,
  },
];