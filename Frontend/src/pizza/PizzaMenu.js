/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API')
var Pizza_list;

//-----------------------------ORDER (js)-----------------------------------
var correctname = false;
var correctnumber = false;
var correctaddress = false;

function makeOrder() {
    if(correctnumber && correctaddress && correctname) {
           $(".next").css("opacity", "1");
            $(".next").css("pointer-events", "all");
       }
       else {
           $(".next").css("opacity",	"0.4");
            $(".next").css("pointer-events", "none");
       }
}

   $(".nameorder").focusout(function myName() {
       var name = $(".nameorder").val();
       if ((/^[a-zA-Z ]+$/.test(name)) && /\S/.test(name)) {
           correctname = true;
       }
       else
           correctname = false;

       if(correctname) {
           $(".nameorder").css("border", "1px solid green");
           $(".warnname").css("visibility", "hidden");
           $(".textname").css("color", "green");
       }
       else {
           $(".nameorder").css("border", "1px solid red");
           $(".warnname").css("visibility", "visible");
           $(".textname").css("color", "red");
       }
       makeOrder();
        });

 $(".numberorder").focusout(function myNumber() {
       var number = $(".numberorder").val();
       if ((/^[0-9+]+$/.test(number)) && checkNumber(number)) {
           correctnumber = true;
       }
     else correctnumber = false;

       if(correctnumber) {
           $(".numberorder").css("border", "1px solid green");
           $(".warnnumber").css("visibility", "hidden");
           $(".textnumber").css("color", "green");
       }
       else {
           $(".numberorder").css("border", "1px solid red");
           $(".warnnumber").css("visibility", "visible");
           $(".textnumber").css("color", "red");
       }
     makeOrder();
        });

 $(".addressorder").focusout(function myAddress() {
     var address = $(".addressorder").val();
       if (/\S/.test(address)) {
           correctaddress = true;
       }
     else
         correctaddress = false;

       if(correctaddress) {
           $(".addressorder").css("border", "1px solid green");
           $(".warnaddress").css("visibility", "hidden");
           $(".textaddress").css("color", "green");
       }
       else {
           $(".addressorder").css("border", "1px solid red");
           $(".warnaddress").css("visibility", "visible");
           $(".textaddress").css("color", "red");
        }
     makeOrder();
});

 $(".next").click(function send() {
     var order =
         {
             name: $(".nameorder").val(),
             number: $(".numberorder").val(),
             address: $(".addressorder").val(),
             cart: localStorage.getItem("Cart"),
             cash: localStorage.getItem("Cash")
         };
     
            //Оновлюємо відображення
           $("#button-white").click();
           $("#button-buy").click();
     
    API.createOrder(order, function (err, data) {
        console.log("Order created");
        console.log(order);
    });
});

function checkNumber(number) {
    if(number.length != 10 && number.length != 13)
        return false;
    if((number.startsWith("0") && number.length == 10) || (number.startsWith("+380")  && number.length == 13 && /^[0-9]+$/.test(number.substring(1, number.length))))
       return true;
    return false;
}
    //--------------------------------------------------------------------------

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
    var $buttons = $("#menu");
    
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
        
        
    }
    
    $buttons.find(".all").click(function(){
            initialiseMenu();
            //Оновлюємо відображення
        });
    
    $buttons.find(".meat").click(function(){
            filterPizza('М’ясна піца');
            //Оновлюємо відображення
        });
    
    $buttons.find(".ananas").click(function(){
            filterPizza('pineapple');
            //Оновлюємо відображення
        });
    
    $buttons.find(".tomatoes").click(function(){
            filterPizza('tomato');
            //Оновлюємо відображення
        });
    
    $buttons.find(".seafood").click(function(){
            filterPizza('Морська піца');
            //Оновлюємо відображення
        });
    
    $buttons.find(".vega").click(function(){
            filterPizza('Вега піца');
            //Оновлюємо відображення
        });

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        
        if(pizza.type == filter)
            pizza_shown.push(pizza);
        
        if(pizza.content.tomato && filter == 'tomato')
            pizza_shown.push(pizza);
        
        
        if(pizza.content.pineapple && filter == 'pineapple')
            pizza_shown.push(pizza);
        
        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}


function initialiseMenu() {
    //Показуємо усі піци
     $(".all").focus();
    API.getPizzaList(function (err, data) {
        Pizza_List = data;
        showPizzaList(Pizza_List);
    });
}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;