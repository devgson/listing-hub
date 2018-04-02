// $('#map_full_width_one').gmap3({
//         map: {
//           options: {
//             zoom: 5,
//             center: [store.info.address_latitude, store.info.address_longitude],
//             mapTypeControl: true,
//             mapTypeControlOptions: {
//               style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
//             },
//             mapTypeId: "style1",
//             mapTypeControlOptions: {
//               mapTypeIds: [google.maps.MapTypeId.ROADMAP, "style1"]
//             },
//             navigationControl: true,
//             scrollwheel: false,
//             streetViewControl: true
//           }
//         },
//         marker: {
//           latLng: [store.address_latitude, store.address_longitude],
//           options: {animation:google.maps.Animation.BOUNCE, icon: 'assets/img/marker.png' }
//         },
//         styledmaptype: {
//           id: "style1",
//           options: {
//             name: "Style 1"
//           },
//         }
//       })