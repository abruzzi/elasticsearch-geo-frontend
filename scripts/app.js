$(function() {
	var client = new $.es.Client({
	  hosts: 'localhost:9200'
	});

	var map = L.map('map').setView([-37.6899474, 145.123149867], 10);
	L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	      attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
	      subdomains: ['otile1','otile2','otile3','otile4'],
	      detectRetina: true
	  }).addTo( map );

	function onEachFeature(feature, layer) {
		var popupContent = "<p>" +
				feature.properties.LOCALITY + ":" + 
				feature.properties.UFI_CR + "</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

	$('#search').on('click', function() {
		var query = $('#query').val();

		client.search({
		  index: 'suburbs',
		  type: 'suburb',
		  body: {
		    query: {
		      match: {
		        'LOCALITY': $.trim(query.toUpperCase())
		      }
		    }
		  }
		}).then(function (resp) {
		    var hits = resp.hits.hits;
		    console.log(hits);

		    $('#info').empty();
		    hits.forEach(function(hit) {
		    	var item = $('<li></li>')
		    	.addClass('information')
		    	.text(hit._source.properties.LOCALITY + '@' + hit._source.properties.UFI_CR);
		    	item.appendTo($('#info'));

		    	var geo = hit._source;
		    	L.geoJson(geo, {
		    		style: {
			            weight: 2,
			            color: "#999",
			            opacity: 1,
			            fillColor: "#B0DE5C",
			            fillOpacity: 0.8
			        },
		    		onEachFeature: onEachFeature
		    	}).addTo(map);
		    });

		}, function (err) {
		    console.trace(err.message);
		});
	})
})
