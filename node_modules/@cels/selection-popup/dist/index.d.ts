type TConfig = {
  facebook?: boolean
  twitter?: boolean
  twitterUsername?: string
  backgroundColor?: string
  iconColor?: string
  selectableElements?: (string | Element)[]
}
type TCustomShareButtons = { icon: string; url: string }[]
type TCustomButtons = { icon: string; onclick: () => void }[]
interface ISelectionPopup {
  appendCustomShareButtons(buttons: TCustomShareButtons): ISelectionPopup
  appendCustomButtons(buttons: TCustomButtons): ISelectionPopup
  init(): ISelectionPopup
}

export default {
  config(t: TConfig): ISelectionPopup
}
