/*!
 * Google Maps API v3
 * Copyright 2015 Yolunu Bul
 */
//Main görünümü ayarlama işlemi yapılıyor.
	$('#header').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');
	$("#menu-icon").on("click", function()
	{
		$("nav").slideToggle();
		$(this).toggleClass("active");});
		$(window).resize(function () 
			{
				var h = $(window).height();
				var offsetTop = 95; 
				$('#main').css('height', (h-offsetTop));
	}).resize();

//Haritanın oluşturulma işlemi.	
	var map;
	var directionArray = [];
	function initMap() 
	{
		var origin_place_id = null;
		var destination_place_id = null;
		var travel_mode = google.maps.TravelMode.DRIVING;
		
		map = new google.maps.Map(document.getElementById('map'), 
		{
			center: {lat: 40.6518848, lng: 29.2202491},
			zoom: 10,
			mapTypeControl: true,
			mapTypeControlOptions: 
			{
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.TOP_CENTER
			},
		zoomControl: true,
		zoomControlOptions: 
		{
			position: google.maps.ControlPosition.LEFT_CENTER
		},
		scaleControl: true,
		streetViewControl: true,
		streetViewControlOptions: 
		{
			position: google.maps.ControlPosition.LEFT_TOP
		}
		});
	
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = null;
	

  var origin_input = document.getElementById('firstBox');
  var destination_input = document.getElementById('secondBox');
  

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  
  var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);
	
   function getRendererOptions(main_route)
   {
        if(main_route)
			{
				var _colour = '#008bff';
				var _strokeWeight = 7;
				var _strokeOpacity = 1;
				var _suppressMarkers = false;
			}
		else
			{
				var _colour = '#aaaaaa';
				var _strokeWeight = 6;
				var _strokeOpacity = 0.8;
				var _suppressMarkers = false;
			}

		var polylineOptions ={ strokeColor: _colour, strokeWeight: _strokeWeight, strokeOpacity: _strokeOpacity  };
		var rendererOptions = {draggable: false, suppressMarkers: _suppressMarkers, polylineOptions: polylineOptions};

	return rendererOptions;
}

function renderDirections(result, rendererOptions, routeToDisplay)
{
	
	if(routeToDisplay==0)
	{
		var _colour = '#008bff';
		var _strokeWeight = 7;
		var _strokeOpacity = 1;
		var _suppressMarkers = false;
	}
	else
	{
		var _colour = '#aaaaaa';
		var _strokeWeight = 6;
		var _strokeOpacity = 0.8;
		var _suppressMarkers = false;
	}
		
		directionsDisplay = new google.maps.DirectionsRenderer({
			draggable: true, 
			suppressMarkers: _suppressMarkers, 
			polylineOptions: { 
				strokeColor: _colour,
				strokeWeight: _strokeWeight, 
				strokeOpacity: _strokeOpacity  
				}
			});
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('directions_panel'));
		directionsDisplay.setDirections(result);
		directionsDisplay.setRouteIndex(routeToDisplay);
		directionArray.push(directionsDisplay);
		
}
function clearRoute(){
	if(directionArray != null){
		for (var i = 0; i < directionArray.length; i++ ) {
			directionArray[i].setMap(null);
			directionArray[i].setPanel(null);
			directionArray[i] = null;
		}
	}  
directionArray.length = 0;
}

function requestDirections(start, end, travel_mode, directionsService, routeToDisplay, main_route) {
	
	directionsService.route({
      origin: {'placeId': start},
      destination: {'placeId': end},
      travelMode: travel_mode,
	  provideRouteAlternatives: main_route
    }, function(result, status) {
		
      if (status === google.maps.DirectionsStatus.OK)
    {
			
			if(main_route)
			{
				var rendererOptions = getRendererOptions(true);
				for (var i = 0; i < result.routes.length; i++)
				{
						renderDirections(result, rendererOptions, i);
				}
				
				
			}
			else
			{
				var rendererOptions = getRendererOptions(false);
				renderDirections(result, rendererOptions, routeToDisplay);
			
			}
				
			
			
		}
		else{
			window.alert('Şu nedenden dolayı herhangi bir yol bulunamadı: ' + status);
		}
	
	});
	
	
}

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Haritada bulunmayan bir yer.");
      return;
    }
    expandViewportToFitPlace(map, place);

    
    origin_place_id = place.place_id;
    
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Haritada bulunmayan bir yer.");
      return;
    }
    expandViewportToFitPlace(map, place);

  
    destination_place_id = place.place_id;
    
  });
	document.getElementById('drawRoute').addEventListener("click", function(){
	if($('#firstBox').val() != "" && $('#secondBox').val() != "")
	{
		clearRoute();
		$('#control_panel').css({display: 'block'});
		requestDirections(origin_place_id, destination_place_id, travel_mode, directionsService, 0, true);
		$('#description').css({display: 'none'});
	}
	
		  });
	document.getElementById('clearRoute').addEventListener("click", function(){
	clearRoute();
	$('#control_panel').css({display: 'none'});
	$('#description').css({display: 'block'});
    $('#firstBox').val("");
	$('#secondBox').val("");
		  });
 
	}