import AVFAudio

enum AudioRouteManager {
  static func externalOutputConnected() -> Bool {
    let outputs = AVAudioSession.sharedInstance().currentRoute.outputs.map { $0.portType }
    let external: Set<AVAudioSession.Port> = [
      .bluetoothA2DP, .bluetoothHFP, .bluetoothLE, .headphones, .airPlay, .carAudio
    ]
    return outputs.contains { external.contains($0) }
  }

  static func applyPreferredRoute(tag: String? = nil) {
    let session = AVAudioSession.sharedInstance()
    do {
      if externalOutputConnected() {
        try session.overrideOutputAudioPort(.none)
      } else {
        try session.overrideOutputAudioPort(.speaker)
      }
      if let tag { logAudioRoute(tag) }
    } catch {
      print("Failed to apply preferred route:", error)
    }
  }

  static func logAudioRoute(_ tag: String) {
    let s = AVAudioSession.sharedInstance()
    let outs = s.currentRoute.outputs.map { "\($0.portType.rawValue): \($0.portName)" }.joined(separator: ", ")
    print("[AudioRoute \(tag)] -> \(outs)")
  }
}