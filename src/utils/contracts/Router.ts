interface VueComponent {
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: object
  _Ctor: VueComponent
}

type match = { components: VueComponent[] }
export type Route = { matched: match[] }

export default Route
