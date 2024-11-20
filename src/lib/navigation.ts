import axios from "axios";
async function getDistanceOpenRouteService(origin: { lat: number; long: number },
destination: { lat: number; long: number }
) {

  const {data} = await axios.post('https://api.openrouteservice.org/v2/directions/driving-hgv', {coordinates:[[origin.long,origin.lat],[destination.long,destination.lat]],instructions:false,preference:"fastest",units:"km"}, {
    headers: {
      "Content-Type": "application/json",
      "Accept": 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      Authorization: process.env.ORS_TOKEN
    }
  })
  return (data.routes[0].summary.distance)
}
export async function getDistance(
    origin: { lat: number; long: number },
    destination: { lat: number; long: number }
) {
  let distance: number
  try {
    distance = await getDistanceMapBox(origin, destination);
  }
  catch {
    distance = await getDistanceOpenRouteService(origin, destination);
  }
  return distance;
}
async function getDistanceMapBox(
  origin: { lat: number; long: number },
  destination: { lat: number; long: number }
) {

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${
    origin.long
  },${origin.lat};${destination.long},${destination.lat}?access_token=${process.env.MAPBOX_TOKEN}`;

  const { data } = await axios.get(url);

  return data.routes[0].distance/1000;
}
export function calcDistanceFactor(distance: number) {
  const factor = Math.log10(distance + 1) / Math.log10(50);
  console.log("factor", factor);
  return factor > 1 ? factor : 1;
}
