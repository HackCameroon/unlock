const polyline = require('polyline');
const geolib = require('geolib');

let line = "koznE~ctpUu@IeAOQzBHBVBn@HzAPAX@PFLLJVDNHTZHZA^c@bCWfA]bA?HDJw@vAeE|HsBxD}B~DYd@]h@MDOJw@dAaBtBUXa@b@wAjAgCrBsB|AgBxA_@b@k@h@m@n@OTUh@M|@@`AHf@HTLVV\\hB~ANXTRl@j@hCtCd@Xz@jAdCdDbAlAlApA^\\H@D@tBxBnG|GjCfC|CnC|BfB~CbCnBbBzBdCrAlBx@vAxBdEvDnHhDpGtOlZzDjHjAbBFHBT@HfAxArBxBfC|BpB~A\\RpDhBzAd@t@LRDdALxEh@b@Hp@Xl@f@Zb@Zp@Rr@Hj@Nx@RbCN~DVtHXzD`@pDhC~Sf@bIJxG@PDNJR?|@EvHAjLKrZGpWGzSMza@CxJFvIHzEN|FLpDRpE|@pLzAxSpA|Ph@xHN|DH|EHzBJ|FTjMJjGZlQNnLX~O`@`T\\dQLpIt@z`@\\xQHnEDtGGhEQrDYvDMpAOnASTUbAiAdG}@lEOBO?WGSe@QMoCyGeC_Gc@sAk@qAsA}CkBuEwDcJsE_La@Cg@K{P_FiCu@_@gE]_EWaEIeA";

let lat = 34.0522;
let lng = -118.2437;

let waypoints = polyline.decode(line);
console.log(waypoints);

let minimum = Number.MAX_SAFE_INTEGER;

waypoints.forEach((waypoint) => {
  minimum = Math.min(minimum, geolib.getDistance(
    {latitude: lat, longitude: lng},
    {latitude: waypoint[0], longitude: waypoint[1]}
  ));
});

console.log(minimum);
