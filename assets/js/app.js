const buttonholder = $("#buttonholder");
const baseURL = "https://min-api.cryptocompare.com";

const cryptoList = ["BTC", "ETH"];

const requestInformation = function()
{
    let currency = $(this).val();
    ajaxFullPriceData(currency);
}

const ajaxFullPriceData = function()
{
    let queryurl = baseURL + '/data/pricemultifull?' + $.param({
        'fsym': currency,
        'tsyms': "BTC,USD,EUR",
    });

    console.log(queryurl);

    $.ajax({
        url: queryurl,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })
}

const appendButton = function(cryptoSymbol)
{
    let button = $(`<button class="bg-primary stockbutton" value="${cryptoSymbol}">`);
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
const retrieveValidationList = function()
{
    $.ajax({
        url: "https://min-api.cryptocompare.com/data/all/coinlist",
        method: "GET"
    }).then(function(response){
        let datakeys = Object.keys(response.Data);
        for(let i = 0; i < datakeys.length; i++)
        {
            validationList.push(response.Data[datakeys[i]].Symbol);
        }
    })
}
retrieveValidationList();