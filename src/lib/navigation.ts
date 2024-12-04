import axios from "axios";
import {Coordinate} from "../custom-types/route-types/routing-types.js";

async function getDistanceOpenRouteService(origin: { lat: number; long: number },
                                           destination: { lat: number; long: number }
) {

    const {data} = await axios.post('https://api.openrouteservice.org/v2/directions/driving-hgv', {
        coordinates: [[origin.long, origin.lat], [destination.long, destination.lat]],
        instructions: false,
        preference: "fastest",
        units: "km"
    }, {
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
    } catch {
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

    const {data} = await axios.get(url);

    return data.routes[0].distance / 1000;
}

export function calcDistanceFactor(distance: number) {
    const factor = Math.log10(distance + 1) / Math.log10(50);
    return factor > 1 ? factor : 1;
}

export async function getRoutingORS(coordinates: Coordinate[]) {
    // try {
    //   let response = await orsDirections.calculate({
    //     coordinates: coordinates,
    //     profile: 'driving-hgv',
    //     extra_info: ['waytype', 'steepness'],
    //     format: 'geojson'
    //   })
    //   // Add your own result handling here
    //   console.log("response: ", response)
    // return response
    //
    // } catch (err) {
    //   console.log("An error occurred: " + (err as any).status)
    //   console.error(err)
    // }


    const {data} = await axios.post('https://api.openrouteservice.org/v2/directions/driving-hgv/geojson', {
        coordinates,
        instructions: true,
        units: "km"
    }, {
        headers: {
            "Content-Type": "application/json",
            "Accept": 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            Authorization: process.env.ORS_TOKEN
        }
    })

    return {profile: 'ors', data}
}

export async function getRoutingOSRM(coordinates: Coordinate[]) {
    const formatedCordinates = coordinates.map(cordinate => cordinate.join(',')).join(';')
    const url = `http://router.project-osrm.org/route/v1/driving/${formatedCordinates}?overview=full&geometries=geojson&annotations=distance&steps=false&skip_waypoints=true`
    const {data} = await axios.get(url)
    return {profile: 'osrm', data}
}

export function getRouting(coordinates: Coordinate[]) {
    try {
        return getRoutingOSRM(coordinates)
    } catch {
        try {
            return getRoutingORS(coordinates)
        } catch (error) {
            throw error
        }
    }
}