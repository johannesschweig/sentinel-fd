export const germanStatusMap: Record<string, string> = {
  'unknown': 'Unbekannt',
  'alarm': 'Alarm',
  'triggered': 'Ausgelöst',
  'idle': 'In Ruhe',
  'deactivated': 'Abgeschaltet'
}

export const detectorTypeLabel: Record<string, string> = {
  'automatic-dialer-transmitter': 'AWUG',
  'tamper-switch': 'Abreissmelder',
  'control-panel': 'Bedienteil',
  'motion-detector': 'Bewegungsmelder',
  'lid-contact': 'Deckelkontakt',
  'area-surveillance-detector': 'Flächenbeobachtungsmelder',
  'coupler': 'Koppler',
  'structure-borne-sound-detector': 'Körperschallmelder',
  'magnetic-contact': 'Magnetkontakt',
  'bolt-contact': 'Riegelkontakt',
  'hold-up-alarm': 'Überfallmelder',
  'hold-up-alarm-addon': 'Überfallmelderzusatz'
}

export const alarmTypeLabel: Record<string, string> = {
  'intrusion': 'Einbruch',
  'sabotage': 'Sabotage',
  'bolt-contact': 'Schließblechkontakt',
  'robbery': 'Überfall'
}