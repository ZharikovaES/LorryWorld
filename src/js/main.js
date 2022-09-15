import '../styles/style.scss';

//----- Библиотеки js -----//
import $ from 'jquery';

global.jQuery = $;
global.$ = $;

//----- Основной js -----//
import {Lib} from "./modules/Lib";


Lib();
