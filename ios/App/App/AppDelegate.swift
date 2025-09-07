import UIKit
import AVFAudio
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {

    configureAudioSession()          // set category/mode/options and activate
    applyPreferredRoute(tag: "launch")
    observeRouteChanges()            // react to AirPods/headphones connect/disconnect

    return true
  }
}

// MARK: - Audio routing
extension AppDelegate {

  /// Configure a session that supports mic + Bluetooth devices.
  /// .measurement is good for pitch analysis; use .default if you prefer.
  func configureAudioSession() {
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(
        .playAndRecord,
        mode: .measurement,
        options: [
          .allowBluetooth,       // classic BT headsets (HFP)
          .allowBluetoothA2DP,   // AirPods/A2DP
          .mixWithOthers         // optional: don't interrupt other audio
        ]
      )
      try session.setActive(true)
    } catch {
      print("Audio session setup failed:", error)
    }
  }

  /// True if any external output (AirPods/BT/wired/AirPlay/Car) is active.
  func isExternalOutputConnected() -> Bool {
    let outputs = AVAudioSession.sharedInstance().currentRoute.outputs.map { $0.portType }
    let externalTypes: Set<AVAudioSession.Port> = [
      .bluetoothA2DP, .bluetoothHFP, .bluetoothLE,
      .headphones, .headsetMic,
      .airPlay, .carAudio
    ]
    return outputs.contains { externalTypes.contains($0) }
  }

  /// Force speaker only when there’s no external output.
  func applyPreferredRoute(tag: String = "applyPreferredRoute") {
    let session = AVAudioSession.sharedInstance()
    do {
      if isExternalOutputConnected() {
        try session.overrideOutputAudioPort(.none)     // honor AirPods/external output
      } else {
        try session.overrideOutputAudioPort(.speaker)  // phone loudspeaker (not earpiece)
      }
      logAudioRoute(tag)
    } catch {
      print("Failed to apply preferred route:", error)
    }
  }

  /// Keep routing correct when outputs change (e.g., AirPods connect/disconnect).
  func observeRouteChanges() {
    NotificationCenter.default.addObserver(
      forName: AVAudioSession.routeChangeNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      self?.applyPreferredRoute(tag: "routeChange")
    }
  }

  /// Handy for debugging—see where iOS is actually sending audio.
  func logAudioRoute(_ tag: String) {
    let session = AVAudioSession.sharedInstance()
    let outs = session.currentRoute.outputs
      .map { "\($0.portType.rawValue): \($0.portName)" }
      .joined(separator: ", ")
    print("[AudioRoute \(tag)] -> \(outs)")
  }
}
