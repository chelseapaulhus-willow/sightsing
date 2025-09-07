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

    configureAudioSession()
    applyPreferredRoute()                  // set the right route at launch
    observeRouteChanges()                  // keep it up-to-date if AirPods connect/disconnect
    return true
  }
}

@objc(SpeakerRoutePlugin)
public class SpeakerRoutePlugin: CAPPlugin {

  // MARK: - JS API
  // call from JS: SpeakerRoute.applyPreferredRoute()
  @objc func applyPreferredRoute(_ call: CAPPluginCall) {
    do {
      try ensureSessionConfigured()
      try setPreferredRoute()
      call.resolve([
        "outputs": AVAudioSession.sharedInstance().currentRoute.outputs.map { ["type": $0.portType.rawValue, "name": $0.portName] }
      ])
    } catch {
      call.reject("Failed to apply route: \(error.localizedDescription)")
    }
  }

  // Optional: query if external output is connected
  @objc func isExternalConnected(_ call: CAPPluginCall) {
    call.resolve(["connected": externalOutputConnected()])
  }

  // MARK: - Routing logic (mirrors what we discussed)

  private func ensureSessionConfigured() throws {
    let session = AVAudioSession.sharedInstance()
    // Configure category once; safe to call repeatedly
    try session.setCategory(
      .playAndRecord,
      mode: .measurement,
      options: [.allowBluetooth, .allowBluetoothA2DP, .mixWithOthers]
    )
    try session.setActive(true, options: [])
  }

  private func setPreferredRoute() throws {
    let session = AVAudioSession.sharedInstance()
    if externalOutputConnected() {
      try session.overrideOutputAudioPort(.none)     // keep AirPods/headphones/etc.
    } else {
      try session.overrideOutputAudioPort(.speaker)  // phone loudspeaker
    }
  }

  private func externalOutputConnected() -> Bool {
    let outputs = AVAudioSession.sharedInstance().currentRoute.outputs.map { $0.portType }
    var externalTypes: Set<AVAudioSession.Port> = [
      .bluetoothA2DP, .bluetoothHFP, .bluetoothLE,
      .headphones, .headsetMic,
      .airPlay, .carAudio
    ]
    return outputs.contains { externalTypes.contains($0) }
  }
}

// MARK: - Audio routing
extension AppDelegate {

  /// Configure a session that supports mic + BT devices.
  func configureAudioSession() {
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(
        .playAndRecord,
        mode: .measurement,                // good for pitch analysis; use .default if you prefer
        options: [
          .allowBluetooth,
          .allowBluetoothA2DP,             // AirPods / A2DP
          .mixWithOthers                   // optional
        ]
      )
      try session.setActive(true)
    } catch {
      print("Audio session setup failed:", error)
    }
  }

  /// Return true if any external output (AirPods, BT, wired, AirPlay, Car) is active.
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
        try session.overrideOutputAudioPort(.none)   // honor AirPods / external output
      } else {
        try session.overrideOutputAudioPort(.speaker) // phone speaker (not earpiece)
      }
      logAudioRoute(tag)
    } catch {
      print("Failed to apply preferred route:", error)
    }
  }

  func observeRouteChanges() {
    NotificationCenter.default.addObserver(
      forName: AVAudioSession.routeChangeNotification,
      object: nil,
      queue: .main
    ) { [weak self] note in
      self?.applyPreferredRoute(tag: "routeChange")
    }
  }

  func logAudioRoute(_ tag: String) {
    let session = AVAudioSession.sharedInstance()
    let outs = session.currentRoute.outputs
      .map { "\($0.portType.rawValue): \($0.portName)" }
      .joined(separator: ", ")
    print("[AudioRoute \(tag)] -> \(outs)")
  }
}
