function print_today() {
  // ***********************************************
  // AUTHOR: WWW.CGISCRIPT.NET, LLC
  // URL: http://www.cgiscript.net
  // Use the script, just leave this message intact.
  // Download your FREE CGI/Perl Scripts today!
  // ( http://www.cgiscript.net/scripts.htm )
  // ***********************************************
  var now = new Date();
  var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  var date = ((now.getDate() < 10) ? "0" : "") + now.getDate();
  function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
  }
  var today = months[now.getMonth()] + " " + date + ", " + (fourdigits(now.getYear()));
  return today;
}

// from http://www.mediacollege.com/internet/javascript/number/round.html
function roundNumber(number, decimals) {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
      numString += ".";// give it one at the end
    }
    var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff, cutoff + 1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff + 1, cutoff + 2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != ".") {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff, cutoff + 1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    }
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf("."));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0, cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
    newString += ".";
  }
  var decs = (newString.substring(newString.lastIndexOf(".") + 1)).length;
  for (var i = 0; i < decimals - decs; i++) newString += "0";
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}

function update_total() {
  var total = 0;
  $('.price').each(function (i) {
    price = $(this).html().replace("₹", "");
    if (!isNaN(price)) total += Number(price);

  });

  total = roundNumber(total, 2);

  var sgst = 0;

  $('.sgst').each(function (i) {


    price = $(this).html().replace("%", "");

    if (!isNaN(price)) sgst += Number(price);

  });

  sgst = roundNumber(sgst, 2);
  var cgst = 0;

  $('.cgst').each(function (i) {


    price = $(this).html().replace("%", "");

    if (!isNaN(price)) cgst += Number(price);

  });

  cgst = roundNumber(cgst, 2);
  var igst = 0;

  $('.igst').each(function (i) {


    price = $(this).html().replace("%", "");

    if (!isNaN(price)) igst += Number(price);

  });

  igst = roundNumber(igst, 2);


  $('#subtotal').html("₹" + total);
  total1 = roundNumber(total * sgst * 0.01, 2);
  $('#num1').html("₹" + total1);
  total2 = roundNumber(total * cgst * 0.01, 2);
  $('#num2').html("₹" + total2);
  total3 = roundNumber(total * igst * 0.01, 2);
  $('#num3').html("₹" + total3);


  update_balance();
}

function update_balance() {
  var s = $("#subtotal").html().replace("₹", "");

  var s = parseInt(s, 10);
  var num1 = $("#num1").html().replace("₹", "");
  var t1 = parseInt(num1, 10);
  var num2 = $("#num2").html().replace("₹", "");
  var t2 = parseInt(num2, 10);
  var num3 = $("#num3").html().replace("₹", "");
  var t3 = parseInt(num3, 10);


  due = s + t1 + t2 + t3;
  var x = due;

  due = "₹" + due;
  var res = "";
  res += "<h1>"
  res += due;
  res += "</h1>";

  $('.due').html(res);
  var y = "<b>Rupees in words:  </b>  " + inWords(x);

  $('.words').html(y);
}

function update_price() {
  var row = $(this).parents('.item-row');
  var price = row.find('.cost').val().replace("₹", "") * row.find('.qty').val();
  price = roundNumber(price, 2);

  isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html("₹" + price);

  update_total();


}

function bind() {
  $(".cost").blur(update_price);
  $(".qty").blur(update_price);
}

$(document).ready(function () {

  $('input').click(function () {
    $(this).select();
  });

  $("#paid").blur(update_balance);

  $("#addrow").click(function () {
    $(".item-row:last").after('<tr class="item-row"><td class="item-name"><div class="delete-wpr"><textarea>HSN Code</textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td><td class="description"><textarea>Item</textarea></td><td><textarea class="cost">₹100</textarea></td><td><textarea class="qty">2</textarea></td><td><span class="price">₹200</span></td></tr>');
    if ($(".delete").length > 0) $(".delete").show();
    bind();
  });

  bind();

  $(".delete").live('click', function () {
    $(this).parents('.item-row').remove();
    update_total();
    if ($(".delete").length < 2) $(".delete").hide();
  });

  $("#cancel-logo").click(function () {
    $("#logo").removeClass('edit');
  });
  $("#delete-logo").click(function () {
    $("#logo").remove();
  });
  $("#change-logo").click(function () {
    $("#logo").addClass('edit');
    $("#imageloc").val($("#image").attr('src'));
    $("#image").select();
  });
  $("#save-logo").click(function () {
    $("#image").attr('src', $("#imageloc").val());
    $("#logo").removeClass('edit');
  });

  $("#date").val(print_today());

});




var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
  if ((num = num.toString()).length > 9) return 'overflow';
  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; var str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
  return str;
}