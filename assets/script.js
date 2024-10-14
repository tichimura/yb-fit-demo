// local_connection_limit でコネクションの上限をハードコード

mapboxgl.accessToken = 'pk.eyJ1IjoidGljaGltdXJhLXliIiwiYSI6ImNsbTBjbHN0eDJweG8zZHBlZnllMTN4OGoifQ.eG5GGh24GJnXqlNrAmGO5g';
const map = new mapboxgl.Map({
        container: 'map',
        zoom: 5,
        center: [135.4080,34.5510],
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',      
        // style: 'mapbox://styles/mapbox/dark-v8', //stylesheet location
        projection: 'mercator'
});

map.flyTo({center: [135.4080,34.5510], zoom: 6,speed: 0.2});

const periods = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10'
];

// connection上限を指定

const local_connection_limit = 10;            
const total_connection_limit = 30;

map.addControl(new mapboxgl.NavigationControl());

const colors = ['#e31a1c','#fd8d3c'];

var target_points= {
  "type": "FeatureCollection",
  "features": [
      {
      'type': 'Feature',
      'properties': {
        "id": "1",
        "name": "Tokyo",
        "nodename": "unique-stoat-n1",
        "region":"ap-northeast-1",
        "state": true,
        "usage": 0,
        "time": 1507425650893            
      },          
      'geometry': {
        'type': 'Point',
        'coordinates': [139.8807, 35.6734]
      }
    },
    {
      'type': 'Feature',
      'properties': {
        "id": "2",            
        "name": "Osaka",
        "nodename": "unique-stoat-n3",
        "region":"ap-northeast-3",
        "state": true,
        "usage": 0,
        "time": 1507425650893                        
      },          
      'geometry': {
      'type': 'Point',
      'coordinates': [135.4080,34.5510]
      }
      },
      {
      'type': 'Feature',
      'properties': {
        "id": "3",
        "name": "Kitakyushu",
        "nodename": "unique-stoat-n2",
        "region":"ap-northeast-2",
        "state": true,
        "usage": 0,
        "time": 1507425650893
      },          
      'geometry': {
      'type': 'Point',
      'coordinates': [130.7431, 33.9061]
      }
      }         
  ]
}

var line1 = turf.lineString([
  [139.8807, 35.6734],
  [134.9285, 36.5003],
  [130.7431, 33.9061]
]);

var line2 = turf.lineString([
  [130.7431, 33.9061],
  [135.3572, 36.2624],
  [139.8807, 35.6734]
]);

var line3 = turf.lineString([
  [139.8807, 35.6734],
  [137.9879, 34.6956],
  [135.4080,34.5510]
]);

var line4 = turf.lineString([
  [135.4080,34.5510],
  [138.0924, 34.8848],
  [139.8807, 35.6734]
]);

var line5 = turf.lineString([
  [135.4080,34.5510],
  [133.4268, 33.7559],
  [130.7431, 33.9061]
]);

var line6 = turf.lineString([
  [130.7431, 33.9061],
  [133.5868, 33.4586],
  [135.4080,34.5510]
]);

var curved1 = turf.bezierSpline(line1, {sharpness: 1});
var curved2 = turf.bezierSpline(line2, {sharpness: 1});
var curved3 = turf.bezierSpline(line3, {sharpness: 1});
var curved4 = turf.bezierSpline(line4, {sharpness: 1});
var curved5 = turf.bezierSpline(line5, {sharpness: 1});
var curved6 = turf.bezierSpline(line6, {sharpness: 1});


map.on('load',async () => {
    // add a clustered GeoJSON source for a sample set of earthquakes
  
    map.addSource('datacenters', {
        'type': 'geojson',
        'data': target_points
        // }
    });

    // add points for pulse
    map.addSource('projects', {
      'type': 'geojson',
      'data': target_points
    });
    
    // tokyo -> kitakyushu(Seoul)
    map.addSource('route1', {
      'type': 'geojson',
      'data': curved1
    });    

    // kitakyushu(Seoul) -> tokyo
    map.addSource('route2', {
      'type': 'geojson',
      'data': curved2
    });

    // tokyo -> osaka
    map.addSource('route3', {
      'type': 'geojson',
      'data': curved3
    });    

    // osaka -> tokyo
    map.addSource('route4', {
      'type': 'geojson',
      'data': curved4
    });

    map.addSource('route5', {
      'type': 'geojson',
      'data': curved5
    });    

    map.addSource('route6', {
      'type': 'geojson',
      'data': curved6
    });
    
    // map.addLayer({
    //     'id': 'datacenter_circle',
    //     'type': 'circle',
    //     'source': 'datacenters',
    //     'paint': {
    //         'circle-color': ['case',true,'#ffffff','#000000'],
    //         'circle-opacity': 1,
    //         'circle-radius': 30
    //     }
    // }); 
  
    // map.addLayer({
    //     'id': 'datacenter_symbol',
    //     'type': 'symbol',
    //     'source': 'datacenters',
    //     'layout': {
    //       'text-field': ['get', 'usage'],
    //       'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    //       'text-size': 20
    //     },
    //     'paint': {
    //       'text-color': 'rgba(0,0,0,0.5)'
    //     }            
    // });    

    map.addLayer({
      'id': 'projects-pulse',
      'type': 'circle',
      'source': 'projects',
      "paint": {
              "circle-radius": 0,
              "circle-color": "#B42222"
          }
    });
    
    map.addLayer({
      'id': 'route1',
      'type': 'line',
      'source': 'route1',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route1-dashed',
      'type': 'line',
      'source': 'route1',
      'layout': {
        'visibility': 'none'
      },      
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });    

    map.addLayer({
      'id': 'route2',
      'type': 'line',
      'source': 'route2',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route2-dashed',
      'type': 'line',
      'source': 'route2',
      'layout': {
        'visibility': 'none'
      },       
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });      

    map.addLayer({
      'id': 'route3',
      'type': 'line',
      'source': 'route3',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route3-dashed',
      'type': 'line',
      'source': 'route3',
      'layout': {
        'visibility': 'none'
      },       
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });       

    map.addLayer({
      'id': 'route4',
      'type': 'line',
      'source': 'route4',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route4-dashed',
      'type': 'line',
      'source': 'route4',
      'layout': {
        'visibility': 'none'
      },        
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });       

    map.addLayer({
      'id': 'route5',
      'type': 'line',
      'source': 'route5',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route5-dashed',
      'type': 'line',
      'source': 'route5',
      'layout': {
        'visibility': 'none'
      },      
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });      

    map.addLayer({
      'id': 'route6',
      'type': 'line',
      'source': 'route6',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'none'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-opacity': 0.4
      }
    });

    map.addLayer({
      'id': 'route6-dashed',
      'type': 'line',
      'source': 'route6',
      'layout': {
        'visibility': 'none'
      },  
      'paint': {
        'line-color': '#888',
        'line-width': 4,
        'line-dasharray': [0, 4, 3]
      }
    });
    
    map.addLayer({
      'id': 'datacenter_circle',
      'type': 'circle',
      'source': 'datacenters',
      'paint': {
          'circle-color': ['case',true,'#ffffff','#000000'],
          'circle-opacity': 1,
          'circle-radius': 30
      }
  }); 

  map.addLayer({
      'id': 'datacenter_symbol',
      'type': 'symbol',
      'source': 'datacenters',
      'layout': {
        'text-field': ['get', 'usage'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 20
      },
      'paint': {
        'text-color': 'rgba(0,0,0,0.5)'
      }            
  });     

    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5]
      ];
       
    let step = 0;

    function animateDashArray(timestamp) {
      // Update line-dasharray using the next value in dashArraySequence. The
      // divisor in the expression `timestamp / 50` controls the animation speed.
      const newStep = parseInt(
      (timestamp / 50) % dashArraySequence.length
      );
       
      if (newStep !== step) {
        map.setPaintProperty(
          'route1-dashed',
          'line-dasharray',
          dashArraySequence[step]
          );
          map.setPaintProperty(
            'route2-dashed',
            'line-dasharray',
          dashArraySequence[step]
          );
  
        map.setPaintProperty(
          'route3-dashed',
          'line-dasharray',
        dashArraySequence[step]
        );
  
        map.setPaintProperty(
          'route4-dashed',
          'line-dasharray',
        dashArraySequence[step]
        );
        
        map.setPaintProperty(
          'route5-dashed',
          'line-dasharray',
        dashArraySequence[step]
        );
  
        map.setPaintProperty(
          'route6-dashed',
          'line-dasharray',
        dashArraySequence[step]
        );

      step = newStep;
      }
       
      // Request the next frame of the animation.
      requestAnimationFrame(animateDashArray);
    }
            
    const markers = {};

    async function updateMarkers(){
      setInterval(async function() {

      var total_connection_num = 0;

      // console.log(target_points.features.length + " is length.");



      for (const feature of target_points.features) {
        
          const coords = feature.geometry.coordinates;
          const props = feature.properties;
          const id = props.id;
          const regionname = props.region;
          const state = props.state;

          // uncomment below lines for demo

          const ybmJson = await fetch('/status', {method:'GET'}).then(response => response.json());

          const info_state = ybmJson.data.info.state;    

          if(!state && info_state == "ACTIVE"){
            props.state = true;
          };

          
          if(state){

          const connection_num = await fetch('/connections?region='+ regionname, {method:'GET'}).then(response => response.json());
          // const connection_num = 1

          if(typeof connection_num === 'object' && connection_num !== null){
            continue;
          };

          
          if(connection_num > local_connection_limit){
            // connection_num = local_connection_limit
            continue;
          }
                    
          const connection_usage = Math.trunc(connection_num / local_connection_limit * 100);
          map.getSource('datacenters').setData(target_points);
          total_connection_num += connection_num;             
          
          // console.log(connection_usage + " is connection usage");
                        
          target_points.features[id - 1].properties.usage = Math.trunc(connection_usage);
            
          map.getSource('datacenters').setData(target_points);                
          
          let marker = markers[id];
          if (marker) marker.remove();

          const el = createDonutChart(props);
          marker = markers[id] = new mapboxgl.Marker({
            element: el
          }).setLngLat(coords);

          marker.addTo(map);

          if(document.getElementById('dataflowSwitch').checked){

            if(feature.properties.id == '1'){
              visibleDashedLayerNode1();
            }else if(feature.properties.id == '2'){
              if(map.getLayoutProperty('route3-dashed','visibility') == 'none'){
                map.setLayoutProperty('route5-dashed', 'visibility', 'visible');
                map.setLayoutProperty('route6-dashed', 'visibility', 'visible');
              }else{
                visibleDashedLayerNode2();
              }
            }else if(feature.properties.id == '3'){
              if(map.getLayoutProperty('route3-dashed','visibility') != 'none' && map.getLayoutProperty('route5-dashed','visibility') != 'none'){                
                visibleDashedLayerNode3();
              }
            }
          }
          
        }else{
          markers[id].remove();
          if(document.getElementById('dataflowSwitch').checked){

            if(id == '1'){
              hideDashedLayerNode1();
            }else if(id == '2'){
              hideDashedLayerNode2();
            }else if(id == '3'){
              hideDashedLayerNode3();
            }
          }
        }


      };

      var connection_num;
      
      if(total_connection_num >= total_connection_limit){
        document.getElementById('loadButton').disabled = true;
        connection_num = total_connection_limit;
      }else{
        document.getElementById('loadButton').disabled = false;
        connection_num = total_connection_num;
      }
      document.getElementById('resetButton').disabled = false;
      document.getElementById('connections').textContent = connection_num; 

      // visibleLayer();

      if(document.getElementById('dataflowSwitch').checked){

        if(total_connection_num >= Math.trunc(total_connection_limit * 2 / 3)){
        map.setPaintProperty(
          'route1-dashed',
          'line-color',
          'orangered'
        );
        map.setPaintProperty(
          'route2-dashed',
          'line-color',
          'orangered'
        );

        map.setPaintProperty(
          'route3-dashed',
          'line-color',
          'orangered'
        );

        map.setPaintProperty(
          'route4-dashed',
          'line-color',
          'orangered'
        );
      
        map.setPaintProperty(
          'route5-dashed',
          'line-color',
          'orangered'
        );

        map.setPaintProperty(
          'route6-dashed',
          'line-color',
          'orangered'
        );

        }else if(total_connection_num >= Math.trunc(total_connection_limit/3)){
          map.setPaintProperty(
            'route1-dashed',
            'line-color',
            'yellow'
          );
          map.setPaintProperty(
            'route2-dashed',
            'line-color',
            'yellow'
          );

          map.setPaintProperty(
            'route3-dashed',
            'line-color',
            'yellow'
          );

          map.setPaintProperty(
            'route4-dashed',
            'line-color',
            'yellow'
          );
        
          map.setPaintProperty(
            'route5-dashed',
            'line-color',
            'yellow'
          );

          map.setPaintProperty(
            'route6-dashed',
            'line-color',
            'yellow'
          );

        }else{
          map.setPaintProperty(
            'route1-dashed',
            'line-color',
            '#888'
          );
          map.setPaintProperty(
            'route2-dashed',
            'line-color',
            '#888'
          );

          map.setPaintProperty(
            'route3-dashed',
            'line-color',
            '#888'
          );

          map.setPaintProperty(
            'route4-dashed',
            'line-color',
            '#888'
          );
        
          map.setPaintProperty(
            'route5-dashed',
            'line-color',
            '#888'
          );

          map.setPaintProperty(
            'route6-dashed',
            'line-color',
            '#888'
          );  
        }

      } 

    }, 3000);

      loadSlider();
      loadButton();
      resetButton();
      dataflowSwitch();

    }

    // after the GeoJSON data is loaded, update markers on the screen on every frame
    // TODO: can be removed or fixed

    map.on('render', async () => {          
        if (!map.isSourceLoaded('datacenters')) return;
    });

    // POPUP

    map.on('click', 'datacenter_circle', async (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const placename = e.features[0].properties.name;
      const nodename = e.features[0].properties.nodename;
      const id = e.features[0].properties.id;
      // const state = e.features[0].properties.state;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const popdiv = window.document.createElement('div');
      popdiv.className = 'button';
      popdiv.style.height = '200px';
      var circle_loader = '<div class="loader"></div>';
      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popdiv)
        .setHTML(circle_loader)
        .addTo(map);
      
      const ybmJson = await fetch('/status', {method:'GET'}).then(response => response.json());

      const cloud_info_code = ybmJson.data.spec.cloud_info.code;
      const cluster_info_num_nodes = ybmJson.data.spec.cluster_info.num_nodes;
      const cluster_info_fault_tolerance = ybmJson.data.spec.cluster_info.fault_tolerance;
      const cluster_state = ybmJson.data.info.state;

      const ybmNodesJson = await fetch('/node-status', {method:'GET'}).then(response => response.json());
      const ybmNodesJsonData = ybmNodesJson.data;

      function getNodeStatusByNodeName(name) {
        return ybmNodesJsonData.filter(
            function(ybmNodesJsonData){ return ybmNodesJsonData.name == name }
        );
      };

      const nodeData = getNodeStatusByNodeName(nodename);
      const state = nodeData[0].is_node_up;
                
      var description = ' 拠点 : <b>' + 
      placename + '</b><br>' +
      ' 環境 : <b>' + cloud_info_code + '</b><br>' +
      ' サービス : <b>' + state + '</b><br>' +
      ' 冗長構成 : <b>' + cluster_info_fault_tolerance + '</b><br>' +
      ' ノード数: <b>' + cluster_info_num_nodes + '</b><br>' +
      '状態変更: ' + 
      // '<button type="button" id="resumeButton" class="resumeButton" name="test-animation" disabled> \
      // システム起動 \
      // </button> \
      // <button type="button" id="pauseButton" class="pauseButton" name="test-animation" disabled> \
      // システム停止 \
      // </button>';
      '<button type="button" id="inprogressButton" class="inprogressButton" name="test-animation"> \
      システム変更中 \
      </button><br>\
      <button type="button" id="resumeButton" class="resumeButton" name="test-animation"> \
      システム起動 \
      </button> \
      <button type="button" id="pauseButton" class="pauseButton" name="test-animation"> \
      システム停止 \
      </button>';

      popup.setHTML(description);
      

// Added for in progress 
      const inprogressButton = document.getElementById('inprogressButton');

// TODO: check the shutdown scenario
      const resumeButton = document.getElementById('resumeButton');

      if(state && cluster_state=='ACTIVE'){
      // if(state=='ACTIVE'){
        resumeButton.style.visibility="hidden";
        inprogressButton.style.visibility="hidden";
      }

      resumeButton.addEventListener('click', async () => {
          const node_ops =  await fetch('/node-ops?action=START&nodename=' +nodename, {method:'POST', mode: "cors"}).then(response => response.text());
          console.log(node_ops);

          for ( const feature of target_points.features){

            if(feature.properties.nodename == nodename){

              if(document.getElementById('dataflowSwitch').checked){

                if(feature.properties.id == '1'){
                  visibleDashedLayerNode1();
                }else if(feature.properties.id == '2'){
                  visibleDashedLayerNode2();
                }else if(feature.properties.id == '3'){
                  visibleDashedLayerNode3();
                }
              }
            }
          }
    
      });

      const pauseButton = document.getElementById('pauseButton');
      if(!state && cluster_state=='ACTIVE'){
        pauseButton.style.visibility="hidden";
        inprogressButton.style.visibility="hidden";
      }
      pauseButton.addEventListener('click', async () => {
          const node_ops =  await fetch('/node-ops?action=STOP&nodename=' +nodename, {method:'POST', mode: "cors"}).then(response => response.text());          
          console.log(node_ops);

          markers[id].remove();

          for (const feature of target_points.features) {
            if(feature.properties.nodename == nodename){
              feature.properties.state = false;

              if(document.getElementById('dataflowSwitch').checked){

                if(feature.properties.id == '1'){
                  hideDashedLayerNode1();
                }else if(feature.properties.id == '2'){
                  hideDashedLayerNode2();
                }else if(feature.properties.id == '3'){
                  hideDashedLayerNode3();
                }
              }
                  
            }
          }
          map.getSource('datacenters').setData(target_points);

      });


      if(cluster_state=='STOPPING_NODE' || cluster_state =='STARTING_NODE'){
        inprogressButton.style.visibility="true";
        pauseButton.style.visibility="hidden";
        resumeButton.style.visibility="hidden";
      }
      

// TODO: This part is future development

    //   const addButton = document.getElementById('addButton');
    //   addButton.addEventListener('click', () => {
    //     if(cluster_info_num_nodes < 6){
    //       const ybmJsonUpdate = ybmJson;
    //       ybmJsonUpdate.data.spec.cluster_info.num_node=6;
    //       ybmJsonUpdate.data.spec.cluster_region_info[0].placement_info.num_nodes=6;
    //       console.log("追加操作をリクエストしました.");
    //     }else{
    //       console.log("ノード数の上限です");
    //     }
    // });

    // const deleteButton = document.getElementById('deleteButton');
    //   deleteButton.addEventListener('click', () => {
    //     if(cluster_info_num_nodes > 3){
    //       const ybmJsonUpdate = ybmJson;
    //       ybmJsonUpdate.data.spec.cluster_info.num_node=3;
    //       ybmJsonUpdate.data.spec.cluster_region_info.placement_info.num_nodes=3;
    //       console.log("削除操作をリクエストしました.");
    //     }else{
    //       console.log("ノード数の下限です");
    //     }
    // });
      
      
    });      

    // pulse project

    var framesPerSecond = 4;
    var opacity = .1;
    var circleRadius = 20;

    function pulseMarker(){

      setTimeout(function() {
        requestAnimationFrame(pulseMarker)
        opacity -= ( .3 / framesPerSecond );
        circleRadius += ( 10 / framesPerSecond );
        map.getSource('datacenters').setData(target_points);
        // map.setPaintProperty('projects-pulse', 'circle-opacity', ['-',opacity,['/', 0.3, framesPerSecond]]);
        map.setPaintProperty('projects-pulse', 'circle-opacity', opacity)
        map.setPaintProperty('projects-pulse', 'circle-radius',circleRadius);
        map.setPaintProperty('projects-pulse', 'circle-color', ['case', ['>',['get', 'usage'],70],'#ff0000',['>',['get', 'usage'],25],'#f5ca08','#E6E6FA']);
        if (opacity <= 0.1) {
          opacity = 0.5;
          circleRadius = 100;
        }

      }, 1000 / framesPerSecond );
    }


//    pulseMarker();
    updateMarkers();
    // visibleLayer();
    animateDashArray(0);

    // comment out for YBM API
  
});


async function loadGenerator(period) {
  // document.getElementById('period').textContent = periods[period];
  // document.getElementById('loadButton').disabled = true;
  // var localLog =  await fetch('/load?clients=' + periods[period], {method:'POST', mode: "cors"}).then(response => response.text());
  // console.log("Requesting " + periods[period] + " clients ," + localLog);
  var localLog =  await fetch('/load?clients=' + period, {method:'POST', mode: "cors"}).then(response => response.text());
  console.log("Requesting " + period + " clients ," + localLog);
};

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
  
    const offsets = [];
  
    const counts = [
        props.usage,
        100 - props.usage
    ];
  
    let total = 0;
    for (const count of counts) {
        offsets.push(total);
        total += count;
    }
          
    const fontSize = 22;
    const r = 50;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;
    const city_name = props.name;
    
    let html = `<div id=${city_name}>
        <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;

    for (let i = 0; i < counts.length; i++) {
        html += donutSegment(
            offsets[i] / 100,
            (offsets[i] + counts[i]) / 100,
            r,
            r0,
            colors[i]
        );
    }
    html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
        <text dominant-baseline="central" transform="translate(${r}, ${r})">
            ${props.usage.toLocaleString()}%
        </text>
        </svg>
        </div>`;

    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
}

function donutSegment(start, end, r, r0, color) {
    if (end - start === 1) end -= 0.00001;
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
        y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
        y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

    // draw an SVG path
    return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
    } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
    } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
    }" fill="${color}" />`;
}

function loadSlider(err) {
  if (err) {
      throw err;
  }     document.getElementById('slider').addEventListener('input', (e) => {
      const period = parseInt(e.target.value, 10);
      document.getElementById('period').textContent = periods[period];
  });
}

function loadButton(err) {
  if (err) {
      throw err;
  } document.getElementById('loadButton').addEventListener('click', async (e) => {
        document.getElementById('loadButton').disabled = true;
        var sliderValue = parseInt(periods[document.getElementById('slider').value],10);
        // var connectionValue = parseInt(await fetch('/connections', {method:'GET'}).then(response => response.text()),10);
        var connectionValue = parseInt(document.getElementById('connections').textContent);
        var requestValue;
        var calcValue = connectionValue + sliderValue;
        // console.log(calcValue + " is calcvalue ");
        // console.log(sliderValue + " is sliderValue ");
        // console.log(connectionValue + " is connectionValue ");

        if(connectionValue != null && calcValue > total_connection_limit){
          requestValue = total_connection_limit - connectionValue;    
          document.getElementById('period').textContent = requestValue;
        }else if(connectionValue != null && calcValue <= total_connection_limit){
          requestValue = sliderValue;
          document.getElementById('period').textContent = requestValue;
        }else{
          throw e;
        }
        await loadGenerator(requestValue);
  });
}

function resetButton(err) {

  if (err) {
      throw err;
  } document.getElementById('resetButton').addEventListener('click', async (e) => {
    for (const feature of target_points.features) {
      try{
        await fetch('/reset?region='+feature.properties.region, {method:'GET', mode: "cors"}).then(response => response.text());
      }catch(e){
        console.log('Error: ' + e + ': ' + feature.properties.region + 'のreset中に、errorが発生しました。')
      }

    }
    document.getElementById('resetButton').disabled = true;
    document.getElementById('period').textContent = 0;
    document.getElementById('slider').value = 0;

  });
}    

function dataflowSwitch(err){
  if(err){
    throw err;
  }

  document.getElementById('dataflowSwitch').addEventListener('change', async (e) => {

    const ybmNodesJson = await fetch('/node-status', {method:'GET'}).then(response => response.json());
    const ybmNodesJsonData = ybmNodesJson.data;

    function getNodeStatusByNodeName(name) {
      return ybmNodesJsonData.filter(
          function(ybmNodesJsonData){ return ybmNodesJsonData.name == name }
      );
    };


    if(e.target.checked) {
      map.setLayoutProperty('route1', 'visibility', 'visible');
      map.setLayoutProperty('route2', 'visibility', 'visible');
      map.setLayoutProperty('route3', 'visibility', 'visible');
      map.setLayoutProperty('route4', 'visibility', 'visible');
      map.setLayoutProperty('route5', 'visibility', 'visible');
      map.setLayoutProperty('route6', 'visibility', 'visible');
      map.setLayoutProperty('route1-dashed', 'visibility', 'visible');
      map.setLayoutProperty('route2-dashed', 'visibility', 'visible');
      map.setLayoutProperty('route3-dashed', 'visibility', 'visible');
      map.setLayoutProperty('route4-dashed', 'visibility', 'visible');
      map.setLayoutProperty('route5-dashed', 'visibility', 'visible');
      map.setLayoutProperty('route6-dashed', 'visibility', 'visible');

      for ( const feature of target_points.features){
        const nodeData = getNodeStatusByNodeName(feature.properties.nodename);
        const state = nodeData[0].is_node_up;
      
        if(!state){
          if(feature.properties.id == '1'){
            hideDashedLayerNode1();
          }else if(feature.properties.id == '2'){
            hideDashedLayerNode2();
          }else if(feature.properties.id == '3'){
            hideDashedLayerNode3();
          }
        }

      }
    }else{
        map.setLayoutProperty('route1', 'visibility', 'none');
        map.setLayoutProperty('route1-dashed', 'visibility', 'none');
        map.setLayoutProperty('route2', 'visibility', 'none');
        map.setLayoutProperty('route2-dashed', 'visibility', 'none');
        map.setLayoutProperty('route3', 'visibility', 'none');
        map.setLayoutProperty('route3-dashed', 'visibility', 'none');
        map.setLayoutProperty('route4', 'visibility', 'none');
        map.setLayoutProperty('route4-dashed', 'visibility', 'none');
        map.setLayoutProperty('route5', 'visibility', 'none');
        map.setLayoutProperty('route5-dashed', 'visibility', 'none');
        map.setLayoutProperty('route6', 'visibility', 'none');
        map.setLayoutProperty('route6-dashed', 'visibility', 'none');
    }    
  });
}

// node1


function visibleDashedLayerNode1(){
      
  map.setLayoutProperty(
    'route1-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route2-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route3-dashed',
    'visibility',
    'visible'
    );

  map.setLayoutProperty(
    'route4-dashed',
    'visibility',
    'visible'
    );
}

function hideDashedLayerNode1(){
      
  map.setLayoutProperty(
    'route1-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route2-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route3-dashed',
    'visibility',
    'none'
    );

  map.setLayoutProperty(
    'route4-dashed',
    'visibility',
    'none'
    );

}

// node2

function visibleDashedLayerNode2(){
      
  map.setLayoutProperty(
    'route3-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route4-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route5-dashed',
    'visibility',
    'visible'
    );

  map.setLayoutProperty(
    'route6-dashed',
    'visibility',
    'visible'
    );
}

function hideDashedLayerNode2(){
      
  map.setLayoutProperty(
    'route3-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route4-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route5-dashed',
    'visibility',
    'none'
    );

  map.setLayoutProperty(
    'route6-dashed',
    'visibility',
    'none'
    );

}

// node3

function visibleDashedLayerNode3(){
      
  map.setLayoutProperty(
    'route1-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route2-dashed',
    'visibility',
    'visible'
    );


  map.setLayoutProperty(
    'route5-dashed',
    'visibility',
    'visible'
    );

  map.setLayoutProperty(
    'route6-dashed',
    'visibility',
    'visible'
    );
}

function hideDashedLayerNode3(){
      
  map.setLayoutProperty(
    'route1-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route2-dashed',
    'visibility',
    'none'
    );


  map.setLayoutProperty(
    'route5-dashed',
    'visibility',
    'none'
    );

  map.setLayoutProperty(
    'route6-dashed',
    'visibility',
    'none'
    );

}