import Vue from 'vue'
import Router from 'vue-router'
import CampaignList from '@/components/CampaignList'
import Campaign from '@/components/Campaign'

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
    }
  ]
})
