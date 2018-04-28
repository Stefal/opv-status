import Vue from 'vue'
import Router from 'vue-router'
import CampaignList from '@/components/CampaignList'
import Campaign from '@/components/Campaign'
import PanoViewer from '@/components/PanoViewer'

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
      path: '/viewer/:id_lot/:id_malette',
      props: true,
      name: 'Viewer',
      component: PanoViewer
    }
  ]
})
