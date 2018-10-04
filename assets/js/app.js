const buttonholder = $("#recentbuttons");
const baseURL = "https://min-api.cryptocompare.com";
const cryptoList = ["BTC", "ETH", "BCH", "XRP"];
let compareCurrency = "USD";
let cryptoType = "BTC";
let currentInfo;

let aliases = {
    FROMSYMBOL: "Currency Symbol",
    PRICE: "Price",
    OPENDAY: "Opening Price",
    HIGHDAY: "Today's High",
    LOWDAY: "Today's Low",
    MKTCAP: "Market Capitalization",
    SUPPLY: "Currency Supply",
    LASTUPDATE: "Last Update",
}

const requestInformation = function()
{
    cryptoType = $(this).val();
    ajaxFullPriceData();
}

const ajaxFullPriceData = function()
{
    let pricequeryurl = baseURL + '/data/pricemultifull?' + $.param({
        'fsyms': cryptoType,
        'tsyms': "BTC,USD,EUR",
    });

    $.ajax({
        url: pricequeryurl,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentInfo = response;
        displayInformation();
    })

    let newsqueryurl = baseURL + '/data/v2/news/?' + $.param({
        'categories': cryptoType,
        'lang': 'EN'
    })

    $.ajax({
        url: newsqueryurl,
        method: "GET"
    }).then(function(response){
        console.log(response);
        displayNews(response);
    })
}

const displayInformation = function(){
    let results = $("#resultswindow");
    results.empty();
    results.append(`<img src="https://www.cryptocompare.com${nameList[cryptoType].imageurl}" style="float: right; width:15vw; height:15vw;" alt="logo">`)
    results.append(`<h1>${nameList[cryptoType].fullname}</h1>`)
    let table = $("<table>");

    let header = $("<thead>");
    header.append(`<th>Information</th><th>Value</th>`)
    table.append(header);

    let body = $("<tbody>");
    let information = currentInfo.DISPLAY[cryptoType][compareCurrency];
    console.log(information);
    let keys = Object.keys(aliases);
    for(let i = 0; i < keys.length; i++)
    {
        let row = $("<tr>");
        row.append(`<td>${aliases[keys[i]]}<td>`)
        row.append(`<td>${information[keys[i]]}`);
        body.append(row);
    }
    table.append(body);

    results.append(table);
}

const displayNews = function(news) {
    let newsarray = news.Data;
    let newsarea = $("#currencyNews");

    for(let i = 0; i < newsarray.length && i < 10; i++)
    {
        let card = createMediaCard(newsarray[i]);
        newsarea.append(card);
    }
}

const createMediaCard = function(newsobject) {
    let href = $(`<a class="nodecoration" href = ${newsobject.url} target='_blank'>`);
    let card = $(`<div class="media bg-success">`);
    card.append(`<img class="align-self-center mr-3 mediacardimage" src="${newsobject.imageurl}" alt="Generic placeholder image">`);
    let mediabody = $(`<div class="media-body">`);
    mediabody.append(`<h5 class="mt-0">${newsobject.title}</h5>`);
    mediabody.append(`<p>${newsobject.body}</p>`);
    card.append(mediabody);
    href.append(card);
    return href;
}

const appendButton = function(cryptoSymbol)
{
    //Check if button from this crypto type already exists
    if(document.getElementById(cryptoSymbol) !== null)
    {
        //If so do not append
        return;
    }

    let button = $(`<button class="bg-primary stockbutton" value="${cryptoSymbol}" id="${cryptoSymbol}">`);
    button.text(cryptoSymbol);
    button.click(requestInformation);
    buttonholder.append("<br>");
    buttonholder.append(button);
}

for(let i = 0; i < cryptoList.length; i++)
{
    appendButton(cryptoList[i]);
}


let validationList = [];
let nameList = {};
const retrieveValidationList = function()
{
    $.ajax({
        url: "https://min-api.cryptocompare.com/data/all/coinlist",
        method: "GET"
    }).then(function(response){
        let datakeys = Object.keys(response.Data);
        for(let i = 0; i < datakeys.length; i++)
        {
            let symbol = response.Data[datakeys[i]].Symbol
            validationList.push(symbol);
            nameList[symbol] = {
                imageurl: response.Data[datakeys[i]].ImageUrl,
                fullname: response.Data[datakeys[i]].FullName
            }
        }
    })
}
retrieveValidationList();

const changeCurrencyType = function() {
    compareCurrency = $(this).val();
    console.log(compareCurrency);
    displayInformation();
}

$(".currencytype").click(changeCurrencyType);

const doSearch = function() {
    let searchinput = $("#searchInput");
    let inputvalue = searchinput.val().toUpperCase();

    if(!validationList.includes(inputvalue))
    {
        return;
    }

    searchinput.val("");
    appendButton(inputvalue);

    cryptoType = inputvalue;
    ajaxFullPriceData();
}

$("#Search").click(doSearch);

const clearSearch = function() {
    let searchinput = $("#searchInput");
    searchinput.val("");
}

$("#Clear").click(clearSearch);