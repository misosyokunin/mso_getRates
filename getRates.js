javascript:(async() => {
"use strict";

/*
┏━━━━━━━━━━━━━━━┓
┃ＭＳＯ＿相場を取得：我田引水用┃
┗━━━━━━━━━━━━━━━┛
Developer:
	魚頭男（https://minesweeper.online/ja/player/16842796 ）
Writing:
	魚頭男（https://minesweeper.online/ja/player/16842796 ）

相場データを取得するのは面倒。
というわけで、ツールを作りました。

=======================================================
このツールはMinesweeper.Online様（https://minesweeper.online/ 、以下「ＭＳＯ」）より公認を受けていない、非公認のものです。
当プログラムは、ＭＳＯ様とは一切関係ございませんので、このプログラムに関する質問・提言等の連絡は魚頭男（https://minesweeper.online/ja/player/16842796 、以下「魚」）までお願いします。
当プログラムについて、ＭＳＯ様に連絡することは絶対にしないでください。
運営者様並びにユーザー様にご迷惑にならないように努めておりますが、万が一のことがありましたら即削除いたします。
=======================================================
*/

/*
＝＝＝＝＝＝＝＝＝【使い方】＝＝＝＝＝＝＝＝＝
このスクリプトを実行して身を任せるだけです。

デフォルトは宝石のレートを取得しますが、
事前にアリーナチケット・部品・アメリカドルなどをセットしておくとそのデータを取得します。

1ページ辺り最短1秒で取得します
（環境によっては2秒以上掛かるかもしれません）。
（また、中断機能を設けておりますので、無謀な実行でも大丈夫です）。
スクリプト実行中は、できるだけタブの遷移やブラウザをバックグラウンドにしないようにしてください。

なお、他言語でも同じようなことができると思います。
ただ、このスクリプトのままでは動きませんので、適宜変えてください（「ja」や抽出文言）。

*/

/*＝＝＝＝＝【実行チェック】＝＝＝＝＝*/
const TAR_URL = "https://minesweeper.online/ja/rates/";
const TAR_URL2 = "https://minesweeper.online/ja/rates/y/G/M";
const TAR_TITLE = "ゲーム内経済画面";
if(location.href.includes(TAR_URL)){
	
}else{
	const result = window.confirm(`${TAR_TITLE}ではありません。\n${TAR_TITLE}へ飛びますか？\n（ページ遷移後に再度このスクリプトを実行してください。）`);
	if(result){
		location.href = TAR_URL2;
	}else{
		alert(`${TAR_TITLE}（${TAR_URL}）を表示させてください。`);
	}
	return;
}


/*＝＝＝＝＝【実行前ユーザー入力】＝＝＝＝＝*/
const bk = document.createElement("div");
bk.style = "position:fixed; top: 0px; left: 0px; background-color: rgba(0, 0, 0, 0.5); width: 100vw; height: 100vh; font-size: 2em; z-index: 100; display: flex; justify-content: center; align-items: center; flex-direction: column;";
bk.innerHTML = "";
document.body.append(bk);

/*＝＝＝＝＝【定数・パーツ】＝＝＝＝＝*/
/*グラフを描画する際に相場データを渡している。普通じゃ取れないのでグラフ描画クラスを置き換える！*/
ApexCharts = class{
	constructor(param){
/*		console.log(arguments);*/
		if(!isGet){
			return;
		}
		if(arguments[0].id !== "rates_chart_top"){
			return;
		}
		const data = arguments[1]["series"][0]["data"];
		if(putDatas.length === 0){
			putDatas = new Array(data.length).fill("");
		}
		for(let i = 0; i < data.length; i++){
			putDatas[i] += `\t${data[i][1]}`;
		}
		progress.value++;
		Wait.release();
	}
	render(){
		/*dummy*/
	}
	destroy(){
		/*dummy*/
	}
};
const COUNT1 = document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[1]?.querySelectorAll("a")?.length ?? 0;
const COUNT2 = document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[2]?.querySelectorAll("a")?.length ?? 0;
const Wait = {
	waits : [],
	num : -1,
	add(){
		return new Promise((resolve) =>{
			this.num++;
			this.waits[this.num] = resolve;
		});
	},
	release(){
		this.waits[this.num]();
		this.waits[this.num] = "";
		this.num--;
	},
	time(sec){
		return new Promise((resolve) =>{
			setTimeout(function(){resolve();}, sec * 1000);
		});
	},
};

const TODAY = new Date();
if(TODAY.getHours() < 9){	/*日度は09:00から始まる*/
	TODAY.setDate(TODAY.getDate() - 1);
}
function makeDateStr(day){
	return `${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()}`;
}

/*＝＝＝＝＝【実行中ユーザー入力】＝＝＝＝＝*/
bk.innerHTML = "";
bk.innerText = `${makeDateStr(TODAY)}の${document.querySelector("#rates_item_dropdown_wrapper .select-dropdown").textContent}レートを取得しています…\nしばらくお待ちください…`;
const breakButton = document.createElement("button");
breakButton.type = "button";
breakButton.textContent = "終了する";
breakButton.addEventListener("click", () => {
	isLooping = false;
});
bk.append(breakButton);
const progress = document.createElement("progress");
progress.max = COUNT2 ? COUNT1 * COUNT2 : COUNT1;
progress.value = 0;
bk.append(progress);
{
	const label = document.createElement("label");
	label.style = "cursor: pointer;";
	bk.append(label);
	const input = document.createElement("input");
	input.type = "number";
	input.id = "_getDataDay";
	input.min = 1;
	input.value = 1;
	input.step = 1;
	input.style = "width: 5ch;";
	label.append(input);
	const span = document.createElement("span");
	span.textContent = "日分を取得する";
	span.style = "font-size: 16px";
	label.append(span);
}
{
	const label = document.createElement("label");
	label.style = "cursor: pointer;";
	bk.append(label);
	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = false;
	input.id = "_chkShowHeader";
	input.style = "transform: scale(1.5); margin: 5px;";
	label.append(input);
	const span = document.createElement("span");
	span.textContent = "見出しも取得する";
	span.style = "font-size: 16px";
	label.append(span);
}
{
	const label = document.createElement("label");
	label.style = "cursor: pointer;";
	bk.append(label);
	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = true;
	input.id = "_chkCopyDataWhenJumpToSheet";
	input.style = "transform: scale(1.5); margin: 5px;";
	label.append(input);
	const span = document.createElement("span");
	span.textContent = "シート遷移時にデータをコピーする";
	span.style = "font-size: 16px";
	label.append(span);
}




/*＝＝＝＝＝【データ取得】＝＝＝＝＝*/
let isLooping = true;
let isGet = true;
let putDatas = [];	/*のちにspliceするのでlet*/
const headerDatas = [];

if(COUNT2){
	let ORDER = new Array(COUNT2).fill(null).map((val, ind) => ind);
	if(document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[2]?.querySelectorAll("a")[0].textContent.includes("平均")){
		ORDER.push(ORDER.shift());
	}
	for(let i = 0; i < COUNT2; i++){
		isGet = false;
		const order = ORDER[i];
		document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[2].querySelectorAll("a")[order].click();
		await Wait.time(2);
		
		isGet = true;
		for(let j = 0; j < COUNT1; j++){
			document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[1]?.querySelectorAll("a")[j].click();
	/*
			await Wait.time(2);
	*/
			await Wait.add();
			const str1 = document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[2]?.querySelectorAll("a")[order].textContent;
			const str2 = document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[1]?.querySelectorAll("a")[j].textContent;
			headerDatas.push(`${str1}${str2}`);
			if(!isLooping){
				break;
			}
		}
		if(!isLooping){
			break;
		}
	}
}else{
	let ORDER = new Array(COUNT1).fill(null).map((val, ind) => ind);
	if(document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[1]?.querySelectorAll("a")[0].textContent.includes("平均")){
		ORDER.push(ORDER.shift());
	}
	for(let i = 0; i < COUNT1; i++){
		const order = ORDER[i];
		document.querySelectorAll(".dropdown")[1].querySelectorAll("a")[order].click();
	/*
		await Wait.time(2);
	*/
		await Wait.add();
		headerDatas.push(document.querySelector("#RatesBlock .pull-left").querySelectorAll(".dropdown-menu:not([id='currency_dropdown_list'])")[1]?.querySelectorAll("a")[order].textContent);
		if(!isLooping){
			break;
		}
	}
}

/*日付を挿入*/
headerDatas.unshift("日付");
putDatas.reverse();
const spliceVal = document.getElementById("_getDataDay").value || 1;
putDatas = putDatas.splice(0, spliceVal);
for(let i = 0; i < putDatas.length; i++){
	const tempday = new Date();
	tempday.setDate(TODAY.getDate() - i);
	putDatas[i] = `${makeDateStr(tempday)}${putDatas[i]}`;
}

/*＝＝＝＝＝【取得データ表示】＝＝＝＝＝*/
const isShowHeader = document.getElementById("_chkShowHeader").checked;
const isCopyDataWhenJumpToSheet = document.getElementById("_chkCopyDataWhenJumpToSheet").checked;


bk.innerHTML = "";
const textarea = document.createElement("textarea");
if(isShowHeader){
	putDatas.unshift(headerDatas.join("\t"));
}
textarea.value += putDatas.join("\n");
textarea.style = "font-size: 16px; width: 90%; height: 50%;";
bk.append(textarea);
const wrapper = document.createElement("div");
wrapper.style = "height: 20%; width: 90%; font-size: 16px; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 0px;";
bk.append(wrapper);
const copyButton = document.createElement("button");
copyButton.type = "button";
copyButton.textContent = "📃コピーする";
copyButton.addEventListener("click", () => {
	textarea.select();
	document.execCommand("copy");
	window.getSelection?.().removeAllRanges();
	textarea.blur();
	copyButton.textContent = "📃コピーしました！";
	setTimeout(() => {
		copyButton.textContent = "📃コピーする";
	}, 3000);
});
copyButton.style = "grid-column: span 2 / span 2;";
wrapper.append(copyButton);
const closeButton = document.createElement("button");
closeButton.type = "button";
closeButton.textContent = "閉じる";
closeButton.addEventListener("click", () => {
	bk.remove();
	location.href = location.href;	/*リロード*/
});
closeButton.style = "grid-column-start: 1; grid-row-start: 2;";
wrapper.append(closeButton);
const jumpButton = document.createElement("button");
jumpButton.type = "button";
jumpButton.style = "grid-column-start: 2; grid-row-start: 2;";
wrapper.append(jumpButton);
const anc = document.createElement("a");
anc.innerText = "コピペしにいく\n（スプレッドシートへ飛びます）";
anc.href = "https://docs.google.com/spreadsheets/d/1FgpjiyNmgBRkSSh9dH7BykKiNvOFu5-yATCETNO4pt4/edit?gid=0#gid=0";
anc.setAttribute("target", '_blank');
if(isCopyDataWhenJumpToSheet){
	anc.addEventListener("click", () => {
		textarea.select();
		document.execCommand("copy");
		window.getSelection?.().removeAllRanges();
		textarea.blur();
	});
}
anc.style = "display: block;";
jumpButton.append(anc);



})();
