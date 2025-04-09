import { INITIALING_MINI_APPS } from "#scrape/extracted-entity/const.js";
import type { NormalTypeShape } from "./_model.js";

const T = (T: string) => ({
  typeNames: [
    T
  ] as const
});

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
  sendMediaGroup: {
    media: { 
      typeNames: [ "(T.InputMediaAudio | T.InputMediaDocument | T.InputMediaPhoto | T.InputMediaVideo)[]"],
      openApiType: {
        type: "array",
        items: {
          oneOf: [
            { $ref: "#/components/schemas/InputMediaAudio" },
            { $ref: "#/components/schemas/InputMediaDocument" },
            { $ref: "#/components/schemas/InputMediaPhoto" },
            { $ref: "#/components/schemas/InputMediaVideo" },
          ]
        }
      }
    }
  },
  [ INITIALING_MINI_APPS ]: {
    offEvent: T(`T.BindOrUnbindEventHandler`),
    onEvent: T(`T.BindOrUnbindEventHandler`),
    checkHomeScreenStatus: T(`(callback?: (status: "unsupported" | "unknown" | "added" | "missed") => void) => void`),
    downloadFile: T(`(params: DownloadFileParams, callback?: (isAccepted: boolean) => void) => void`),
    sendData: T(`(data: string) => void`),
    switchInlineQuery: T(`(query: string, chat_type?: "users" | "bots" | "groups" | "channels") => void`),
    openLink: T(`(url: string, options?: { try_instant_view: boolean }) => void`),
    openTelegramLink: T(`(url: string) => void`),
    isVersionAtLeast: T(`(version: string) => boolean`),
    openInvoice: T(`(url: string, callback?: (invoiceStatus: unknown) => void) => void`),
    requestEmojiStatusAccess: T(`(url: string, callback?: (invoiceStatus: unknown) => void) => void`),
    shareToStory: T(`(mediaUrl: string, options?: StoryShareParams) => void`),
    setEmojiStatus: T(`(custom_emoj_id: string, params?: EmojiStatusParams, callback?: (isStatusSet: boolean) => void) => void`),
    setHeaderColor: T(`(color: string) => void`),
    setBackgroundColor: T(`(color: string) => void`),
    setBottomBarColor: T(`(color: string) => void`),
    shareMessage: T(`(msg_id: number, options?: (isSent: boolean) => void) => void`),
    showScanQrPopup: T(`(params: ScanQrPopupParams, callback?: (data: string) => boolean) => void`),
    showPopup: T(`(params: PopupParams, callback?: (buttonId: string) => void) => void`),
    showAlert: T(`(message: string, callback?: () => void) => void`),
    showConfirm: T(`(message: string, callback?: (isOk: boolean) => void) => void`),
    readTextFromClipboard: T(`(callback?: (text: string) => void) => void`),
    requestWriteAccess: T(`(callback?: (isGranted: boolean) => void) => void`),
    requestContact: T(`(callback?: (isShared: boolean) => void) => void`),
  },
  Accelerometer: {
    start: T("(params: AccelerometerStartParams, callback?: (isStarted: boolean) => void) => Accelerometer"),
    stop: T("(callback?: (isStopped: boolean) => void) => Accelerometer")
  },
  BottomButton: {
    onClick: T("(callback: () => void) => BottomButton"),
    offClick: T("(callback: () => void) => BottomButton"),
    showProgress: T("(callback: (leaveActive: boolean) => void) => BottomButton"),
    setParams: T(`
      (params: { 
        text: string,
        color: string,
        has_shine_effect: boolean,
        position: unknown,
        is_active: boolean,
        is_visible: boolean
      }) => BottomButton
    `.trim()),
    setText: T("(text: string) => BottomButton")
  },
  BiometricManager: {
    biometricType: T(`"finger" | "face" | "unknown"`),
    init: T("(callback?: () => void) => BiometricManager"),
    requestAccess: T("(params: BiometricRequestAccessParams, callback?: (isGranted: boolean) => void) => BiometricManager"),
    authenticate: T("(params: BiometricAuthenticateParams, callback?: (isAuthenticated: boolean) => void) => BiometricManager"),
    updateBiometricToken: T("(token: string, callback?: (isTokenUpdated: boolean) => void) => BiometricManager"),
  },
  CloudStorage: {
    setItem: T("(key: string, value: string, callback?: (error: unknown | null) => void) => CloudStorage"),
    getItem: T("(key: string, callback: (error: unknown | null, value: string | null) => void) => CloudStorage"),
    getItems: T("(keys: string[], callback: (error: string | null, values: Record<string, string> | null) => void) => CloudStorage"),
    removeItem: T("(key: string, callback?: (error: string | null, isDeleted: boolean) => void) => CloudStorage"),
    removeItems: T("(keys: string[], callback?: (error: string | null, isDeleted: boolean) => void) => CloudStorage"),
    getKeys: T("(callback: (error: string | null, keys: string[] | null) => void) => CloudStorage"),
  },
  DeviceOrientation: {
    start: T("(params: DeviceOrientationStartParams, callback?: (isTracking: boolean) => void) => void"),
    stop: T("(callback?: (isStopped: boolean) => void) => void")
  },
  Gyroscope: {
    start: T("(params: GyroscopeStartParams, callback?: (isTracking: boolean) => void) => void"),
    stop: T("(callback?: (isStopped: boolean) => void) => void")
  },
  HapticFeedback: {
    impactOccurred: T(`(style: "light" | "medium" | "heavy" | "rigid" | "soft") => void`),
    notificationOccurred: T(`(type: "error" | "success" | "warning") => void`),
  },
  LocationManager: {
    init: T("(callback?: () => void) => LocationManager"),
    getLocation: T("(callback: (location: LocationData | null) => void) => LocationManager")
  },
  SettingsButton: {
    onClick: T("(callback: () => void) => SettingsButton"),
    offClick: T("(callback: () => void) => SettingsButton"),
  }
} as const;
