import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  stateFactory: true,
  namespaced: true
})
export default class Main extends VuexModule {
  public nav:boolean = false
  
  
  @Mutation
  toggleNav() {
    this.nav = !this.nav
  }
  get navStatus() { return this.nav };
}
