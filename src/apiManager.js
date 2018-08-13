import axios from 'axios'
import Config from '@/config.json'

const opv = Config.server.host
const opvApi = opv + ':' + Config.server.api_port + '/'
const opvDb = opv + ':' + Config.server.dm_port + '/v1/files/'
const opvSt = opv + ':' + Config.server.status_port + '/'

export default class ApiManager {
  static getCampaignList () {
    return axios.get(opvApi + 'campaign')
  }
  static getCampaign (idCampaign, idMalette) {
    return axios.get(opvApi + 'campaign/' + idCampaign + '/' + idMalette)
  }
  static getCampaignLotsWithSensors (idCampaign) {
    return axios.get(opvApi + 'lot/with_sensors?id_campaign=' + idCampaign)
  }
  static getLotPicturesPath (path) {
    return axios.get(opvDb + path)
  }
  static getLot (idLot, idMalette) {
    return axios.get(opvApi + 'lot/' + idLot + '/' + idMalette)
  }
  static getSensors (idSensors, idMalette) {
    return axios.get(opvApi + 'sensors/' + idSensors + '/' + idMalette)
  }
  static getTile (idTile, idMalette) {
    return axios.get(opvApi + 'tile/' + idTile + '/' + idMalette)
  }
  static getImportStatus () {
    return axios.get(opvSt + 'import/status')
  }
  static postImportLaunch (args) {
    return axios.post(opvSt + 'import/launch', args)
  }
  static postImportLog (args) {
    return axios.post(opvSt + 'import/log', args)
  }
  static postSparkLaunch (args) {
    return axios.post(opvSt + 'spark/launch', args)
  }
  static getSparkPort () {
    return axios.get(opvSt + 'spark/port')
  }
  static getSparkApp (port) {
    return axios.get(opv + ':' + port + '/api/v1/applications')
  }
  static getSparkJob (port, app) {
    return axios.get(opv + ':' + port + '/api/v1/applications/' + app + '/jobs')
  }
  static putSensors (sensors) {
    return axios.put(opvApi + 'sensors/' + sensors.id_sensors + '/' + sensors.id_malette, sensors)
  }
}
