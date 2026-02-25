// Fname, Email, Phone and message form inputs post with ajax and response sweetalert by status false or true
//var e = document.getElementById("il");
//var text = e.options[e.selectedIndex].text;
$(document).ready(function () {
  $("#submit").click(function () {
    event.preventDefault();
      var fullname = $("#fullname").val();
      var email = $("#email").val();
      var phone = $("#phone").val();
      var message = $("#message").val();
      var page = $("#page").text();
      if (fullname == "" || email == "" || phone == "" || message == "" || page == "") {
      new swal("Uyarı", "Lütfen tüm alanları doldurunuz.", "error");
        console.log(markaid,modelid,modelyil,siyah,il,ilce,telephone,fullname,complaint,adresses);
    } else {
      $("#submit").html("Gönderiliyor...");
      $("#submit").attr("disabled", true);
      $.ajax({
        type: "POST",
        data: {
            fullname: fullname,
            email: email,
            phone: phone,
            message: message,
            page: page,

          __RequestVerificationToken: $(
            'input[name="__RequestVerificationToken"]'
          ).val(),
        },
        success: function (data) {
          if (data.status === false) {
            new swal("Uyarı", data.message, "error");
            $("#submit").html("GÖnder");
            $("#submit").attr("disabled", false);
          } else {
            new swal("Siparişiniz Alındı.", data.message, "success");
            $("#submit").html("Siparişiniz Alındı.");
          }
        },
        error: function (data) {
          new swal(
            "Uyarı",
            "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.",
            "error"
          );
        },
      });
    }
  });
});
