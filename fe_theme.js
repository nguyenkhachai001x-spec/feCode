import Lib from "./lib.js";
import Data from "./data.js";
const fe_theme=async function(...m){
	return await Lib.exe(Data.s,{lib:Lib,data:Data},...m);
};
export default fe_theme;
	
