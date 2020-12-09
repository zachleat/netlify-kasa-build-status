require('dotenv').config();
const { Client } = require('tplink-smarthome-api');
const NetlifyAPI = require('netlify');
const LIGHT_ALIAS_PREFIX = "Office ";

const netlifyClient = new NetlifyAPI(process.env.NETLIFY_TOKEN)
const tplinkClient = new Client();

async function getNewestBuilds() {
  let builds = await netlifyClient.listSiteBuilds({
    site_id: process.env.SITE_ID
  });
  console.log( `Netlify API found ${builds.length} builds.` );

  return builds;
}

(async function() {
  let builds = await getNewestBuilds();
  tplinkClient.startDiscovery().on('device-new', async (device) => {
    
    let info = await device.getSysInfo();
    if(info.alias.startsWith(LIGHT_ALIAS_PREFIX)) {
      let index = parseInt(info.alias.substr(LIGHT_ALIAS_PREFIX.length), 10) - 1;
      let build = builds[index];
      let statusMsg;

      let hue;
      if( !build ) {
        statusMsg = "No builds found";
        hue = 53;
      } else if( build.done === false) {
        statusMsg = "In progress";
        hue = 53; // orange
      } else if( !!build.error ) {
        statusMsg = "Build error!";
        hue = 360; // red
      } else {
        statusMsg = "Build success";
        hue = 100; // green
      }

      let result = await device.lighting.setLightState({
        on_off: 1,
        // transition_period: 100,
        hue, // 0-360
        saturation: 100, // 0-100
        brightness: 100, // 0-100
        color_temp: null, // 2500-9000
      });
  
      console.log( `${info.alias} ${statusMsg}, Light updated: ${result}` );
    }

    tplinkClient.stopDiscovery();
  });
})();
