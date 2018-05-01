import Vue from 'vue'
import Router from 'vue-router'
import CampaignList from '@/components/CampaignList'
import Campaign from '@/components/Campaign'
import PanoViewer from '@/components/PanoViewer'
import ImportCampaign from '@/components/ImportCampaign'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CampaignList',
      component: CampaignList
    },
    {
      path: '/campaign/:id_campaign/:id_malette',
      props: true,
      name: 'Campaign',
      component: Campaign
    },
    {
      path: '/viewer/:id_tile/:id_malette',
      props: true,
      name: 'Viewer',
      component: PanoViewer
    },
    {
      path: '/import/',
      props: false,
      name: 'ImportCampaign',
      component: ImportCampaign
    }
  ]
})
