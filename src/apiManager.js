import axios from 'axios'

const opv = 'http://opv_master'
const opvApi = opv + ':5000/'
const opvDb = opv + ':5050/v1/files/'
const opvSt = opv + ':5001/'

export default class ApiManager {
  static getCampaignList () {
    return axios.get(opvApi + 'campaign')
  }
  static getCampaign (idCampaign, idMalette) {
    return axios.get(opvApi + 'campaign/' + idCampaign + '/' + idMalette)
  }
  static getLotWithSensors (idLot, idMalette) {
    return axios.get(opvApi + 'lot/with_sensors/' + idLot + '/' + idMalette)
  }
  static getLotPicturesPath (path) {
    return axios.get(opvDb + path)
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
}
