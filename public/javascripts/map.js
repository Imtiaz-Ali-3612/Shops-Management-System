
console.log("works ok");
    $("#location").on('click',function(){
      console.log("works ok");

        if(navigator.geolocation){
        console.log("inside IF");
          navigator.geolocation.getCurrentPosition(function(position){
              $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+","+position.coords.longitude+"&sensor-false&key=AIzaSyDITCSRuXhgM2CgEDlXidu6So84RqKtxqs",function(data){
                console.log(data);
              //  $("#search").html=data.plus_code.compound_code;
                $( "#search" ).val(data.plus_code.compound_code);

              })
          });
        }
         else {
          console.log("not supported geo location");
        }
    });


//  AIzaSyBruXu1-7XkFoHaO1aVeIKhyZagm9CLgAU
