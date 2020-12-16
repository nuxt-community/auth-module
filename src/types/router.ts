interface VueComponent {
  options: object
  _Ctor: VueComponent
}

type match = { components: VueComponent[] }

export type Route = { matched: match[] }
