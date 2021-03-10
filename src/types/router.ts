export interface VueComponent {
  options: object
  _Ctor: VueComponent
}

export type MatchedRoute = { components: VueComponent[] }

export type Route = { matched: MatchedRoute[] }
