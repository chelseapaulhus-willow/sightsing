import Foundation
import Capacitor
import AVFAudio

@objc(SpeakerRoutePlugin)
public class SpeakerRoutePlugin: CAPPlugin {

  // Exposed to JS: SpeakerRoute.applyPreferredRoute()
  @objc public func applyPreferredRoute(_ call: CAPPluginCall) {
    do {
      try ensureSessionConfigured()
      try setPreferredRoute()

      let session = AVAudioSession.sharedInstance()
      let outs = session.currentRoute.outputs.map { ["type": $0.portType.rawValue, "name": $0.portName] }
      call.resolve(["outputs": outs])
    } catch {
      call.reject("Failed to apply route: \(error.localizedDescription)")
    }
  }

  // Exposed to JS: SpeakerRoute.isExternalConnected()
  @objc public func isExternalConnected(_ call: CAPPluginCall) {
    call.resolve(["connected": externalOutputConnected()])
  }

  // Keep routing correct when AirPods/headphones connect/disconnect
  public override func load() {
    NotificationCenter.default.addObserver(
      forName: AVAudioSession.routeChangeNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      do {
        // Re-activate (safe if already active) and re-apply preferred route
        try AVAudioSession.sharedInstance().setActive(true, options: [])
        try self?.setPreferredRoute()
      } catch {
        // best-effort; ignore
      }
    }
  }

  // MARK: - Internals

  private func ensureSessionConfigured() throws {
    let session = AVAudioSession.sharedInstance()
    try session.setCategory(
      .playAndRecord,
      mode: .measurement, // or .default if you prefer
      options: [.allowBluetooth, .allowBluetoothA2DP, .mixWithOthers]
    )
    try session.setActive(true, options: [])
  }

  private func setPreferredRoute() throws {
    let session = AVAudioSession.sharedInstance()
    if externalOutputConnected() {
      try session.overrideOutputAudioPort(.none)     // honor AirPods/headphones/etc.
    } else {
      try session.overrideOutputAudioPort(.speaker)  // route to loudspeaker
    }
  }

  private func externalOutputConnected() -> Bool {
    let outputs = AVAudioSession.sharedInstance().currentRoute.outputs.map { $0.portType }
    let external: Set<AVAudioSession.Port> = [
      .bluetoothA2DP, .bluetoothHFP, .bluetoothLE,
      .headphones, .headsetMic,
      .airPlay, .carAudio
    ]
    return outputs.contains { external.contains($0) }
  }
}
